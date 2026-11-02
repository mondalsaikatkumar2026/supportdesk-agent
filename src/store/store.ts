import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";
import ticketsReducer from "@/features/tickets/ticketsSlice";
import triageReducer from "@/features/triage/triageSlice";

export const makeStore = () =>
  configureStore({
    reducer: { auth: authReducer, tickets: ticketsReducer, triage: triageReducer },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];