import { z } from "zod";
import { getOrderStatus, getUserTier } from "./mock-tools";

export type ToolResult = { ok: true; output: unknown } | { ok: false; error: string };

type ToolDefinition = {
  schema: z.ZodType;
  run: (args: unknown) => unknown;
};

function defineTool<S extends z.ZodType>(
  schema: S,
  run: (args: z.infer<S>) => unknown,
): ToolDefinition {
  return { schema, run: (args) => run(args as z.infer<S>) };
}

// A Map (not a plain object) so names like "constructor" can never match.
const tools = new Map<string, ToolDefinition>([
  [
    "get_order_status",
    defineTool(z.object({ order_id: z.string().trim().min(1) }), (args) =>
      getOrderStatus(args.order_id),
    ),
  ],
  [
    "get_user_tier",
    defineTool(z.object({ user_id: z.string().trim().min(1) }), (args) =>
      getUserTier(args.user_id),
    ),
  ],
]);

export async function executeTool(name: string, args: unknown): Promise<ToolResult> {
  const tool = tools.get(name);
  if (!tool) return { ok: false, error: `Unknown tool: ${name}` };

  const parsed = tool.schema.safeParse(args);
  if (!parsed.success) {
    const detail = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    return { ok: false, error: `Invalid parameters: ${detail}` };
  }

  try {
    return { ok: true, output: await tool.run(parsed.data) };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Tool execution failed" };
  }
}