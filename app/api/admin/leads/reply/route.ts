import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { Resend } from "resend";

export async function POST(req: Request) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (user?.user_metadata?.role !== "admin") {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const { to, name, subject, message } = await req.json() as {
    to: string; name: string; subject: string; message: string;
  };

  const key = process.env.RESEND_API_KEY;
  if (!key) return NextResponse.json({ ok: false, error: "RESEND_API_KEY manquant" }, { status: 500 });

  const resend = new Resend(key);
  const result = await resend.emails.send({
    from: "EasyDigia <contact@easydigia.com>",
    to,
    replyTo: "contact@easydigia.com",
    subject,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#ffffff;color:#111;padding:32px;border-radius:12px">
        <div style="border-left:4px solid #8FD400;padding-left:16px;margin-bottom:24px">
          <p style="margin:0;font-size:13px;color:#666">Bonjour ${name},</p>
        </div>
        <div style="font-size:15px;line-height:1.7;color:#222;white-space:pre-wrap">${message}</div>
        <hr style="margin:32px 0;border:none;border-top:1px solid #eee" />
        <div style="text-align:center">
          <img src="https://www.easydigia.com/icon.svg" alt="EasyDigia" style="height:32px;margin-bottom:8px" />
          <p style="margin:0;font-size:12px;color:#999">EasyDigia · Automatisation & IA · Marrakech, Maroc</p>
          <p style="margin:4px 0 0;font-size:12px;color:#999">contact@easydigia.com · +212 781 995 665</p>
        </div>
      </div>
    `,
  });

  if (result.error) return NextResponse.json({ ok: false, error: result.error.message }, { status: 500 });
  return NextResponse.json({ ok: true, id: result.data?.id });
}
