import Card from "@/components/ui/Card";
import { formatDateTime } from "@/lib/format";
import type { TriageResult } from "@/types";
import ResolutionBadge from "./ResolutionBadge";

export default function ResultCard({ result }: { result: TriageResult }) {
  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-bold text-slate-900">Agent Result</h3>
        <ResolutionBadge tag={result.resolutionTag} />
      </div>

      <div className="mt-4">
        <h4 className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Customer Response Draft
        </h4>
        <p className="mt-1 whitespace-pre-wrap rounded-lg bg-indigo-50 p-3 text-sm leading-relaxed text-slate-800">
          {result.customerDraft}
        </p>
      </div>

      {result.reasoning && (
        <div className="mt-4">
          <h4 className="text-xs font-medium uppercase tracking-wide text-slate-500">Reasoning</h4>
          <p className="mt-1 text-sm text-slate-700">{result.reasoning}</p>
        </div>
      )}

      <p className="mt-4 text-xs text-slate-500">Generated {formatDateTime(result.createdAt)}</p>
    </Card>
  );
}