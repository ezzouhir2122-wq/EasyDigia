import { NextResponse } from "next/server";
import { BLOG_THEMES, topicGenerationPrompt } from "@/config/blog-topics";
import { generateAndSaveArticle } from "@/lib/blog-generator";
import { sendArticleReadyEmail, sendArticleErrorEmail } from "@/lib/blog-notifier";
import { generateWithAI, detectProvider } from "@/lib/ai-providers";
import { getSupabaseAdmin } from "@/lib/supabase";

function isAuthorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

async function getSchedulerState(): Promise<{ theme_index: number; run_count: number }> {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("blog_scheduler")
    .select("theme_index, run_count")
    .eq("id", 1)
    .single();
  return { theme_index: data?.theme_index ?? 0, run_count: data?.run_count ?? 0 };
}

async function updateSchedulerState(params: {
  theme_index: number;
  run_count: number;
  slug: string;
  title: string;
}): Promise<void> {
  const supabase = getSupabaseAdmin();
  await supabase
    .from("blog_scheduler")
    .update({
      theme_index: params.theme_index,
      run_count: params.run_count + 1,
      last_run_at: new Date().toISOString(),
      last_slug: params.slug,
      last_title: params.title,
    })
    .eq("id", 1);
}

export async function GET(req: Request): Promise<NextResponse> {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let currentTheme = "";

  try {
    const { theme_index, run_count } = await getSchedulerState();
    const nextIndex = theme_index % BLOG_THEMES.length;
    currentTheme = BLOG_THEMES[nextIndex];

    const provider = detectProvider();
    const topicRaw = await generateWithAI(topicGenerationPrompt(currentTheme), provider);
    const topic = topicRaw.trim();

    const article = await generateAndSaveArticle({ topic, category: "ai", provider });

    await updateSchedulerState({
      theme_index: theme_index + 1,
      run_count,
      slug: article.slug,
      title: article.title,
    });

    await sendArticleReadyEmail({
      title: article.title,
      excerpt: article.excerpt,
      slug: article.slug,
      category: "ai",
    }).catch((e) => console.error("[cron] sendArticleReadyEmail failed:", e));

    return NextResponse.json({ ok: true, slug: article.slug, title: article.title });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[cron] error:", msg);
    await sendArticleErrorEmail({ theme: currentTheme, error: msg }).catch(() => {});
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
