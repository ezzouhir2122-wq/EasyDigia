import { NextResponse } from "next/server";
import { generateWithAI, detectProvider, type Provider } from "@/lib/ai-providers";
import { getSupabaseAdmin } from "@/lib/supabase";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const PROMPT = (topic: string) => `Tu es un rédacteur expert pour EasyDigia, une agence digitale spécialisée en IA et automatisation basée à Marrakech, Maroc.

Génère un article de blog professionnel sur le sujet : "${topic}"

Réponds UNIQUEMENT avec un objet JSON valide (pas de markdown, pas d'explication, pas de \`\`\`json) avec cette structure exacte :
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
    "tag": "Short category (e.g. AI & Agents, Automation, Digital strategy)",
    "excerpt": "1-2 sentence summary (max 180 chars)",
    "body": "<h2>Section title</h2><p>Paragraph...</p>"
  },
  "ar": {
    "title": "عنوان جذاب بالعربية",
    "tag": "فئة قصيرة",
    "excerpt": "ملخص بجملة أو جملتين (أقل من 180 حرف)",
    "body": "<h2>عنوان القسم</h2><p>فقرة...</p>"
  }
}

Règles impératives :
- body : 4 à 6 sections h2, 3-4 paragraphes chacune, ~500 mots par langue
- HTML uniquement : h2, p, strong, ul, li (pas de h1, div, script, style)
- Mention naturelle d'EasyDigia dans la conclusion avec invitation à contacter
- Ton professionnel mais accessible, adapté aux dirigeants de PME
- JSON strictement valide, sans échappements inutiles`;

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
    const raw = await generateWithAI(PROMPT(topic), selectedProvider);

    // Extraire le JSON même si le modèle entoure de ```json
    const jsonStr = raw.includes("{")
      ? raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1)
      : raw;
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

    if (error) throw new Error(error.message ?? JSON.stringify(error));

    return NextResponse.json({ ok: true, article: data, provider: selectedProvider });
  } catch (e) {
    console.error(`blog generate error [${selectedProvider}]`, e);
    const msg = e instanceof Error ? e.message : JSON.stringify(e);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
