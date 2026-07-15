import { NextResponse } from "next/server";

export async function GET() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return NextResponse.json({ error: "no key" });

  // List domains
  const listRes = await fetch("https://api.resend.com/domains", {
    headers: { Authorization: `Bearer ${key}` },
  });
  const list = await listRes.json() as { data: Array<{ id: string }> };
  const domainId = list.data?.[0]?.id;
  if (!domainId) return NextResponse.json({ error: "no domain", list });

  // Get domain details (records)
  const detailRes = await fetch(`https://api.resend.com/domains/${domainId}`, {
    headers: { Authorization: `Bearer ${key}` },
  });
  const detail = await detailRes.json();
  return NextResponse.json(detail);
}
