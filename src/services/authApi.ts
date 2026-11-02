import type { User } from "@/types";
import { apiFetch } from "./api-client";

export const authApi = {
  register: (body: { name: string; email: string; password: string }) =>
    apiFetch<{ user: User }>("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body: { email: string; password: string }) =>
    apiFetch<{ user: User }>("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  logout: () => apiFetch<{ loggedOut: boolean }>("/auth/logout", { method: "POST" }),
  me: () => apiFetch<{ user: User }>("/auth/me"),
};