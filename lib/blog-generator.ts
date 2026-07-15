import { generateWithAI, detectProvider, type Provider } from "@/lib/ai-providers";
import { getSupabaseAdmin } from "@/lib/supabase";

export interface GeneratedArticleResult {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  imageUrl?: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Fallback images par catégorie (Unsplash CDN stable, pas d'API key requise)
const FALLBACK_IMAGES: Record<string, string> = {
  ai:         "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1400&q=80",
  automation: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400&q=80",
  strategy:   "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=80",
  tutorial:   "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1400&q=80",
};

async function fetchPexelsImage(keyword: string): Promise<string | null> {
  const key = process.env.PEXELS_API_KEY;
  if (!key) return null;

  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(keyword)}&per_page=1&orientation=landscape`,
      { headers: { Authorization: key } }
    );
    if (!res.ok) return null;
    const json = await res.json() as { photos?: Array<{ src?: { large2x?: string } }> };
    return json.photos?.[0]?.src?.large2x ?? null;
  } catch {
    return null;
  }
}

async function resolveImage(keyword: string, category: string): Promise<string> {
  const pexels = await fetchPexelsImage(keyword);
  if (pexels) return pexels;
  return FALLBACK_IMAGES[category] ?? FALLBACK_IMAGES.ai;
}

function buildArticlePrompt(topic: string): string {
  return `Tu es un rédacteur expert senior pour EasyDigia, une agence IA et automatisation basée à Marrakech, Maroc. Ton style : professionnel, direct, orienté résultats concrets pour les PME.

Génère un article de blog complet et approfondi sur : "${topic}"

Réponds UNIQUEMENT avec un objet JSON valide (aucun markdown, aucune explication, aucun bloc \`\`\`json) :
{
  "slug": "slug-url-francais-tirets-max-8-mots",
  "read_min": 8,
  "image_keyword": "mot-clé anglais pour recherche photo (ex: artificial intelligence robot office)",
  "fr": {
    "title": "Titre H1 accrocheur, orienté bénéfice, 8-12 mots",
    "tag": "Catégorie courte (IA & Agents | Automatisation | Stratégie digitale | Tutoriel)",
    "excerpt": "Résumé 2 phrases percutantes avec chiffre clé, max 200 caractères",
    "body": "<!-- HTML complet ici -->"
  },
  "en": {
    "title": "...",
    "tag": "...",
    "excerpt": "...",
    "body": "<!-- HTML complet ici -->"
  },
  "ar": {
    "title": "...",
    "tag": "...",
    "excerpt": "...",
    "body": "<!-- HTML complet ici -->"
  }
}

EXIGENCES POUR LE BODY (chaque langue) :
- MINIMUM 900 mots de texte visible (hors balises HTML)
- 7 à 9 sections H2 avec titres accrocheurs orientés bénéfice
- Chaque section : 4 à 5 paragraphes de 3-4 phrases minimum
- Utiliser <strong> pour les chiffres et concepts clés
- Au moins 2 listes <ul><li> dans l'article (bénéfices, étapes, exemples)
- Section "Conclusion et prochaines étapes" avec appel à action EasyDigia naturel
- Chiffres concrets et exemples réels (économies de temps, ROI, pourcentages)
- NE PAS utiliser h1, div, script, style, header, footer

STRUCTURE RECOMMANDÉE :
<h2>Introduction : contexte et enjeu</h2>
<p>...</p>
<h2>Pourquoi [problème] coûte cher aux PME</h2>
<p>...<strong>3h/semaine</strong>...</p>
<ul><li>...</li></ul>
<h2>Comment [solution] change la donne</h2>
<p>...</p>
[... 4 à 6 autres sections ...]
<h2>Conclusion : passez à l'action</h2>
<p>...EasyDigia...</p>

JSON strictement valide, chaînes échappées correctement, pas de retour à la ligne brut dans les valeurs.`;
}

export async function generateAndSaveArticle(params: {
  topic: string;
  category?: string;
  provider?: Provider;
}): Promise<GeneratedArticleResult> {
  const { topic, category = "ai", provider } = params;

  const selectedProvider = provider ?? detectProvider();
  const raw = await generateWithAI(buildArticlePrompt(topic), selectedProvider);

  const jsonStr = raw.includes("{")
    ? raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1)
    : raw;
  const article = JSON.parse(jsonStr);

  const baseSlug = article.slug || slugify(topic);
  const slug = `${baseSlug}-${Date.now().toString(36)}`;

  const imageUrl = await resolveImage(
    article.image_keyword ?? `${topic} business technology`,
    category
  );

  const record = {
    slug,
    category,
    read_min: article.read_min ?? 8,
    published: false,
    image_url: imageUrl,
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

  return {
    id: data.id,
    slug: data.slug,
    title: article.fr?.title ?? topic,
    excerpt: article.fr?.excerpt ?? "",
    imageUrl,
  };
}
