/**
 * Update hero image of ia-formation-professionnelle-ofppt-maroc article.
 * Image: jeunes stagiaires en formation numérique / secteurs métier
 * Run: node scripts/update-ofppt-hero-image.mjs
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

const SLUG = "ia-formation-professionnelle-ofppt-maroc";

// Stagiaires en formation numérique collaborative — fitting pour OFPPT + IA
const NEW_IMG = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?fm=jpg&q=80&w=1400&auto=format&fit=crop";

const ALTS = {
  fr: "Stagiaires en formation professionnelle numérique au Maroc — IA et compétences métier OFPPT 2026",
  en: "Trainees in digital vocational training in Morocco — AI and professional skills OFPPT 2026",
  ar: "متدربون في التكوين المهني الرقمي بالمغرب — الذكاء الاصطناعي ومهارات OFPPT 2026",
};

const CAPTIONS = {
  fr: "Les stagiaires OFPPT s'approprient les outils numériques et l'IA pour préparer les métiers de demain.",
  en: "OFPPT trainees are adopting digital tools and AI to prepare for tomorrow's professions.",
  ar: "يتبنّى متدربو OFPPT الأدوات الرقمية والذكاء الاصطناعي للتحضير لمهن المستقبل.",
};

const { data: article, error: fetchErr } = await supabase
  .from("blog_articles")
  .select("id, content")
  .eq("slug", SLUG)
  .single();

if (fetchErr || !article) {
  console.error("❌ Article not found:", fetchErr?.message);
  process.exit(1);
}

function replaceFirstFigure(body, locale) {
  return body.replace(
    /<figure[^>]*>[\s\S]*?<\/figure>/,
    `<figure style="margin:2rem 0;text-align:center;">
<img src="${NEW_IMG}" alt="${ALTS[locale]}" style="max-width:100%;border-radius:10px;" />
<figcaption style="font-size:0.85rem;color:#666;margin-top:0.5rem;">${CAPTIONS[locale]}</figcaption>
</figure>`
  );
}

const updatedContent = {
  fr: { ...article.content.fr, body: replaceFirstFigure(article.content.fr.body, "fr") },
  en: { ...article.content.en, body: replaceFirstFigure(article.content.en.body, "en") },
  ar: { ...article.content.ar, body: replaceFirstFigure(article.content.ar.body, "ar") },
};

const { error: updateErr } = await supabase
  .from("blog_articles")
  .update({ image_url: NEW_IMG, content: updatedContent })
  .eq("slug", SLUG);

if (updateErr) {
  console.error("❌ Update failed:", updateErr.message);
  process.exit(1);
}

console.log("✅ Image OFPPT mise à jour !");
console.log(`   Nouvelle image : ${NEW_IMG}`);
console.log(`🔗 https://easydigia.com/fr/blog/${SLUG}`);
