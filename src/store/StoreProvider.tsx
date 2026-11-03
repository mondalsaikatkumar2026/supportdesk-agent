"use client";

import { useSyncExternalStore } from "react";
import { Provider } from "react-redux";
import Spinner from "@/components/ui/Spinner";
import { makeStore, type AppStore } from "./store";

// Created lazily and only in the browser. makeStore() uses Math.random()
// internally (Redux), which Next.js forbids while prerendering on the server.
let clientStore: AppStore | undefined;

function getClientStore(): AppStore {
  clientStore ??= makeStore();
  return clientStore;
}

const subscribe = () => () => {};
const getServerStore = (): AppStore | null => null;

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const store = useSyncExternalStore<AppStore | null>(subscribe, getClientStore, getServerStore);

  if (!store) {
    return (
      <div className="flex min-h-screen items-center justify-center text-indigo-600">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return <Provider store={store}>{children}</Provider>;
}