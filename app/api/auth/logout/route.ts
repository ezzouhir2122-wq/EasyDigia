import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

export async function POST(request: Request) {
  const supabase = await createSupabaseServer();
  await supabase.auth.signOut();

  const url = new URL("/fr", request.url);
  return NextResponse.redirect(url, { status: 302 });
}
