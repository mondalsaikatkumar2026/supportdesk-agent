import type { Content, GenerateContentResponse, Part } from "@google/genai";
import { env } from "@/server/config/env";
import { AppError } from "@/server/utils/errors";
import { finalAnswerSchema, type FinalAnswer } from "./agent.schema";
import { buildUserPrompt, SYSTEM_PROMPT, type TicketForAgent } from "./agent.prompt";
import { gemini } from "./gemini.client";
import { toolDeclarations } from "./tools/definitions";
import { executeTool } from "./tools/registry";
import { TraceBuilder, type AgentTrace } from "./trace";

const MAX_STEPS = 4;

export type AgentOutcome = FinalAnswer & { trace: AgentTrace };

function mapGeminiError(error: unknown): AppError {
  const status = (error as { status?: number })?.status;
  console.error("Gemini error:", status, (error as Error)?.message);

  if (status === 429) {
    return new AppError(429, "LLM_RATE_LIMITED", "The AI service is busy. Please try again in a minute.");
  }
  if (status === 400 || status === 401 || status === 403 || status === 404) {
    return new AppError(502, "LLM_CONFIG_ERROR", "The AI service rejected the request. Check GEMINI_API_KEY and GEMINI_MODEL.");
  }
  return new AppError(502, "LLM_ERROR", "The AI service is unavailable. Please try again.");
}

async function callModel(contents: Content[]): Promise<GenerateContentResponse> {
  try {
    return await gemini.models.generateContent({
      model: env.GEMINI_MODEL,
      contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        tools: [{ functionDeclarations: toolDeclarations }],
      },
    });
  } catch (error) {
    throw mapGeminiError(error);
  }
}

function extractText(content: Content): string {
  return (content.parts ?? [])
    .filter((part) => typeof part.text === "string" && !part.thought)
    .map((part) => part.text)
    .join("")
    .trim();
}

function parseFinalAnswer(text: string): FinalAnswer | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end <= start) return null;

  try {
    const result = finalAnswerSchema.safeParse(JSON.parse(text.slice(start, end + 1)));
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

export async function runTriageAgent(ticket: TicketForAgent): Promise<AgentOutcome> {
  const trace = new TraceBuilder(env.GEMINI_MODEL);
  trace.add({
    type: "ticket_received",
    ticketId: ticket.id,
    customerId: ticket.customerId,
    orderId: ticket.orderId,
    message: ticket.message,
  });

  const contents: Content[] = [{ role: "user", parts: [{ text: buildUserPrompt(ticket) }] }];
  let repaired = false;

  for (let step = 0; step < MAX_STEPS; step++) {
    const response = await callModel(contents);
    const modelContent = response.candidates?.[0]?.content;
    if (!modelContent) {
      throw new AppError(502, "LLM_EMPTY_RESPONSE", "The AI service returned an empty response.");
    }

    // Keep the model's reply unchanged: it carries Gemini 3 thought signatures.
    contents.push(modelContent);

    const calls = response.functionCalls ?? [];
    const text = extractText(modelContent);

    if (calls.length === 0) {
      const answer = parseFinalAnswer(text);
      if (answer) {
        trace.add({ type: "final_response", ...answer });
        return { ...answer, trace: trace.build() };
      }
      if (repaired) {
        throw new AppError(502, "LLM_BAD_OUTPUT", "The AI service returned an invalid answer format.");
      }
      repaired = true;
      contents.push({
        role: "user",
        parts: [{ text: "Your reply was not valid JSON in the required shape. Reply again with ONLY the JSON object." }],
      });
      continue;
    }

    const responseParts: Part[] = [];
    for (const call of calls) {
      const name = call.name ?? "";
      const startedAt = Date.now();
      const result = await executeTool(name, call.args ?? {});

      trace.add({
        type: "tool_call",
        tool: name,
        parameters: call.args ?? {},
        rawOutput: result.ok ? result.output : null,
        error: result.ok ? null : result.error,
        durationMs: Date.now() - startedAt,
        modelNote: text || null,
      });

      responseParts.push({
        functionResponse: {
          id: call.id,
          name,
          response: result.ok ? { output: result.output } : { error: result.error },
        },
      });
    }
    contents.push({ role: "user", parts: responseParts });
  }

  throw new AppError(502, "AGENT_LOOP_LIMIT", "The agent could not finish within the allowed steps.");
}