import { NextResponse } from "next/server";

export async function GET() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return NextResponse.json({ error: "no key" });

  const res = await fetch("https://api.resend.com/domains", {
    headers: { Authorization: `Bearer ${key}` },
  });
  const data = await res.json();
  return NextResponse.json(data);
}
