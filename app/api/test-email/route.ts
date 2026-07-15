import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function GET() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return NextResponse.json({ error: "RESEND_API_KEY manquant" }, { status: 500 });

  const resend = new Resend(key);
  const result = await resend.emails.send({
    from: "EasyDigia <noreply@easydigia.com>",
    to: process.env.RESEND_TO_EMAIL ?? "ezzouhir2122@gmail.com",
    subject: "Test EasyDigia — vérification Resend",
    html: "<p>Si tu reçois cet email, Resend fonctionne correctement ✅</p>",
  });

  return NextResponse.json(result);
}
