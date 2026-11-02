export type TicketStatus = "PENDING" | "PROCESSING" | "RESOLVED";
export type ResolutionTag = "AUTO_RESOLVE" | "ESCALATE_TO_SALES";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  customerId: string;
  orderId: string | null;
  message: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
}

export type TraceStep =
  | {
      step: number;
      type: "ticket_received";
      at: string;
      ticketId: string;
      customerId: string;
      orderId: string | null;
      message: string;
    }
  | {
      step: number;
      type: "tool_call";
      at: string;
      tool: string;
      parameters: unknown;
      rawOutput: unknown;
      error: string | null;
      durationMs: number;
      modelNote: string | null;
    }
  | {
      step: number;
      type: "final_response";
      at: string;
      customerDraft: string;
      resolutionTag: string;
      reasoning: string;
    };

export interface AgentTrace {
  model: string;
  totalDurationMs: number;
  steps: TraceStep[];
}

export interface TriageResult {
  id: string;
  customerDraft: string;
  resolutionTag: ResolutionTag;
  resolutionLabel: string;
  reasoning: string | null;
  trace: AgentTrace;
  createdAt: string;
}

export interface TicketDetail extends Ticket {
  latestTriage: TriageResult | null;
}