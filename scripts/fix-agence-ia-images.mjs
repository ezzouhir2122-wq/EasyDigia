/**
 * Fix image URLs for article "agence-web-ia-vs-agence-traditionnelle"
 * Replaces Pixabay CDN (hotlink-blocked) with Unsplash URLs
 * Run: node scripts/fix-agence-ia-images.mjs
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

const SLUG = "agence-web-ia-vs-agence-traditionnelle";

// Fetch current article
const { data: article, error: fetchErr } = await supabase
  .from("blog_articles")
  .select("id, content, image_url")
  .eq("slug", SLUG)
  .single();

if (fetchErr || !article) {
  console.error("❌ Article not found:", fetchErr?.message);
  process.exit(1);
}

// New cover image — Unsplash, technology/AI theme, hotlink-safe
const NEW_COVER = "https://images.unsplash.com/photo-1677442136019-21780ecad995?fm=jpg&q=80&w=1400&auto=format&fit=crop";

// Fix body: replace Pixabay inline images with Unsplash equivalents
const PIXABAY_BRAIN = "https://cdn.pixabay.com/photo/2018/05/08/08/44/artificial-intelligence-3382507_1280.jpg";
const UNSPLASH_BRAIN = "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?fm=jpg&q=80&w=1400&auto=format&fit=crop";

const PIXABAY_NETWORK = "https://cdn.pixabay.com/photo/2021/07/31/08/22/network-6511448_1280.jpg";
const UNSPLASH_NETWORK = "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?fm=jpg&q=80&w=1400&auto=format&fit=crop";

function fixBody(body) {
  return body
    .replaceAll(PIXABAY_BRAIN, UNSPLASH_BRAIN)
    .replaceAll(PIXABAY_NETWORK, UNSPLASH_NETWORK);
}

const updatedContent = {
  fr: { ...article.content.fr, body: fixBody(article.content.fr.body) },
  en: { ...article.content.en, body: fixBody(article.content.en.body) },
  ar: { ...article.content.ar, body: fixBody(article.content.ar.body) },
};

const { error: updateErr } = await supabase
  .from("blog_articles")
  .update({ image_url: NEW_COVER, content: updatedContent })
  .eq("slug", SLUG);

if (updateErr) {
  console.error("❌ Update failed:", updateErr.message);
  process.exit(1);
}

console.log("✅ Images mises à jour");
console.log(`   Cover : ${NEW_COVER}`);
console.log(`   Inline 1 : ${UNSPLASH_BRAIN}`);
console.log(`   Inline 2 : ${UNSPLASH_NETWORK}`);
console.log(`🔗 https://www.easydigia.com/fr/blog/${SLUG}`);
