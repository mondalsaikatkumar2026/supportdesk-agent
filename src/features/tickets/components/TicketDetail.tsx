"use client";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";
import { formatDateTime } from "@/lib/format";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import ResultCard from "@/features/triage/components/ResultCard";
import RunAgentButton from "@/features/triage/components/RunAgentButton";
import TraceViewer from "@/features/triage/components/TraceViewer";
import { selectTicket } from "../ticketsSlice";
import { fetchTicketById } from "../ticketsThunks";
import StatusBadge from "./StatusBadge";

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-0.5 text-sm text-slate-900">{value}</dd>
    </div>
  );
}

export default function TicketDetail() {
  const dispatch = useAppDispatch();
  const { selectedId, selected, detailLoading, detailError } = useAppSelector((s) => s.tickets);
  const { runningTicketId, error: triageError } = useAppSelector((s) => s.triage);

  if (!selectedId) {
    return (
      <Card className="hidden text-center text-sm text-slate-500 lg:block">
        Select a ticket from the list to see its details.
      </Card>
    );
  }

  const backButton = (
    <Button variant="ghost" onClick={() => dispatch(selectTicket(null))} className="mb-3 !px-2 lg:hidden">
      ← Back to tickets
    </Button>
  );

  if (detailError) {
    return (
      <div>
        {backButton}
        <div role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
          <p>{detailError}</p>
          <Button variant="secondary" className="mt-3" onClick={() => dispatch(fetchTicketById(selectedId))}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (detailLoading || !selected) {
    return (
      <div>
        {backButton}
        <div className="flex justify-center py-10 text-indigo-600">
          <Spinner className="h-6 w-6" />
        </div>
      </div>
    );
  }

  const isRunning = runningTicketId === selected.id;
  const displayStatus = isRunning ? "PROCESSING" : selected.status;
  const errorForThis = triageError && triageError.ticketId === selected.id ? triageError : null;

  return (
    <div className="space-y-4">
      {backButton}

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-bold text-slate-900">{selected.id}</h2>
          <StatusBadge status={displayStatus} />
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Meta label="Customer" value={selected.customerId} />
          <Meta label="Order" value={selected.orderId ?? "None"} />
          <Meta label="Created" value={formatDateTime(selected.createdAt)} />
        </dl>

        <div className="mt-5">
          <h3 className="text-xs font-medium uppercase tracking-wide text-slate-500">Message</h3>
          <p className="mt-1 rounded-lg bg-slate-50 p-3 text-sm leading-relaxed text-slate-800">
            {selected.message}
          </p>
        </div>

        <div className="mt-5">
          <RunAgentButton ticketId={selected.id} disabled={selected.status === "PROCESSING"} />
        </div>

        {errorForThis && (
          <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorForThis.message}
          </p>
        )}
      </Card>

      {selected.latestTriage && !isRunning && (
        <>
          <ResultCard result={selected.latestTriage} />
          <TraceViewer trace={selected.latestTriage.trace} />
        </>
      )}
    </div>
  );
}