import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/leadSchema";
import { getSupabaseAdmin } from "@/lib/supabase";

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
  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("leads").insert(parsed.data);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("lead insert failed", e);
    return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  }
}
