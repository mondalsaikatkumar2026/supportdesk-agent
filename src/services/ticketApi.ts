import type { Ticket, TicketDetail, TriageResult } from "@/types";
import { apiFetch } from "./api-client";

export const ticketApi = {
  list: async () => (await apiFetch<{ tickets: Ticket[] }>("/tickets")).tickets,
  get: async (id: string) => (await apiFetch<{ ticket: TicketDetail }>(`/tickets/${id}`)).ticket,
  triage: (id: string) =>
    apiFetch<{ ticketId: string; status: "RESOLVED"; result: TriageResult }>(
      `/tickets/${id}/triage`,
      { method: "POST" },
    ),
};