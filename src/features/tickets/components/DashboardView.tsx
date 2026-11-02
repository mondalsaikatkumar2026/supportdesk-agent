"use client";

import UserMenu from "@/features/auth/components/UserMenu";
import { cn } from "@/lib/cn";
import { useAppSelector } from "@/store/hooks";
import TicketDetail from "./TicketDetail";
import TicketList from "./TicketList";

export default function DashboardView() {
  const hasSelection = useAppSelector((s) => s.tickets.selectedId !== null);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold text-slate-900">
            SupportDesk <span className="text-indigo-600">Agent</span>
          </h1>
          <UserMenu />
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[22rem_1fr]">
        <section aria-label="Tickets" className={cn(hasSelection && "hidden lg:block")}>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Tickets</h2>
          <TicketList />
        </section>

        <section aria-label="Ticket details" className={cn(!hasSelection && "hidden lg:block")}>
          <TicketDetail />
        </section>
      </main>
    </div>
  );
}