import { cn } from "@/lib/cn";
import type { TicketStatus } from "@/types";

const styles: Record<TicketStatus, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "bg-slate-100 text-slate-700 ring-slate-200" },
  PROCESSING: { label: "Processing", className: "animate-pulse bg-amber-50 text-amber-700 ring-amber-200" },
  RESOLVED: { label: "Resolved", className: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
};

export default function StatusBadge({ status }: { status: TicketStatus }) {
  const { label, className } = styles[status];
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1", className)}>
      {label}
    </span>
  );
}