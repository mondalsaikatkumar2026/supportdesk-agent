import { createSlice } from "@reduxjs/toolkit";
import type { User } from "@/types";
import { fetchMe, login, logout, register } from "./authThunks";

interface AuthState {
  user: User | null;
  status: "unknown" | "authenticated" | "unauthenticated";
  submitting: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  status: "unknown",
  submitting: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "authenticated";
      })
      .addCase(fetchMe.rejected, (state) => {
        state.user = null;
        state.status = "unauthenticated";
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.status = "unauthenticated";
      });

    for (const thunk of [login, register]) {
      builder
        .addCase(thunk.pending, (state) => {
          state.submitting = true;
          state.error = null;
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state.submitting = false;
          state.user = action.payload;
          state.status = "authenticated";
        })
        .addCase(thunk.rejected, (state, action) => {
          state.submitting = false;
          state.error = action.payload?.message ?? "Something went wrong. Please try again.";
        });
    }
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;