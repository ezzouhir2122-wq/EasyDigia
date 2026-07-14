import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { sendArticleReadyEmail, sendArticleErrorEmail } from "@/lib/blog-notifier";

const mockSend = vi.fn().mockResolvedValue({ id: "mock-email-id" });

vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(function (this: unknown) {
    return { emails: { send: mockSend } };
  }),
}));

describe("blog-notifier", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv, RESEND_API_KEY: "re_test_key" };
    mockSend.mockClear();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("sendArticleReadyEmail appelle Resend avec le bon sujet", async () => {
    await sendArticleReadyEmail({
      title: "Comment automatiser ses relances",
      excerpt: "Découvrez comment...",
      slug: "automatiser-relances-abc",
      category: "Automatisation",
    });

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: expect.stringContaining("Comment automatiser ses relances"),
        from: "EasyDigia <noreply@easydigia.com>",
      })
    );
  });

  it("sendArticleReadyEmail inclut le lien admin dans le HTML", async () => {
    await sendArticleReadyEmail({
      title: "Test",
      excerpt: "Extrait test",
      slug: "test-slug",
      category: "IA",
    });

    const callArg = mockSend.mock.calls[0][0];
    expect(callArg.html).toContain("easydigia.com/fr/admin/blog");
  });

  it("sendArticleErrorEmail envoie un email avec ❌ dans le sujet", async () => {
    await sendArticleErrorEmail({
      theme: "Automatisation PME",
      error: "API timeout",
    });

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: expect.stringContaining("❌"),
      })
    );
  });

  it("ne lève pas d'erreur si RESEND_API_KEY est absent", async () => {
    delete process.env.RESEND_API_KEY;

    await expect(
      sendArticleReadyEmail({ title: "T", excerpt: "E", slug: "s", category: "c" })
    ).resolves.toBeUndefined();

    expect(mockSend).not.toHaveBeenCalled();
  });
});
