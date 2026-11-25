import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { getSupabaseAdmin } from "@/lib/supabase";
import { savePdfLeadToAirtable } from "@/lib/airtable";

// PDFs live in a PRIVATE Supabase Storage bucket (repo is public): only ever sent as email attachments.
const BUCKET = "formations";
const PDFS = [
  { file: "guide-participant-agent-ia-easydigia.pdf", filename: "Guide-Participant-Agent-IA-Easydigia.pdf" },
  { file: "kit-mon-premier-agent-ia-easydigia.pdf", filename: "Kit-Mon-premier-agent-IA-Easydigia.pdf" },
];

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email(),
  phone: z.string().trim().min(6).max(30).regex(/^[0-9+()\s-]*$/),
  company: z.string().trim().max(120).optional(),
  locale: z.enum(["fr", "en", "ar"]).default("fr"),
});

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 400 });
  }
  const { name, email, phone, company, locale } = parsed.data;

  try {
    const { error } = await getSupabaseAdmin().from("leads").insert({
      name, email, phone, company, locale,
      service: "Formation Agent IA — PDF",
      message: "Demande des PDF de la formation (Guide participant + Kit Mon premier agent IA), envoyés par email.",
    });
    if (error) console.error("formation lead insert failed", error);
  } catch (e) {
    console.error("supabase error", e);
  }

  try {
    await savePdfLeadToAirtable({ name, email, company: company ?? "", phone });
  } catch (e) {
    console.error("airtable error", e);
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.error("RESEND_API_KEY manquant");
    return NextResponse.json({ ok: false, error: "email_unavailable" }, { status: 500 });
  }
  const resend = new Resend(resendKey);

  let attachments: { filename: string; content: string }[];
  try {
    const storage = getSupabaseAdmin().storage.from(BUCKET);
    attachments = await Promise.all(
      PDFS.map(async (p) => {
        const { data, error } = await storage.download(p.file);
        if (error || !data) throw error ?? new Error(`missing ${p.file}`);
        return { filename: p.filename, content: Buffer.from(await data.arrayBuffer()).toString("base64") };
      }),
    );
  } catch (e) {
    console.error("formation pdf read failed", e);
    return NextResponse.json({ ok: false, error: "pdf_unavailable" }, { status: 500 });
  }

  const n = esc(name);
  const { error: sendError } = await resend.emails.send({
    from: "EasyDigia <contact@easydigia.com>",
    to: email,
    subject: `${name}, vos PDF de la formation « Mon premier agent IA »`,
    attachments,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0A0B10;color:#F5F6FA;padding:32px;border-radius:12px">
        <p style="color:#8FD400;font-size:12px;font-weight:700;letter-spacing:1px;margin:0 0 16px;text-transform:uppercase">EasyDigia · Formation IA</p>
        <h1 style="font-size:22px;font-weight:800;margin:0 0 12px;line-height:1.3">Bonjour ${n}, vos 2 PDF sont en pièce jointe.</h1>
        <ul style="color:#9BA1B0;font-size:14px;line-height:1.8;margin:0 0 24px;padding-left:18px">
          <li><strong style="color:#F5F6FA">Guide participant</strong> : les 6 étapes pour construire votre premier agent IA, sans coder.</li>
          <li><strong style="color:#F5F6FA">Kit « Mon premier agent IA »</strong> : 5 prompts à copier et 7 modèles d'agents prêts à adapter.</li>
        </ul>
        <p style="color:#9BA1B0;font-size:14px;line-height:1.7;margin:0 0 24px">
          Vous voulez être accompagné pour construire votre agent ? Répondez simplement à cet email ou réservez votre place.
        </p>
        <a href="https://www.easydigia.com/fr/contact" style="display:inline-block;background:#8FD400;color:#0A0B10;font-weight:700;font-size:14px;padding:12px 24px;border-radius:8px;text-decoration:none">Réserver ma place →</a>
        <p style="color:#9BA1B0;font-size:12px;margin:24px 0 0">L'équipe EasyDigia<br/>contact@easydigia.com · +212 781 995 665</p>
      </div>`,
  });
  if (sendError) {
    console.error("formation email failed", sendError);
    return NextResponse.json({ ok: false, error: "email_failed" }, { status: 502 });
  }

  try {
    await resend.emails.send({
      from: "EasyDigia <contact@easydigia.com>",
      to: process.env.RESEND_TO_EMAIL ?? "ezzouhir2122@gmail.com",
      subject: `Formation — PDF envoyés à ${name}${company ? ` (${company})` : ""}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0A0B10;color:#F5F6FA;padding:32px;border-radius:12px">
          <h2 style="color:#8FD400;margin:0 0 8px">Nouvelle demande — PDF formation</h2>
          <p style="color:#9BA1B0;margin:0 0 24px;font-size:13px">Les 2 PDF lui ont été envoyés automatiquement.</p>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#9BA1B0;width:120px">Nom</td><td style="padding:8px 0;font-weight:600">${n}</td></tr>
            ${company ? `<tr><td style="padding:8px 0;color:#9BA1B0">Entreprise</td><td style="padding:8px 0">${esc(company)}</td></tr>` : ""}
            <tr><td style="padding:8px 0;color:#9BA1B0">Email</td><td style="padding:8px 0"><a href="mailto:${esc(email)}" style="color:#8FD400">${esc(email)}</a></td></tr>
            <tr><td style="padding:8px 0;color:#9BA1B0">Téléphone</td><td style="padding:8px 0"><a href="tel:${esc(phone)}" style="color:#8FD400">${esc(phone)}</a></td></tr>
          </table>
        </div>`,
    });
  } catch (e) {
    console.error("internal notification failed", e);
  }

  return NextResponse.json({ ok: true });
}
