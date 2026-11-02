import { createSlice } from "@reduxjs/toolkit";
import { selectTicket } from "@/features/tickets/ticketsSlice";
import { runTriage } from "./triageThunks";

interface TriageState {
  runningTicketId: string | null;
  error: { ticketId: string; code: string; message: string } | null;
}

const initialState: TriageState = { runningTicketId: null, error: null };

const triageSlice = createSlice({
  name: "triage",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(runTriage.pending, (state, action) => {
        state.runningTicketId = action.meta.arg;
        state.error = null;
      })
      .addCase(runTriage.fulfilled, (state) => {
        state.runningTicketId = null;
      })
      .addCase(runTriage.rejected, (state, action) => {
        state.runningTicketId = null;
        state.error = {
          ticketId: action.meta.arg,
          code: action.payload?.code ?? "UNKNOWN_ERROR",
          message: action.payload?.message ?? "The agent failed. Please try again.",
        };
      })
      .addCase(selectTicket, (state) => {
        state.error = null;
      });
  },
});

export default triageSlice.reducer;