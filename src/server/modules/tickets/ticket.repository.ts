import { prisma } from "@/server/db/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { ResolutionTag, TicketStatus } from "@/generated/prisma/enums";

const latestTriage = {
  triageResults: { orderBy: { createdAt: "desc" }, take: 1 },
} as const;

export const ticketRepository = {
  list: () => prisma.ticket.findMany({ orderBy: { id: "asc" } }),

  findById: (id: string) =>
    prisma.ticket.findUnique({ where: { id }, include: latestTriage }),

  /** Returns true only if this call moved the ticket into PROCESSING. */
  async claimForProcessing(id: string) {
    const result = await prisma.ticket.updateMany({
      where: { id, status: { not: "PROCESSING" } },
      data: { status: "PROCESSING" },
    });
    return result.count === 1;
  },

  setStatus: (id: string, status: TicketStatus) =>
    prisma.ticket.update({ where: { id }, data: { status } }),

  async saveTriageResult(input: {
    ticketId: string;
    triggeredById: string;
    customerDraft: string;
    resolutionTag: ResolutionTag;
    reasoning: string;
    trace: Prisma.InputJsonValue;
  }) {
    const [result] = await prisma.$transaction([
      prisma.triageResult.create({ data: input }),
      prisma.ticket.update({ where: { id: input.ticketId }, data: { status: "RESOLVED" } }),
    ]);
    return result;
  },
};