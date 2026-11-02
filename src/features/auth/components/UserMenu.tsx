"use client";

import Button from "@/components/ui/Button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "../authThunks";

export default function UserMenu() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);

  return (
    <div className="flex items-center gap-3">
      <span className="hidden max-w-[12rem] truncate text-sm text-slate-600 sm:inline">{user?.name}</span>
      <Button variant="secondary" onClick={() => dispatch(logout())} className="!py-1.5">
        Log out
      </Button>
    </div>
  );
}