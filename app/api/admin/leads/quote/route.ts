import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { Resend } from "resend";
import { createQuotePdf, type QuoteData } from "@/lib/quote-pdf";

export async function POST(req: Request) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (user?.user_metadata?.role !== "admin") {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json() as { to?: string; name?: string; company?: string; quote?: QuoteData };
  if (!body.to || !body.name) {
    return NextResponse.json({ ok: false, error: "missing_client" }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return NextResponse.json({ ok: false, error: "RESEND_API_KEY manquant" }, { status: 500 });
  }

  const quote = body.quote as QuoteData | undefined;
  if (!quote?.items?.length || !quote.subject) {
    return NextResponse.json({ ok: false, error: "invalid_quote" }, { status: 400 });
  }
  const pdf = await createQuotePdf(quote);
  const firstName = body.name.trim().split(/\s+/)[0];
  const companyLine = body.company ? ` pour ${body.company}` : "";
  const resend = new Resend(key);
  const result = await resend.emails.send({
    from: "EasyDigia <contact@easydigia.com>",
    to: body.to,
    cc: process.env.RESEND_TO_EMAIL ?? "ezzouhir2122@gmail.com",
    replyTo: "contact@easydigia.com",
    subject: `Votre devis EasyDigia${companyLine}`,
    attachments: [{
      filename: "devis-easydigia.pdf",
      content: Buffer.from(pdf).toString("base64"),
    }],
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#18202a;padding:28px">
        <div style="border-left:4px solid #8FD400;padding-left:16px;margin-bottom:24px">
          <h2 style="margin:0;color:#18202a">Bonjour ${firstName},</h2>
        </div>
        <p style="font-size:15px;line-height:1.7">Merci pour votre demande concernant la création de contenus publicitaires et leur publication automatique sur les réseaux sociaux.</p>
        <p style="font-size:15px;line-height:1.7">Vous trouverez notre devis personnalisé en pièce jointe. Nous restons disponibles pour ajuster le périmètre selon vos produits, vos réseaux et votre calendrier de publication.</p>
        <p style="font-size:15px;line-height:1.7">Cordialement,<br/><b>Équipe EasyDigia</b><br/>contact@easydigia.com · +212 781 995 665</p>
      </div>
    `,
  });

  if (result.error) {
    return NextResponse.json({ ok: false, error: result.error.message }, { status: 500 });
  }
  try {
    await getSupabaseAdmin().from("leads").update({ quote_sent_at: new Date().toISOString() }).eq("email", body.to);
  } catch (error) {
    console.error("quote status update failed", error);
  }
  return NextResponse.json({ ok: true, id: result.data?.id });
}
