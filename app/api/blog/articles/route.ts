import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

// POST — créer un nouvel article
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const { slug, category, read_min, published, published_at, content } = body as {
    slug: string;
    category: string;
    read_min: number;
    published: boolean;
    published_at?: string;
    content: Record<string, unknown>;
  };

  if (!slug || !content) {
    return NextResponse.json({ ok: false, error: "slug et content requis" }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("blog_articles")
      .insert({ slug, category, read_min, published, published_at, content })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ ok: true, article: data });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

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
