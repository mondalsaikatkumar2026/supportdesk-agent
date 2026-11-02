"use client";

import Button from "@/components/ui/Button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { runTriage } from "../triageThunks";

export default function RunAgentButton({
  ticketId,
  disabled,
}: {
  ticketId: string;
  disabled?: boolean;
}) {
  const dispatch = useAppDispatch();
  const running = useAppSelector((s) => s.triage.runningTicketId !== null);
  const runningThis = useAppSelector((s) => s.triage.runningTicketId === ticketId);

  return (
    <div>
      <Button
        onClick={() => dispatch(runTriage(ticketId))}
        loading={runningThis}
        disabled={disabled || running}
        className="w-full sm:w-auto"
      >
        {runningThis ? "Agent is working…" : "Run AI Triage Agent"}
      </Button>
      {runningThis && (
        <p className="mt-2 text-xs text-slate-500" aria-live="polite">
          The agent is reading the ticket and may call tools. This can take several seconds.
        </p>
      )}
    </div>
  );
}