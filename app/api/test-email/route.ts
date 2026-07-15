import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function GET() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return NextResponse.json({ error: "RESEND_API_KEY manquant" }, { status: 500 });

  const resend = new Resend(key);

  const send = await resend.emails.send({
    from: "EasyDigia <contact@easydigia.com>",
    to: process.env.RESEND_TO_EMAIL ?? "contact@easydigia.com",
    subject: "✅ Test boîte contact@easydigia.com",
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:0 auto;background:#0A0B10;color:#F5F6FA;padding:32px;border-radius:12px">
        <h2 style="color:#8FD400;margin:0 0 16px">Boîte email opérationnelle ✅</h2>
        <p style="color:#9BA1B0;margin:0">Si vous recevez ce message, la boîte <strong style="color:#F5F6FA">contact@easydigia.com</strong> fonctionne correctement.</p>
        <p style="margin-top:16px;font-size:12px;color:#9BA1B0">Envoyé le ${new Date().toLocaleString("fr-FR")} via Resend</p>
      </div>
    `,
  });

  if (send.error) return NextResponse.json({ ok: false, error: send.error });

  // Attendre 2s puis vérifier le statut de livraison
  await new Promise(r => setTimeout(r, 2000));
  const check = await resend.emails.get(send.data!.id);

  return NextResponse.json({ ok: true, emailId: send.data!.id, delivery: check.data });
}
