import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    grok:   !!process.env.GROK_API_KEY   ? "✅ présente" : "❌ absente",
    gemini: !!process.env.GEMINI_API_KEY ? "✅ présente" : "❌ absente",
    claude: !!process.env.ANTHROPIC_API_KEY ? "✅ présente" : "❌ absente",
  });
}
