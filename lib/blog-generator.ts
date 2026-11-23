import { generateWithAI, detectProvider, type Provider } from "@/lib/ai-providers";
import { getSupabaseAdmin } from "@/lib/supabase";
import { jsonrepair } from "jsonrepair";

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
- 7 à 9 sections H2 ; formule-les si possible comme des questions réelles, avec une réponse directe en début de section (answer-first)
- Dès le 1er paragraphe : réponse synthétique directe à l'intention de recherche
- Juste après l'intro : un encadré "Points clés" en <ul> (3 à 5 puces)
- Chaque section : 3 à 5 paragraphes concrets
- Utiliser <strong> pour les concepts clés
- Au moins 2 listes <ul><li>
- Expérience terrain EasyDigia : au moins 2 exemples concrets / mini-cas (secteurs réels : immobilier, restauration, e-commerce, santé, logistique)
- Maillage interne : 2 à 4 liens parmi <a href="/fr/services">, <a href="/fr/tarifs">, <a href="/fr/contact">, <a href="/fr/realisations"> et une page solution (ex. <a href="/fr/solutions/chatbot-ia-pour-restaurants">)
- Section "Conclusion et prochaines étapes" avec appel à action EasyDigia naturel
- NE PAS utiliser h1, div, script, style, header, footer

RÈGLES DE CRÉDIBILITÉ (IMPÉRATIF — E-E-A-T) :
- N'invente JAMAIS de statistiques. N'avance un chiffre QUE si tu l'attribues à une source crédible + l'année (ex. "selon McKinsey, 2024"). Sinon, exprime l'idée qualitativement, sans chiffre.
- Les chiffres propres à EasyDigia (ex. +50 projets livrés, 3 ans) sont autorisés car first-party.
- INTERDITS : introductions creuses ("Dans un monde en constante évolution…"), généralités vagues, transitions vides, remplissage. Sois spécifique, varie la longueur des phrases.

STRUCTURE RECOMMANDÉE :
<h2>[Réponse directe à l'intention de recherche]</h2>
<p>...</p>
<ul><li>Point clé 1</li>...</ul>
<h2>Pourquoi [problème] coûte cher aux PME</h2>
<p>...</p>
<ul><li>...</li></ul>
<h2>Comment [solution] change la donne</h2>
<p>...exemple concret EasyDigia...</p>
[... autres sections en questions ...]
<h2>Conclusion : passez à l'action</h2>
<p>...<a href="/fr/contact">EasyDigia</a>...</p>

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

  const extracted = raw.includes("{")
    ? raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1)
    : raw;
  const article = JSON.parse(jsonrepair(extracted));

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
