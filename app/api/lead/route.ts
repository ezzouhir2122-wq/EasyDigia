import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/leadSchema";
import { getSupabaseAdmin } from "@/lib/supabase";
import { Resend } from "resend";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 400 });
  }

  const { name, email, company, service, message } = parsed.data;

  // Save to Supabase (non-blocking — email always goes out even if DB fails)
  try {
    const supabase = getSupabaseAdmin();
    const { error: dbError } = await supabase.from("leads").insert(parsed.data);
    if (dbError) console.error("lead insert failed", dbError);
  } catch (e) {
    console.error("supabase error", e);
  }

  // Send email via Resend
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      const resend = new Resend(resendKey);
      const result = await resend.emails.send({
        from: "EasyDigia <contact@easydigia.com>",
        to: process.env.RESEND_TO_EMAIL ?? "contact@easydigia.com",
        subject: `Nouveau contact — ${name}${company ? ` (${company})` : ""}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0A0B10;color:#F5F6FA;padding:32px;border-radius:12px">
            <h2 style="color:#8FD400;margin:0 0 24px">Nouveau message EasyDigia</h2>
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:8px 0;color:#9BA1B0;width:120px">Nom</td><td style="padding:8px 0;font-weight:600">${name}</td></tr>
              <tr><td style="padding:8px 0;color:#9BA1B0">Email</td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#8FD400">${email}</a></td></tr>
              ${company ? `<tr><td style="padding:8px 0;color:#9BA1B0">Entreprise</td><td style="padding:8px 0">${company}</td></tr>` : ""}
              ${service ? `<tr><td style="padding:8px 0;color:#9BA1B0">Service</td><td style="padding:8px 0">${service}</td></tr>` : ""}
            </table>
            <div style="margin-top:24px;padding:16px;background:#12141C;border-radius:8px;border-left:3px solid #8FD400">
              <p style="margin:0;color:#9BA1B0;font-size:12px;text-transform:uppercase;letter-spacing:0.08em">Message</p>
              <p style="margin:8px 0 0;line-height:1.7">${message.replace(/\n/g, "<br>")}</p>
            </div>
          </div>
        `,
      });
      console.log("resend result", JSON.stringify(result));
    } catch (e) {
      console.error("email send failed", e);
    }
  } else {
    console.warn("RESEND_API_KEY manquant");
  }

  return NextResponse.json({ ok: true });
}
