/**
 * Re-sync the freshly re-rendered (marker-free) FR bodies into Supabase.
 * Run: node scripts/resync-fr-bodies.mjs
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

const eq = join(__dirname, "../geo-seo-blog-engine-system/equipment");
const MAP = {
  "agent-ia-qualification-leads-sans-coder": "article_body_agent_ia_leads.html",
  "claude-vs-chatgpt-pme-maroc": "article_body_claude_vs_chatgpt.html",
  "automatisation-relances-clients-whatsapp-make": "article_body_whatsapp_make.html",
};

for (const [slug, file] of Object.entries(MAP)) {
  const body = readFileSync(join(eq, file), "utf-8");

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
  content.fr.body = body;

  const { error: upErr } = await supabase
    .from("blog_articles")
    .update({ content })
    .eq("id", data.id);

  if (upErr) console.error(`❌ ${slug}: update failed — ${upErr.message}`);
  else console.log(`✅ ${slug}: FR body re-synced (${body.length} chars)`);
}
