import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getSupabaseAdmin } from "@/lib/supabase";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { ok: false, error: "ANTHROPIC_API_KEY non configurée" },
      { status: 500 }
    );
  }

  let body: { topic?: string; category?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const { topic, category = "ai" } = body;
  if (!topic?.trim()) {
    return NextResponse.json({ ok: false, error: "topic requis" }, { status: 400 });
  }

  const prompt = `Tu es un rédacteur expert pour EasyDigia, une agence digitale spécialisée en IA et automatisation basée à Marrakech, Maroc.

Génère un article de blog professionnel sur le sujet : "${topic}"

Réponds UNIQUEMENT avec un objet JSON valide (pas de markdown, pas d'explication) avec cette structure exacte :
{
  "slug": "slug-url-en-francais-avec-tirets",
  "read_min": 6,
  "fr": {
    "title": "Titre accrocheur en français",
    "tag": "Catégorie courte (ex: IA & Agents, Automatisation, Stratégie digitale)",
    "excerpt": "Résumé en 1-2 phrases percutantes (max 180 caractères)",
    "body": "<h2>Titre section</h2><p>Paragraphe...</p><h2>...</h2><p>...</p>"
  },
  "en": {
    "title": "Catchy English title",
    "tag": "Short category",
    "excerpt": "1-2 sentence summary (max 180 chars)",
    "body": "<h2>Section title</h2><p>Paragraph...</p>"
  },
  "ar": {
    "title": "عنوان جذاب بالعربية",
    "tag": "فئة قصيرة",
    "excerpt": "ملخص بجملة أو جملتين",
    "body": "<h2>عنوان القسم</h2><p>فقرة...</p>"
  }
}

Règles :
- body : 4 à 6 sections h2, 3-4 paragraphes chacune, ~500 mots par langue
- Mention naturelle d'EasyDigia dans la conclusion avec invitation à contacter
- Ton professionnel mais accessible
- body doit être du HTML valide (uniquement h2, p, strong, ul, li)`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 8192,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = (message.content[0] as { type: string; text: string }).text.trim();
    const jsonStr = raw.startsWith("{") ? raw : raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1);
    const article = JSON.parse(jsonStr);

    const baseSlug = article.slug || slugify(topic);
    const slug = `${baseSlug}-${Date.now().toString(36)}`;

    const record = {
      slug,
      category,
      read_min: article.read_min ?? 6,
      published: false,
      content: {
        fr: article.fr,
        en: article.en,
        ar: article.ar,
      },
    };

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("blog_articles")
      .insert(record)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ ok: true, article: data });
  } catch (e) {
    console.error("blog generate error", e);
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
