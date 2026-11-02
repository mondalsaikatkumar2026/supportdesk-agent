import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { env } from "@/server/config/env";

export const SESSION_COOKIE = "sd_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days
const secret = new TextEncoder().encode(env.JWT_SECRET);

export async function createSessionToken(userId: string) {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(secret);
}

async function verifySessionToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
    return payload.sub ?? null;
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSessionUserId(): Promise<string | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return token ? verifySessionToken(token) : null;
}