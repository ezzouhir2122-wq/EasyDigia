import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

// GET — tous les articles (published + drafts) pour l'admin
export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("blog_articles")
      .select("id, slug, category, read_min, published, published_at, created_at, content")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ ok: true, articles: data });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
