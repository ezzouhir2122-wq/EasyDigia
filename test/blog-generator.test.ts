import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/ai-providers", () => ({
  generateWithAI: vi.fn(),
  detectProvider: vi.fn().mockReturnValue("claude"),
}));

vi.mock("@/lib/supabase", () => ({
  getSupabaseAdmin: vi.fn(),
}));

const MOCK_AI_RESPONSE = JSON.stringify({
  slug: "automatiser-relances-clients-pme",
  read_min: 6,
  fr: {
    title: "Comment automatiser ses relances clients dans une PME marocaine",
    tag: "Automatisation",
    excerpt: "Découvrez comment automatiser vos relances clients et récupérer 3h par semaine.",
    body: "<h2>Introduction</h2><p>L'automatisation des relances clients est un levier puissant.</p>",
  },
  en: {
    title: "How to automate client follow-ups in a Moroccan SME",
    tag: "Automation",
    excerpt: "Learn how to automate client follow-ups and save 3 hours per week.",
    body: "<h2>Introduction</h2><p>Automating client follow-ups is a powerful lever.</p>",
  },
  ar: {
    title: "كيفية أتمتة متابعة العملاء في المؤسسة الصغيرة المغربية",
    tag: "أتمتة",
    excerpt: "اكتشف كيفية أتمتة متابعة عملائك وتوفير 3 ساعات أسبوعياً.",
    body: "<h2>مقدمة</h2><p>أتمتة متابعة العملاء رافعة قوية.</p>",
  },
});

describe("generateAndSaveArticle", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("génère et sauvegarde un article, retourne id/slug/title/excerpt", async () => {
    const { generateWithAI } = await import("@/lib/ai-providers");
    const { getSupabaseAdmin } = await import("@/lib/supabase");

    vi.mocked(generateWithAI).mockResolvedValue(MOCK_AI_RESPONSE);
    vi.mocked(getSupabaseAdmin).mockReturnValue({
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id: 42, slug: "automatiser-relances-clients-pme-abc123" },
              error: null,
            }),
          }),
        }),
      }),
    } as never);

    const { generateAndSaveArticle } = await import("@/lib/blog-generator");
    const result = await generateAndSaveArticle({ topic: "Automatiser les relances clients PME" });

    expect(result.id).toBe(42);
    expect(result.slug).toContain("automatiser-relances-clients-pme");
    expect(result.title).toBe("Comment automatiser ses relances clients dans une PME marocaine");
    expect(result.excerpt).toBe("Découvrez comment automatiser vos relances clients et récupérer 3h par semaine.");
  });

  it("utilise le provider fourni en paramètre", async () => {
    const { generateWithAI } = await import("@/lib/ai-providers");
    const { getSupabaseAdmin } = await import("@/lib/supabase");

    vi.mocked(generateWithAI).mockResolvedValue(MOCK_AI_RESPONSE);
    vi.mocked(getSupabaseAdmin).mockReturnValue({
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id: 1, slug: "test-slug-abc" },
              error: null,
            }),
          }),
        }),
      }),
    } as never);

    const { generateAndSaveArticle } = await import("@/lib/blog-generator");
    await generateAndSaveArticle({ topic: "Test", provider: "gemini" });

    expect(vi.mocked(generateWithAI)).toHaveBeenCalledWith(expect.any(String), "gemini");
  });

  it("lève une erreur si Supabase échoue", async () => {
    const { generateWithAI } = await import("@/lib/ai-providers");
    const { getSupabaseAdmin } = await import("@/lib/supabase");

    vi.mocked(generateWithAI).mockResolvedValue(MOCK_AI_RESPONSE);
    vi.mocked(getSupabaseAdmin).mockReturnValue({
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { message: "duplicate key" },
            }),
          }),
        }),
      }),
    } as never);

    const { generateAndSaveArticle } = await import("@/lib/blog-generator");
    await expect(generateAndSaveArticle({ topic: "Test" })).rejects.toThrow("duplicate key");
  });
});
