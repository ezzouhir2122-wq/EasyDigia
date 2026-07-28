import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase";
import { Resend } from "resend";
import fs from "fs";
import path from "path";

const guideSchema = z.object({
  name: z.string().min(1),
  company: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = guideSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 400 });
  }

  const { name, company, email, phone } = parsed.data;

  // Save to Supabase leads table
  try {
    const supabase = getSupabaseAdmin();
    await supabase.from("leads").insert({
      name,
      email,
      company,
      service: "Guide IA",
      message: `Téléchargement Guide IA\nTéléphone : ${phone}`,
      locale: "fr",
    });
  } catch (e) {
    console.error("supabase error", e);
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    const resend = new Resend(resendKey);

    // Lire le PDF pour la pièce jointe
    let pdfBase64: string | undefined;
    try {
      const pdfPath = path.join(process.cwd(), "public", "guide-ia-easydigia.pdf");
      pdfBase64 = fs.readFileSync(pdfPath).toString("base64");
    } catch (e) {
      console.error("pdf read failed", e);
    }

    // Email au visiteur avec le PDF en pièce jointe
    try {
      await resend.emails.send({
        from: "EasyDigia <contact@easydigia.com>",
        to: email,
        subject: `Votre guide — ${name}, voici ce qu'on vous a préparé`,
        attachments: pdfBase64
          ? [{ filename: "Guide-EasyDigia-2025.pdf", content: pdfBase64 }]
          : [],
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0A0B10;color:#F5F6FA;padding:32px;border-radius:12px">
            <p style="color:#8FD400;font-size:12px;font-weight:700;letter-spacing:1px;margin:0 0 16px;text-transform:uppercase">EasyDigia</p>
            <h1 style="font-size:22px;font-weight:800;color:#F5F6FA;margin:0 0 12px;line-height:1.3">
              Bonjour ${name}, votre guide est en pièce jointe.
            </h1>
            <p style="color:#9BA1B0;font-size:14px;line-height:1.7;margin:0 0 24px">
              Merci d'avoir téléchargé notre guide. Vous le trouverez directement dans cet email —
              pas besoin de chercher un lien, il est là, prêt à être lu ou partagé.
            </p>
            <p style="color:#9BA1B0;font-size:14px;line-height:1.7;margin:0 0 24px">
              Ce guide couvre cinq approches concrètes que nous déployons régulièrement
              pour des entreprises comme ${company}. Si une section vous parle plus que les autres,
              c'est souvent un bon point de départ pour notre échange.
            </p>
            <div style="background:#12141C;border:1px solid #1E2130;border-radius:10px;padding:20px;margin:0 0 24px">
              <p style="color:#F5F6FA;font-size:13px;font-weight:700;margin:0 0 8px">Ce que vous trouverez dans le guide :</p>
              <ul style="color:#9BA1B0;font-size:13px;line-height:1.8;margin:0;padding-left:18px">
                <li>Pourquoi vos concurrents gagnent du terrain avec l'automatisation</li>
                <li>Cinq solutions concrètes, expliquées sans jargon</li>
                <li>Des cas réels par secteur (immobilier, santé, restauration…)</li>
                <li>Un plan en trois étapes pour démarrer cette semaine</li>
              </ul>
            </div>
            <p style="color:#9BA1B0;font-size:14px;line-height:1.7;margin:0 0 24px">
              Si vous voulez qu'on regarde ensemble ce qui s'applique à votre activité,
              on propose un audit gratuit de 30 minutes — sans engagement.
              On identifie un levier concret, et vous repartez avec quelque chose d'actionnable.
            </p>
            <a href="https://www.easydigia.com/fr/contact" style="display:inline-block;background:#8FD400;color:#0A0B10;font-weight:700;font-size:14px;padding:12px 24px;border-radius:8px;text-decoration:none">
              Réserver mon audit gratuit →
            </a>
            <p style="color:#9BA1B0;font-size:12px;margin:24px 0 0">
              Bonne lecture,<br/>
              <strong style="color:#F5F6FA">L'équipe EasyDigia</strong><br/>
              contact@easydigia.com · +212 781 995 665
            </p>
          </div>
        `,
      });
    } catch (e) {
      console.error("visitor email failed", e);
    }

    // Notification interne
    try {
      await resend.emails.send({
        from: "EasyDigia <contact@easydigia.com>",
        to: process.env.RESEND_TO_EMAIL ?? "ezzouhir2122@gmail.com",
        subject: `Nouveau telechargement — ${name} (${company})`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0A0B10;color:#F5F6FA;padding:32px;border-radius:12px">
            <h2 style="color:#8FD400;margin:0 0 8px">Nouveau prospect — guide téléchargé</h2>
            <p style="color:#9BA1B0;margin:0 0 24px;font-size:13px">Le guide lui a été envoyé par email automatiquement.</p>
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:8px 0;color:#9BA1B0;width:120px">Nom</td><td style="padding:8px 0;font-weight:600">${name}</td></tr>
              <tr><td style="padding:8px 0;color:#9BA1B0">Entreprise</td><td style="padding:8px 0;font-weight:600">${company}</td></tr>
              <tr><td style="padding:8px 0;color:#9BA1B0">Email</td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#8FD400">${email}</a></td></tr>
              <tr><td style="padding:8px 0;color:#9BA1B0">Téléphone</td><td style="padding:8px 0"><a href="tel:${phone}" style="color:#8FD400">${phone}</a></td></tr>
            </table>
            <div style="margin-top:24px">
              <a href="mailto:${email}" style="display:inline-block;background:#8FD400;color:#0A0B10;font-weight:700;padding:10px 20px;border-radius:8px;text-decoration:none">Contacter ce prospect →</a>
            </div>
          </div>
        `,
      });
    } catch (e) {
      console.error("internal notification failed", e);
    }
  }

  return NextResponse.json({ ok: true });
}
