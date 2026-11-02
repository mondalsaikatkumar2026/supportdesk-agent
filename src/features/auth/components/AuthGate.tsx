"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/components/ui/Spinner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchMe } from "../authThunks";

export default function AuthGate({
  mode,
  children,
}: {
  mode: "protected" | "guest";
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const status = useAppSelector((s) => s.auth.status);

  useEffect(() => {
    if (status === "unknown") dispatch(fetchMe());
  }, [status, dispatch]);

  useEffect(() => {
    if (mode === "protected" && status === "unauthenticated") router.replace("/login");
    if (mode === "guest" && status === "authenticated") router.replace("/dashboard");
  }, [mode, status, router]);

  const allowed =
    (mode === "protected" && status === "authenticated") ||
    (mode === "guest" && status === "unauthenticated");

  if (!allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center text-indigo-600">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return <>{children}</>;
}