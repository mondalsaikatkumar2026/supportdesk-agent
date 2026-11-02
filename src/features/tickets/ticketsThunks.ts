import { createAsyncThunk } from "@reduxjs/toolkit";
import { toRejectValue, type RejectValue } from "@/lib/thunk-error";
import { ticketApi } from "@/services/ticketApi";
import type { Ticket, TicketDetail } from "@/types";

type Config = { rejectValue: RejectValue };

export const fetchTickets = createAsyncThunk<Ticket[], void, Config>(
  "tickets/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await ticketApi.list();
    } catch (error) {
      return rejectWithValue(toRejectValue(error));
    }
  },
);

export const fetchTicketById = createAsyncThunk<TicketDetail, string, Config>(
  "tickets/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      return await ticketApi.get(id);
    } catch (error) {
      return rejectWithValue(toRejectValue(error));
    }
  },
);