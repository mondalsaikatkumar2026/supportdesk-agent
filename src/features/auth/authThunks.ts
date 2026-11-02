import { createAsyncThunk } from "@reduxjs/toolkit";
import { toRejectValue, type RejectValue } from "@/lib/thunk-error";
import { authApi } from "@/services/authApi";
import type { User } from "@/types";

type Config = { rejectValue: RejectValue };

export const fetchMe = createAsyncThunk<User, void, Config>(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      return (await authApi.me()).user;
    } catch (error) {
      return rejectWithValue(toRejectValue(error));
    }
  },
);

export const login = createAsyncThunk<User, { email: string; password: string }, Config>(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      return (await authApi.login(credentials)).user;
    } catch (error) {
      return rejectWithValue(toRejectValue(error));
    }
  },
);

export const register = createAsyncThunk<
  User,
  { name: string; email: string; password: string },
  Config
>("auth/register", async (input, { rejectWithValue }) => {
  try {
    return (await authApi.register(input)).user;
  } catch (error) {
    return rejectWithValue(toRejectValue(error));
  }
});

export const logout = createAsyncThunk<void, void, Config>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
    } catch (error) {
      return rejectWithValue(toRejectValue(error));
    }
  },
);