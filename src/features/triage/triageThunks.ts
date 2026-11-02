import { createAsyncThunk } from "@reduxjs/toolkit";
import { toRejectValue, type RejectValue } from "@/lib/thunk-error";
import { ticketApi } from "@/services/ticketApi";
import type { TriageResult } from "@/types";

export const runTriage = createAsyncThunk<
  { ticketId: string; result: TriageResult },
  string,
  { rejectValue: RejectValue }
>("triage/run", async (ticketId, { rejectWithValue }) => {
  try {
    const data = await ticketApi.triage(ticketId);
    return { ticketId: data.ticketId, result: data.result };
  } catch (error) {
    return rejectWithValue(toRejectValue(error));
  }
});