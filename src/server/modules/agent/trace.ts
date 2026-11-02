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

export type AgentTrace = {
  model: string;
  totalDurationMs: number;
  steps: TraceStep[];
};

type NewStep = TraceStep extends infer T ? (T extends TraceStep ? Omit<T, "step" | "at"> : never) : never;

export class TraceBuilder {
  private steps: TraceStep[] = [];
  private readonly startedAt = Date.now();

  constructor(private readonly model: string) {}

  add(step: NewStep) {
    this.steps.push({ ...step, step: this.steps.length + 1, at: new Date().toISOString() } as TraceStep);
  }

  build(): AgentTrace {
    return { model: this.model, totalDurationMs: Date.now() - this.startedAt, steps: this.steps };
  }
}