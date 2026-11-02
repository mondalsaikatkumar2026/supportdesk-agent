import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Ticket, TicketDetail } from "@/types";
import { logout } from "@/features/auth/authThunks";
import { runTriage } from "@/features/triage/triageThunks";
import { fetchTicketById, fetchTickets } from "./ticketsThunks";

interface TicketsState {
  items: Ticket[];
  selectedId: string | null;
  selected: TicketDetail | null;
  listLoading: boolean;
  listError: string | null;
  detailLoading: boolean;
  detailError: string | null;
}

const initialState: TicketsState = {
  items: [],
  selectedId: null,
  selected: null,
  listLoading: false,
  listError: null,
  detailLoading: false,
  detailError: null,
};

const ticketsSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {
    selectTicket(state, action: PayloadAction<string | null>) {
      state.selectedId = action.payload;
      state.selected = null;
      state.detailError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.listLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.listLoading = false;
        state.listError = action.payload?.message ?? "Could not load tickets";
      })
      .addCase(fetchTicketById.pending, (state, action) => {
        if (action.meta.arg === state.selectedId) {
          state.detailLoading = true;
          state.detailError = null;
        }
      })
      .addCase(fetchTicketById.fulfilled, (state, action) => {
        if (action.payload.id !== state.selectedId) return;
        state.detailLoading = false;
        state.selected = action.payload;
      })
      .addCase(fetchTicketById.rejected, (state, action) => {
        if (action.meta.arg !== state.selectedId) return;
        state.detailLoading = false;
        state.detailError = action.payload?.message ?? "Could not load ticket";
      })
      .addCase(runTriage.fulfilled, (state, action) => {
        const { ticketId, result } = action.payload;
        const item = state.items.find((t) => t.id === ticketId);
        if (item) item.status = "RESOLVED";
        if (state.selected?.id === ticketId) {
          state.selected.status = "RESOLVED";
          state.selected.latestTriage = result;
        }
      })
      .addCase(logout.fulfilled, () => initialState);
  },
});

export const { selectTicket } = ticketsSlice.actions;
export default ticketsSlice.reducer;