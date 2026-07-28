import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase";
import { Resend } from "resend";

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

  // Email notification
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: "EasyDigia <contact@easydigia.com>",
        to: process.env.RESEND_TO_EMAIL ?? "ezzouhir2122@gmail.com",
        subject: `📥 Téléchargement Guide IA — ${name} (${company})`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0A0B10;color:#F5F6FA;padding:32px;border-radius:12px">
            <h2 style="color:#8FD400;margin:0 0 8px">Nouveau téléchargement du Guide IA</h2>
            <p style="color:#9BA1B0;margin:0 0 24px;font-size:13px">Un prospect a téléchargé votre guide — à contacter rapidement.</p>
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
      console.error("email send failed", e);
    }
  }

  return NextResponse.json({ ok: true });
}
