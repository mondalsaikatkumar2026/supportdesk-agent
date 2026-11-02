import { GoogleGenAI } from "@google/genai";
import { env } from "@/server/config/env";

const globalForGemini = globalThis as unknown as { gemini?: GoogleGenAI };

export const gemini =
  globalForGemini.gemini ??
  new GoogleGenAI({ apiKey: env.GEMINI_API_KEY, httpOptions: { timeout: 30_000 } });

if (env.NODE_ENV !== "production") globalForGemini.gemini = gemini;