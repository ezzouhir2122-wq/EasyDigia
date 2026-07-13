"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/Logo";

const ADMIN_EMAIL = "ezzouhir2122@gmail.com";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/fr/admin/blog";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if env vars are configured
  const missingEnv = !SUPABASE_URL || !SUPABASE_ANON_KEY;

  useEffect(() => {
    if (missingEnv) return;
    import("@/lib/supabase-browser").then(({ createSupabaseBrowser }) => {
      const supabase = createSupabaseBrowser();
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user?.email === ADMIN_EMAIL) router.replace(next);
      });
    });
  }, [router, next, missingEnv]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (missingEnv) {
      setError("Configuration manquante : NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY doivent être définis dans Vercel.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { createSupabaseBrowser } = await import("@/lib/supabase-browser");
      const supabase = createSupabaseBrowser();

      // Timeout après 10 secondes
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), 10_000)
      );

      const authPromise = supabase.auth.signInWithPassword({ email, password });
      const { error: authError } = await Promise.race([authPromise, timeoutPromise]);

      if (authError) {
        setError("Email ou mot de passe incorrect.");
        return;
      }

      router.replace(next);
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg === "timeout") {
        setError("Délai dépassé — vérifiez que NEXT_PUBLIC_SUPABASE_URL est bien défini dans Vercel.");
      } else {
        setError("Erreur de connexion : " + msg);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {missingEnv && (
        <div className="rounded-[8px] border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-[12.5px] text-amber-400">
          ⚠ Variables manquantes dans Vercel :<br />
          <code className="font-mono text-[11px]">NEXT_PUBLIC_SUPABASE_URL</code><br />
          <code className="font-mono text-[11px]">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label className="text-[12.5px] font-medium text-[#9BA1B0]">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          placeholder="ezzouhir2122@gmail.com"
          className="rounded-[10px] border border-white/10 bg-[#0A0B10] px-4 py-3 text-[15px] text-[#F5F6FA] placeholder-[#9BA1B0]/40 outline-none transition focus:border-[#8FD400]/60"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[12.5px] font-medium text-[#9BA1B0]">Mot de passe</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className="rounded-[10px] border border-white/10 bg-[#0A0B10] px-4 py-3 text-[15px] text-[#F5F6FA] placeholder-[#9BA1B0]/40 outline-none transition focus:border-[#8FD400]/60"
        />
      </div>

      {error && (
        <div className="rounded-[8px] border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-[13px] text-red-400">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-1 w-full rounded-[10px] bg-gradient-to-br from-[#8FD400] to-[#C6FF00] py-3 text-[15px] font-bold text-[#0A0B10] shadow-[0_4px_20px_rgba(143,212,0,0.35)] transition hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Connexion en cours…" : "Se connecter"}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A0B10] px-4">
      <div className="w-full max-w-[420px]">
        <div className="mb-8 flex justify-center">
          <Logo className="h-16" />
        </div>
        <div className="rounded-[20px] border border-white/10 bg-[#12141C] p-8">
          <div className="mb-6 text-center">
            <div className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-[#8FD400]">
              Espace Admin
            </div>
            <h1 className="text-[22px] font-bold tracking-tight text-[#F5F6FA]">Connexion</h1>
          </div>
          <Suspense fallback={<div className="h-48 animate-pulse rounded-lg bg-white/5" />}>
            <LoginForm />
          </Suspense>
        </div>
        <p className="mt-6 text-center text-[12px] text-[#9BA1B0]/50">
          Accès réservé aux administrateurs EasyDigia
        </p>
      </div>
    </div>
  );
}
