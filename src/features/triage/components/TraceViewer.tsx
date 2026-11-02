"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import type { AgentTrace, TraceStep } from "@/types";

function Json({ value }: { value: unknown }) {
  return (
    <pre className="mt-1 overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs leading-relaxed text-slate-100">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-3">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</div>
      {children}
    </div>
  );
}

function Step({ step }: { step: TraceStep }) {
  if (step.type === "ticket_received") {
    return (
      <>
        <h4 className="font-semibold text-slate-900">Ticket received</h4>
        <Field label="Message">
          <p className="mt-1 text-sm text-slate-700">{step.message}</p>
        </Field>
        <Field label="Context">
          <p className="mt-1 text-sm text-slate-700">
            Customer {step.customerId} · Order {step.orderId ?? "none"}
          </p>
        </Field>
      </>
    );
  }

  if (step.type === "tool_call") {
    return (
      <>
        <h4 className="font-semibold text-slate-900">
          Tool Called: <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">{step.tool}</code>
          <span className="ml-2 text-xs font-normal text-slate-500">{step.durationMs} ms</span>
        </h4>
        <Field label="Parameters">
          <Json value={step.parameters} />
        </Field>
        <Field label="Raw Output">
          {step.error ? (
            <p className="mt-1 rounded-lg bg-red-50 p-3 text-sm text-red-700">Error: {step.error}</p>
          ) : (
            <Json value={step.rawOutput} />
          )}
        </Field>
        <Field label="Reasoning">
          <p className="mt-1 text-sm text-slate-700">
            {step.modelNote ?? "The model returned no text for this step."}
          </p>
        </Field>
      </>
    );
  }

  return (
    <>
      <h4 className="font-semibold text-slate-900">Final response</h4>
      <Field label="Resolution tag">
        <p className="mt-1 text-sm text-slate-700">{step.resolutionTag}</p>
      </Field>
      <Field label="Reasoning">
        <p className="mt-1 text-sm text-slate-700">{step.reasoning}</p>
      </Field>
    </>
  );
}

export default function TraceViewer({ trace }: { trace: AgentTrace }) {
  const [open, setOpen] = useState(false);
  const toolCalls = trace.steps.filter((s) => s.type === "tool_call").length;

  return (
    <Card>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="agent-trace-panel"
        className="flex w-full items-center justify-between text-left"
      >
        <span>
          <span className="block text-base font-bold text-slate-900">Agent Execution Trace</span>
          <span className="block text-xs text-slate-500">
            {trace.steps.length} steps · {toolCalls} tool call{toolCalls === 1 ? "" : "s"} ·{" "}
            {trace.totalDurationMs} ms · {trace.model}
          </span>
        </span>
        <span className={cn("text-slate-500 transition-transform", open && "rotate-180")} aria-hidden>
          ▼
        </span>
      </button>

      {open && (
        <ol id="agent-trace-panel" className="mt-4 space-y-4 border-t border-slate-200 pt-4">
          {trace.steps.map((step) => (
            <li key={step.step} className="rounded-lg border border-slate-200 p-3 sm:p-4">
              <div className="mb-1 text-xs font-medium text-indigo-600">Step {step.step}</div>
              <Step step={step} />
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}