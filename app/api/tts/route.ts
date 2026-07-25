import OpenAI from "openai";
import { NextRequest } from "next/server";

function getClient() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

/* Mapeamento de locale para voz OpenAI — "fable" soa mais europeu em PT */
const voiceMap: Record<string, "nova" | "alloy" | "echo" | "fable" | "onyx" | "shimmer"> = {
  pt: "fable",
  en: "fable",
  es: "fable",
  fr: "fable",
  it: "fable",
  de: "fable",
};

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response(JSON.stringify({ error: "API key not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { text, locale } = (await req.json()) as { text: string; locale: string };

    if (!text?.trim()) {
      return new Response(JSON.stringify({ error: "Text is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const voice = voiceMap[locale] ?? "nova";

    const mp3 = await getClient().audio.speech.create({
      model: "tts-1-hd",
      voice,
      input: text,
      speed: 0.95,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());

    return new Response(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: "TTS error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
