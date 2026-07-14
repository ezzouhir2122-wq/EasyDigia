import { NextResponse } from "next/server";
import { detectProvider, type Provider } from "@/lib/ai-providers";
import { generateAndSaveArticle } from "@/lib/blog-generator";

export async function POST(req: Request) {
  let body: { topic?: string; category?: string; provider?: Provider };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const { topic, category = "ai", provider } = body;
  if (!topic?.trim()) {
    return NextResponse.json({ ok: false, error: "topic requis" }, { status: 400 });
  }

  let selectedProvider: Provider;
  try {
    selectedProvider = provider ?? detectProvider();
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }

  try {
    const result = await generateAndSaveArticle({ topic, category, provider: selectedProvider });
    return NextResponse.json({ ok: true, article: { id: result.id, slug: result.slug }, provider: selectedProvider });
  } catch (e) {
    console.error(`blog generate error [${selectedProvider}]`, e);
    const msg = e instanceof Error ? e.message : JSON.stringify(e);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
