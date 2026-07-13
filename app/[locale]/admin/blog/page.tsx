"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

type Article = {
  id: string;
  slug: string;
  category: string;
  read_min: number;
  published: boolean;
  created_at: string;
  content: Record<string, { title: string; excerpt: string; tag: string }>;
};

const CATEGORIES = [
  { value: "ai", label: "IA & Agents" },
  { value: "automation", label: "Automatisation" },
  { value: "strategy", label: "Stratégie digitale" },
  { value: "tutorial", label: "Tutoriel" },
];

const PROVIDERS = [
  { value: "grok", label: "Grok (xAI)", icon: "⚡" },
  { value: "gemini", label: "Gemini (Google)", icon: "💎" },
  { value: "claude", label: "Claude (Anthropic)", icon: "🧠" },
];

export default function AdminBlog() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("ai");
  const [provider, setProvider] = useState("grok");
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function loadArticles() {
    setLoading(true);
    const res = await fetch("/api/blog/articles");
    const json = await res.json();
    if (json.ok) setArticles(json.articles);
    setLoading(false);
  }

  useEffect(() => { loadArticles(); }, []);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim()) return;
    setGenerating(true);
    setMsg(null);
    try {
      const res = await fetch("/api/blog/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, category, provider }),
      });
      const json = await res.json();
      if (json.ok) {
        const pLabel = PROVIDERS.find(p => p.value === json.provider)?.label ?? json.provider;
        setMsg({ type: "ok", text: `Article "${json.article.content?.fr?.title ?? json.article.slug}" généré par ${pLabel} ✅` });
        setTopic("");
        loadArticles();
      } else {
        setMsg({ type: "err", text: json.error ?? "Erreur inconnue" });
      }
    } catch (e) {
      setMsg({ type: "err", text: e instanceof Error ? e.message : JSON.stringify(e) });
    }
    setGenerating(false);
  }

  async function togglePublish(article: Article) {
    const res = await fetch(`/api/blog/articles/${article.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !article.published }),
    });
    if (res.ok) loadArticles();
  }

  async function deleteArticle(id: string) {
    if (!confirm("Supprimer cet article ?")) return;
    await fetch(`/api/blog/articles/${id}`, { method: "DELETE" });
    loadArticles();
  }

  return (
    <div className="min-h-screen bg-[#0A0B10] p-6 text-[#F5F6FA]">
      <div className="mx-auto max-w-[900px]">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.1em] text-[#8FD400]">
              EasyDigia — Admin
            </div>
            <h1 className="text-[28px] font-bold tracking-tight">Gestion du Blog IA</h1>
            <p className="mt-1 text-[14px] text-[#9BA1B0]">
              Générez des articles en FR/EN/AR avec Grok, Gemini ou Claude
            </p>
          </div>
          <button
            onClick={async () => {
              const supabase = createSupabaseBrowser();
              await supabase.auth.signOut();
              window.location.href = "/fr/admin-login";
            }}
            className="shrink-0 rounded-[9px] border border-white/10 px-4 py-2 text-[13px] text-[#9BA1B0] transition hover:border-red-500/40 hover:text-red-400"
          >
            Déconnexion
          </button>
        </div>

        {/* Generate form */}
        <div className="mb-8 rounded-[18px] border border-white/10 bg-[#12141C] p-7">
          <h2 className="mb-5 text-[17px] font-semibold">Générer un nouvel article</h2>
          <form onSubmit={handleGenerate} className="flex flex-col gap-4">
            {/* Provider selector */}
            <div className="flex flex-wrap gap-2">
              {PROVIDERS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setProvider(p.value)}
                  disabled={generating}
                  className={`flex items-center gap-2 rounded-[10px] border px-4 py-2.5 text-[13px] font-medium transition ${
                    provider === p.value
                      ? "border-[#8FD400]/60 bg-[#8FD400]/10 text-[#C6FF00]"
                      : "border-white/10 text-[#9BA1B0] hover:border-white/20"
                  }`}
                >
                  <span>{p.icon}</span>
                  {p.label}
                </button>
              ))}
            </div>

            <div className="flex gap-3 max-sm:flex-col">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ex: Comment l'IA améliore la relation client dans le retail"
                className="flex-1 rounded-[10px] border border-white/10 bg-[#0A0B10] px-4 py-3 text-[15px] text-[#F5F6FA] placeholder-[#9BA1B0]/50 outline-none focus:border-[#8FD400]/60"
                disabled={generating}
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-[180px] rounded-[10px] border border-white/10 bg-[#0A0B10] px-4 py-3 text-[15px] text-[#F5F6FA] outline-none focus:border-[#8FD400]/60 max-sm:w-full"
                disabled={generating}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={generating || !topic.trim()}
              className="self-start rounded-[10px] bg-gradient-to-br from-[#8FD400] to-[#C6FF00] px-7 py-3 text-[14px] font-bold text-[#0A0B10] shadow-[0_4px_20px_rgba(143,212,0,0.35)] transition hover:opacity-90 disabled:opacity-50"
            >
              {generating
                ? "Génération en cours… (30–60s)"
                : `✨ Générer avec ${PROVIDERS.find((p) => p.value === provider)?.label ?? provider}`}
            </button>
          </form>

          {msg && (
            <div
              className={`mt-4 rounded-[10px] px-4 py-3 text-[14px] ${
                msg.type === "ok"
                  ? "border border-[#8FD400]/30 bg-[#8FD400]/10 text-[#C6FF00]"
                  : "border border-red-500/30 bg-red-500/10 text-red-400"
              }`}
            >
              {msg.text}
            </div>
          )}
        </div>

        {/* Articles list */}
        <div className="rounded-[18px] border border-white/10 bg-[#12141C] p-7">
          <h2 className="mb-5 text-[17px] font-semibold">
            Articles ({articles.length})
          </h2>
          {loading ? (
            <p className="text-[14px] text-[#9BA1B0]">Chargement…</p>
          ) : articles.length === 0 ? (
            <p className="text-[14px] text-[#9BA1B0]">Aucun article. Générez-en un ci-dessus.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {articles.map((article) => {
                const fr = article.content?.fr;
                return (
                  <div
                    key={article.id}
                    className="flex items-start justify-between gap-4 rounded-[12px] border border-white/07 bg-[#0A0B10] p-4 max-sm:flex-col"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                            article.published
                              ? "bg-[#8FD400]/20 text-[#C6FF00]"
                              : "bg-white/10 text-[#9BA1B0]"
                          }`}
                        >
                          {article.published ? "Publié" : "Brouillon"}
                        </span>
                        <span className="text-[11px] text-[#9BA1B0]/60 font-mono">
                          {article.category}
                        </span>
                        <span className="text-[11px] text-[#9BA1B0]/40">
                          {new Date(article.created_at).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                      <p className="text-[14px] font-medium text-[#F5F6FA] truncate">
                        {fr?.title ?? article.slug}
                      </p>
                      <p className="mt-0.5 text-[12.5px] text-[#9BA1B0]/70 truncate">
                        {fr?.excerpt ?? ""}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        onClick={() => togglePublish(article)}
                        className={`rounded-[8px] px-3 py-1.5 text-[12px] font-semibold transition ${
                          article.published
                            ? "border border-white/10 text-[#9BA1B0] hover:border-red-500/40 hover:text-red-400"
                            : "border border-[#8FD400]/30 text-[#8FD400] hover:bg-[#8FD400]/10"
                        }`}
                      >
                        {article.published ? "Dépublier" : "Publier"}
                      </button>
                      <button
                        onClick={() => deleteArticle(article.id)}
                        className="rounded-[8px] border border-white/07 px-3 py-1.5 text-[12px] text-[#9BA1B0]/60 transition hover:border-red-500/40 hover:text-red-400"
                      >
                        Suppr.
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Note clé API */}
        <div className="mt-6 rounded-[12px] border border-amber-500/20 bg-amber-500/5 p-4 text-[13px] text-amber-400">
          <strong>⚠️ Variables d'environnement requises dans .env.local et Vercel :</strong>{" "}
          <code className="rounded bg-amber-500/10 px-1 py-0.5 font-mono">GROK_API_KEY</code>{" "}·{" "}
          <code className="rounded bg-amber-500/10 px-1 py-0.5 font-mono">GEMINI_API_KEY</code>{" "}·{" "}
          <code className="rounded bg-amber-500/10 px-1 py-0.5 font-mono">ANTHROPIC_API_KEY</code>{" "}
          — au moins une clé est requise. Grok sélectionné par défaut.
        </div>
      </div>
    </div>
  );
}
