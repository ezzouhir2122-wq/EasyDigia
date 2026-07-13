"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { Logo } from "@/components/Logo";
import { Link } from "@/i18n/navigation";

type Mode = "signin" | "signup";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const supabase = createSupabaseBrowser();

    if (mode === "signup") {
      const { error: err } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (err) {
        setError(err.message === "User already registered"
          ? "Un compte existe déjà avec cet email."
          : err.message);
      } else {
        setSuccess("Compte créé ! Vérifiez votre email pour confirmer votre inscription.");
      }
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) {
        setError("Email ou mot de passe incorrect.");
      } else {
        router.replace("/fr");
        router.refresh();
      }
    }

    setLoading(false);
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-[440px]">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Link href="/">
            <Logo className="h-16" />
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-[22px] border border-white/10 bg-[#12141C] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
          {/* Tabs */}
          <div className="mb-7 flex rounded-[12px] border border-white/[0.07] bg-[#0A0B10] p-1">
            {(["signin", "signup"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => { setMode(m); setError(null); setSuccess(null); }}
                className={`flex-1 rounded-[9px] py-2.5 text-[13.5px] font-semibold transition ${
                  mode === m
                    ? "bg-[#12141C] text-[#F5F6FA] shadow-sm"
                    : "text-[#9BA1B0] hover:text-[#F5F6FA]"
                }`}
              >
                {m === "signin" ? "Se connecter" : "S'inscrire"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === "signup" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-medium text-[#9BA1B0]">Nom complet</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Votre prénom et nom"
                  className="rounded-[10px] border border-white/10 bg-[#0A0B10] px-4 py-3 text-[15px] text-[#F5F6FA] placeholder-[#9BA1B0]/40 outline-none transition focus:border-[#8FD400]/60"
                />
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
                placeholder="vous@exemple.com"
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
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                placeholder="••••••••"
                minLength={6}
                className="rounded-[10px] border border-white/10 bg-[#0A0B10] px-4 py-3 text-[15px] text-[#F5F6FA] placeholder-[#9BA1B0]/40 outline-none transition focus:border-[#8FD400]/60"
              />
              {mode === "signup" && (
                <span className="text-[11.5px] text-[#9BA1B0]/60">Minimum 6 caractères</span>
              )}
            </div>

            {error && (
              <div className="rounded-[8px] border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-[13.5px] text-red-400">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-[8px] border border-[#8FD400]/30 bg-[#8FD400]/10 px-4 py-2.5 text-[13.5px] text-[#C6FF00]">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full rounded-[10px] bg-gradient-to-br from-[#8FD400] to-[#C6FF00] py-3.5 text-[15px] font-bold text-[#0A0B10] shadow-[0_4px_20px_rgba(143,212,0,0.35)] transition hover:opacity-90 disabled:opacity-50"
            >
              {loading
                ? "…"
                : mode === "signin"
                ? "Se connecter"
                : "Créer mon compte"}
            </button>
          </form>

          {mode === "signin" && (
            <p className="mt-5 text-center text-[13px] text-[#9BA1B0]">
              Pas encore de compte ?{" "}
              <button
                onClick={() => setMode("signup")}
                className="font-semibold text-[#8FD400] hover:underline"
              >
                S'inscrire gratuitement
              </button>
            </p>
          )}
        </div>

        <p className="mt-6 text-center text-[12px] text-[#9BA1B0]/50">
          En créant un compte, vous acceptez nos conditions d'utilisation.
        </p>
      </div>
    </div>
  );
}
