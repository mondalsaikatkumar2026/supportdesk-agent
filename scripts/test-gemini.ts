import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL;
  if (!apiKey) throw new Error("GEMINI_API_KEY is missing in .env");

  const ai = new GoogleGenAI({ apiKey });

  if (process.argv[2] === "list") {
    const pager = await ai.models.list();
    for await (const m of pager) {
      if (m.name?.includes("flash")) console.log(m.name.replace("models/", ""));
    }
    return;
  }

  if (!model) throw new Error("GEMINI_MODEL is missing in .env");
  const res = await ai.models.generateContent({
    model,
    contents: "Reply with the single word: OK",
  });
  console.log(`Model "${model}" replied:`, res.text);
}

main().catch((error) => {
  console.error("Gemini test failed:", error?.status ?? "", error?.message ?? error);
  process.exit(1);
});