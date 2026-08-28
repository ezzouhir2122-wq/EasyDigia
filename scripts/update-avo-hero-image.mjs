/**
 * Update hero image of avo-optimisation-visibilite-ia-2026 article.
 * Run: node scripts/update-avo-hero-image.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, "../.env.local");
for (const line of readFileSync(envPath, "utf-8").split("\n")) {
  const m = line.match(/^([^#=]+)=(.*)$/);
  if (m) process.env[m[1].trim()] = m[2].trim();
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY,
  { auth: { persistSession: false } }
);

const SLUG = "avo-optimisation-visibilite-ia-2026";

// Nouvelle image : réseau neuronal lumineux sur fond sombre
// Représente parfaitement l'IA + visibilité + données en temps réel
const OLD_IMG = "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?fm=jpg&q=80&w=1400&auto=format&fit=crop";
const NEW_IMG = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?fm=jpg&q=80&w=1400&auto=format&fit=crop";

const NEW_ALT_FR = "Tableau de bord analytique IA montrant les performances de visibilité en temps réel — AVO optimisation visibilité IA 2026";
const NEW_ALT_EN = "AI analytics dashboard showing real-time visibility performance metrics — AVO AI Visibility Optimization 2026";
const NEW_ALT_AR = "لوحة تحليلات الذكاء الاصطناعي تُظهر مقاييس الأداء في الوقت الفعلي — AVO تحسين الظهور في الذكاء الاصطناعي 2026";

// 1. Fetch current record
const { data: article, error: fetchErr } = await supabase
  .from("blog_articles")
  .select("id, image_url, content")
  .eq("slug", SLUG)
  .single();

if (fetchErr || !article) {
  console.error("❌ Article not found:", fetchErr?.message);
  process.exit(1);
}

// 2. Update first <figure> image in each language body
function replaceFirstFigure(body, newSrc, newAlt) {
  return body.replace(
    /<figure[^>]*>[\s\S]*?<\/figure>/,
    `<figure style="margin:2rem 0;text-align:center;">
<img src="${newSrc}" alt="${newAlt}" style="max-width:100%;border-radius:10px;" />
<figcaption style="font-size:0.85rem;color:#666;margin-top:0.5rem;">Source : Unsplash — Mesurer la part de voix IA est désormais un impératif stratégique pour les marques.</figcaption>
</figure>`
  );
}

const updatedContent = {
  fr: {
    ...article.content.fr,
    body: replaceFirstFigure(article.content.fr.body, NEW_IMG, NEW_ALT_FR),
  },
  en: {
    ...article.content.en,
    body: replaceFirstFigure(article.content.en.body, NEW_IMG, NEW_ALT_EN),
  },
  ar: {
    ...article.content.ar,
    body: replaceFirstFigure(article.content.ar.body, NEW_IMG, NEW_ALT_AR),
  },
};

// 3. Persist changes
const { error: updateErr } = await supabase
  .from("blog_articles")
  .update({ image_url: NEW_IMG, content: updatedContent })
  .eq("slug", SLUG);

if (updateErr) {
  console.error("❌ Update failed:", updateErr.message);
  process.exit(1);
}

console.log("✅ Image hero mise à jour !");
console.log(`   Ancienne : ${OLD_IMG}`);
console.log(`   Nouvelle : ${NEW_IMG}`);
console.log(`🔗 https://easydigia.com/fr/blog/${SLUG}`);
