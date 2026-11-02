import { z } from "zod";
import { getOrderStatus, getUserTier } from "./mock-tools";

export type ToolResult = { ok: true; output: unknown } | { ok: false; error: string };

const tools: Record<string, { schema: z.ZodType<Record<string, string>>; run: (args: any) => unknown }> = {
  get_order_status: {
    schema: z.object({ order_id: z.string().trim().min(1) }),
    run: (args: { order_id: string }) => getOrderStatus(args.order_id),
  },
  get_user_tier: {
    schema: z.object({ user_id: z.string().trim().min(1) }),
    run: (args: { user_id: string }) => getUserTier(args.user_id),
  },
};

export async function executeTool(name: string, args: unknown): Promise<ToolResult> {
  const tool = tools[name];
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