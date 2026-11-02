"use client";

import { useEffect } from "react";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectTicket } from "../ticketsSlice";
import { fetchTicketById, fetchTickets } from "../ticketsThunks";
import TicketItem from "./TicketItem";

export default function TicketList() {
  const dispatch = useAppDispatch();
  const { items, selectedId, listLoading, listError } = useAppSelector((s) => s.tickets);
  const runningTicketId = useAppSelector((s) => s.triage.runningTicketId);

  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]);

  function handleSelect(id: string) {
    dispatch(selectTicket(id));
    dispatch(fetchTicketById(id));
  }

  if (listLoading && items.length === 0) {
    return (
      <div className="flex justify-center py-10 text-indigo-600">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  if (listError) {
    return (
      <div role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
        <p>{listError}</p>
        <Button variant="secondary" className="mt-3" onClick={() => dispatch(fetchTickets())}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((ticket) => (
        <TicketItem
          key={ticket.id}
          ticket={ticket}
          selected={ticket.id === selectedId}
          processing={ticket.id === runningTicketId}
          onSelect={handleSelect}
        />
      ))}
    </ul>
  );
}