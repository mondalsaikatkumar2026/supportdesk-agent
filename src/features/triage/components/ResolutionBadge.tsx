import { cn } from "@/lib/cn";
import type { ResolutionTag } from "@/types";

const styles: Record<ResolutionTag, { label: string; className: string }> = {
  AUTO_RESOLVE: { label: "[Auto-Resolve]", className: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  ESCALATE_TO_SALES: { label: "[Escalate to Sales]", className: "bg-amber-50 text-amber-800 ring-amber-200" },
};

export default function ResolutionBadge({ tag }: { tag: ResolutionTag }) {
  const { label, className } = styles[tag];
  return (
    <span className={cn("inline-flex rounded-md px-2.5 py-1 text-sm font-semibold ring-1", className)}>
      {label}
    </span>
  );
}