import type { Prisma } from "@/generated/prisma/client";
import { AppError } from "@/server/utils/errors";
import { runTriageAgent } from "../agent/agent.service";
import { ticketRepository } from "./ticket.repository";

const TAG_LABELS = {
  AUTO_RESOLVE: "Auto-Resolve",
  ESCALATE_TO_SALES: "Escalate to Sales",
} as const;

type TriageRow = {
  id: string;
  customerDraft: string;
  resolutionTag: keyof typeof TAG_LABELS;
  reasoning: string | null;
  trace: unknown;
  createdAt: Date;
};

function toTriageDto(row: TriageRow) {
  return {
    id: row.id,
    customerDraft: row.customerDraft,
    resolutionTag: row.resolutionTag,
    resolutionLabel: TAG_LABELS[row.resolutionTag],
    reasoning: row.reasoning,
    trace: row.trace,
    createdAt: row.createdAt,
  };
}

export const ticketService = {
  list: () => ticketRepository.list(),

  async getById(id: string) {
    const ticket = await ticketRepository.findById(id);
    if (!ticket) throw new AppError(404, "TICKET_NOT_FOUND", `Ticket ${id} not found`);

    const { triageResults, ...rest } = ticket;
    return { ...rest, latestTriage: triageResults[0] ? toTriageDto(triageResults[0]) : null };
  },

  async runTriage(id: string, userId: string) {
    const ticket = await ticketRepository.findById(id);
    if (!ticket) throw new AppError(404, "TICKET_NOT_FOUND", `Ticket ${id} not found`);

    const previousStatus = ticket.status;
    const claimed = await ticketRepository.claimForProcessing(id);
    if (!claimed) {
      throw new AppError(409, "ALREADY_PROCESSING", "This ticket is already being processed");
    }

    try {
      const outcome = await runTriageAgent({
        id: ticket.id,
        customerId: ticket.customerId,
        orderId: ticket.orderId,
        message: ticket.message,
      });

      const saved = await ticketRepository.saveTriageResult({
        ticketId: ticket.id,
        triggeredById: userId,
        customerDraft: outcome.customerDraft,
        resolutionTag: outcome.resolutionTag,
        reasoning: outcome.reasoning,
        trace: outcome.trace as unknown as Prisma.InputJsonValue,
      });

      return { ticketId: ticket.id, status: "RESOLVED" as const, result: toTriageDto(saved) };
    } catch (error) {
      // Put the ticket back so it never stays stuck in PROCESSING.
      await ticketRepository
        .setStatus(id, previousStatus)
        .catch((e) => console.error("Failed to restore ticket status:", e));
      throw error;
    }
  },
};