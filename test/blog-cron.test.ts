import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("@/config/blog-topics", () => ({
  BLOG_THEMES: ["Automatisation PME", "Agents IA"],
  topicGenerationPrompt: vi.fn().mockReturnValue("génère un sujet sur Automatisation PME"),
}));

vi.mock("@/lib/ai-providers", () => ({
  generateWithAI: vi.fn().mockResolvedValue("Comment automatiser ses relances avec Make"),
  detectProvider: vi.fn().mockReturnValue("claude"),
}));

vi.mock("@/lib/blog-generator", () => ({
  generateAndSaveArticle: vi.fn().mockResolvedValue({
    id: 42,
    slug: "automatiser-relances-make-abc123",
    title: "Comment automatiser ses relances avec Make",
    excerpt: "Découvrez comment...",
  }),
}));

vi.mock("@/lib/blog-notifier", () => ({
  sendArticleReadyEmail: vi.fn().mockResolvedValue(undefined),
  sendArticleErrorEmail: vi.fn().mockResolvedValue(undefined),
}));

const mockSingle = vi.fn();
const mockEq = vi.fn();
const mockUpdate = vi.fn();

vi.mock("@/lib/supabase", () => ({
  getSupabaseAdmin: vi.fn().mockReturnValue({
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({ single: mockSingle }),
      }),
      update: vi.fn().mockReturnValue({ eq: mockEq }),
    }),
  }),
}));

function makeRequest(authHeader?: string): Request {
  return new Request("https://easydigia.com/api/blog/cron", {
    headers: authHeader ? { authorization: authHeader } : {},
  });
}

describe("GET /api/blog/cron", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv, CRON_SECRET: "test-secret-123" };
    mockSingle.mockResolvedValue({ data: { theme_index: 0, run_count: 5 }, error: null });
    mockEq.mockResolvedValue({ error: null });
    vi.clearAllMocks();
    // Re-setup mocks after clearAllMocks
    mockSingle.mockResolvedValue({ data: { theme_index: 0, run_count: 5 }, error: null });
    mockEq.mockResolvedValue({ error: null });
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("retourne 401 si Authorization manquant", async () => {
    const { GET } = await import("@/app/api/blog/cron/route");
    const res = await GET(makeRequest());
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe("unauthorized");
  });

  it("retourne 401 si secret incorrect", async () => {
    const { GET } = await import("@/app/api/blog/cron/route");
    const res = await GET(makeRequest("Bearer wrong-secret"));
    expect(res.status).toBe(401);
  });

  it("retourne 200 avec ok:true si tout réussit", async () => {
    const { GET } = await import("@/app/api/blog/cron/route");
    const res = await GET(makeRequest("Bearer test-secret-123"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.slug).toBe("automatiser-relances-make-abc123");
    expect(body.title).toBe("Comment automatiser ses relances avec Make");
  });

  it("appelle sendArticleReadyEmail après génération réussie", async () => {
    const { sendArticleReadyEmail } = await import("@/lib/blog-notifier");
    const { GET } = await import("@/app/api/blog/cron/route");

    await GET(makeRequest("Bearer test-secret-123"));

    expect(vi.mocked(sendArticleReadyEmail)).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Comment automatiser ses relances avec Make",
        slug: "automatiser-relances-make-abc123",
      })
    );
  });

  it("retourne 500 et envoie email d'erreur si generateAndSaveArticle échoue", async () => {
    const { generateAndSaveArticle } = await import("@/lib/blog-generator");
    const { sendArticleErrorEmail } = await import("@/lib/blog-notifier");

    vi.mocked(generateAndSaveArticle).mockRejectedValueOnce(new Error("AI timeout"));

    const { GET } = await import("@/app/api/blog/cron/route");
    const res = await GET(makeRequest("Bearer test-secret-123"));

    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(vi.mocked(sendArticleErrorEmail)).toHaveBeenCalledWith(
      expect.objectContaining({ error: "AI timeout" })
    );
  });
});
