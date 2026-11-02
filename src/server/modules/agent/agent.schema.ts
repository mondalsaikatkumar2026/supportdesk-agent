import { z } from "zod";

export const finalAnswerSchema = z.object({
  customerDraft: z.string().trim().min(1).max(2000),
  resolutionTag: z.enum(["AUTO_RESOLVE", "ESCALATE_TO_SALES"]),
  reasoning: z.string().trim().min(1).max(1000),
});

export type FinalAnswer = z.infer<typeof finalAnswerSchema>;