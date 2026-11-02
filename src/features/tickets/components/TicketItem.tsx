import { cn } from "@/lib/cn";
import type { Ticket, TicketStatus } from "@/types";
import StatusBadge from "./StatusBadge";

export default function TicketItem({
  ticket,
  selected,
  processing,
  onSelect,
}: {
  ticket: Ticket;
  selected: boolean;
  processing: boolean;
  onSelect: (id: string) => void;
}) {
  const status: TicketStatus = processing ? "PROCESSING" : ticket.status;

  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(ticket.id)}
        aria-current={selected}
        className={cn(
          "w-full rounded-xl border p-4 text-left transition",
          selected
            ? "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500"
            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="font-semibold text-slate-900">{ticket.id}</span>
          <StatusBadge status={status} />
        </div>
        <p className="mt-1 text-xs text-slate-500">{ticket.customerId}</p>
        <p className="mt-2 line-clamp-2 text-sm text-slate-700">{ticket.message}</p>
      </button>
    </li>
  );
}