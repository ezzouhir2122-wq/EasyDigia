import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Anthropic from "@anthropic-ai/sdk";

export type Provider = "grok" | "gemini" | "claude" | "mistral";

export function detectProvider(): Provider {
  if (process.env.MISTRAL_API_KEY) return "mistral";
  if (process.env.ANTHROPIC_API_KEY) return "claude";
  if (process.env.GROK_API_KEY) return "grok";
  if (process.env.GEMINI_API_KEY) return "gemini";
  throw new Error("Aucune clé API IA configurée (MISTRAL_API_KEY, ANTHROPIC_API_KEY, GROK_API_KEY ou GEMINI_API_KEY)");
}

export async function generateWithAI(prompt: string, provider: Provider): Promise<string> {
  switch (provider) {
    case "grok": {
      if (!process.env.GROK_API_KEY) throw new Error("GROK_API_KEY manquante — ajoutez-la dans Vercel > Settings > Environment Variables");
      const client = new OpenAI({
        apiKey: process.env.GROK_API_KEY,
        baseURL: "https://api.x.ai/v1",
      });
      const res = await client.chat.completions.create({
        model: "grok-3",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 8192,
      });
      return res.choices[0]?.message?.content ?? "";
    }

    case "gemini": {
      if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY manquante — ajoutez-la dans Vercel > Settings > Environment Variables");
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(prompt);
      return result.response.text();
    }

    case "claude": {
      if (!process.env.ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY manquante — ajoutez-la dans Vercel > Settings > Environment Variables");
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const msg = await client.messages.create({
        model: "claude-sonnet-4-5",
        max_tokens: 8192,
        messages: [{ role: "user", content: prompt }],
      });
      return (msg.content[0] as { type: string; text: string }).text;
    }

    case "mistral": {
      if (!process.env.MISTRAL_API_KEY) throw new Error("MISTRAL_API_KEY manquante — ajoutez-la dans Vercel > Settings > Environment Variables");
      const mistral = new OpenAI({
        apiKey: process.env.MISTRAL_API_KEY,
        baseURL: "https://api.mistral.ai/v1",
      });
      const res = await mistral.chat.completions.create({
        model: "mistral-large-latest",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 8192,
      });
      return res.choices[0]?.message?.content ?? "";
    }
  }
}
