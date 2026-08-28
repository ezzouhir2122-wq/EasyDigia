/**
 * One-off import: copy existing leads from Supabase `leads` table
 * into the Airtable "LEADS ESAYDIGIA" table.
 * Run: node scripts/import-leads-to-airtable.mjs
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

const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_ID } = process.env;
if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_ID) {
  console.error("Variables Airtable manquantes dans .env.local");
  process.exit(1);
}

const { data: leads, error } = await supabase
  .from("leads")
  .select("*")
  .order("created_at", { ascending: true });

if (error) {
  console.error("Erreur Supabase:", error.message);
  process.exit(1);
}

console.log(`${leads.length} lead(s) trouvé(s) dans Supabase`);
if (leads.length === 0) process.exit(0);

// Airtable accepts max 10 records per request
let imported = 0;
for (let i = 0; i < leads.length; i += 10) {
  const batch = leads.slice(i, i + 10);
  const res = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        records: batch.map((l) => ({
          fields: {
            Nom: l.name ?? "",
            Email: l.email ?? "",
            Entreprise: l.company ?? "",
            Service: l.service ?? "",
            Message: l.message ?? "",
            Locale: l.locale ?? "fr",
            Date: l.created_at ?? new Date().toISOString(),
          },
        })),
      }),
    }
  );

  if (!res.ok) {
    console.error(`Erreur Airtable (batch ${i / 10 + 1}):`, res.status, await res.text());
    process.exit(1);
  }
  imported += batch.length;
  console.log(`Importés : ${imported}/${leads.length}`);
}

console.log("Import terminé.");
