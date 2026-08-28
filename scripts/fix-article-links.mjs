/**
 * Clean placeholder markers ([IMAGE: ...] and [INTERNAL-LINK: ...]) that leaked
 * into published article bodies, and turn internal-link markers into real links.
 * Run: node scripts/fix-article-links.mjs
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

// Published slugs available as real internal-link targets.
const PUBLISHED = [
  "immobilier-marrakech-dominer-google-ia",
  "automatisation-relances-clients-whatsapp-make",
  "claude-vs-chatgpt-pme-maroc",
  "agent-ia-qualification-leads-sans-coder",
];

// Map a target-description (right side of the arrow) to a real published slug.
function resolveTarget(targetText) {
  const t = targetText.toLowerCase();
  if (/relance|whatsapp\s+make|make\b|n8n|automatisation/.test(t))
    return "automatisation-relances-clients-whatsapp-make";
  if (/claude|chatgpt|llm|comparatif ia/.test(t)) return "claude-vs-chatgpt-pme-maroc";
  if (/immobilier|marrakech/.test(t)) return "immobilier-marrakech-dominer-google-ia";
  if (/agent ia|chatbot/.test(t)) return "agent-ia-qualification-leads-sans-coder";
  return null; // fall back to blog index
}

function cleanBody(body, currentSlug) {
  let out = body;

  // 1. Remove standalone [IMAGE: ...] marker paragraphs.
  out = out.replace(/<p>\s*\[IMAGE:[^\]]*\]\s*<\/p>\s*/gi, "");

  // 2. Convert [INTERNAL-LINK: anchor → target] into a real anchor tag.
  //    Handles both "→" and "->" separators.
  out = out.replace(/\[INTERNAL-LINK:\s*([^\]]*?)\s*(?:→|-&gt;|->)\s*([^\]]*?)\]/gi, (_, anchor, target) => {
    let slug = resolveTarget(target);
    if (slug === currentSlug) slug = null; // never self-link
    const href = slug ? `/fr/blog/${slug}` : "/fr/blog";
    return `<a href="${href}">${anchor.trim()}</a>`;
  });

  // 3. Tidy leftover empty paragraphs / stray <br /> from removed markers.
  out = out.replace(/<p>\s*(<br\s*\/?>\s*)*<\/p>\s*/gi, "");

  return out;
}

for (const slug of PUBLISHED) {
  const { data, error } = await supabase
    .from("blog_articles")
    .select("id, content")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error(`❌ ${slug}: fetch failed — ${error.message}`);
    continue;
  }

  const content = data.content;
  let changed = false;
  for (const loc of ["fr", "en", "ar"]) {
    if (content?.[loc]?.body && /\[IMAGE:|\[INTERNAL-LINK:/i.test(content[loc].body)) {
      content[loc].body = cleanBody(content[loc].body, slug);
      changed = true;
    }
  }

  if (!changed) {
    console.log(`✓ ${slug}: already clean`);
    continue;
  }

  const { error: upErr } = await supabase
    .from("blog_articles")
    .update({ content })
    .eq("id", data.id);

  if (upErr) console.error(`❌ ${slug}: update failed — ${upErr.message}`);
  else console.log(`✅ ${slug}: markers cleaned + internal links filled`);
}
