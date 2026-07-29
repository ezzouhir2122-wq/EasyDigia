"use client";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

const LOCALES = [
  { code: "fr", short: "FR", name: "Français", flag: "🇫🇷" },
  { code: "en", short: "EN", name: "English", flag: "🇬🇧" },
  { code: "ar", short: "ع", name: "العربية", flag: "🇸🇦" },
] as const;

export function LangSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function select(code: string) {
    setOpen(false);
    router.replace(pathname, { locale: code });
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Changer de langue"
        className="flex items-center gap-1.5 rounded-lg border border-white/12 bg-white/[0.04] px-3 py-2 text-[13px] font-medium text-ink transition hover:bg-white/[0.08]"
      >
        <span aria-hidden>{current.flag}</span>
        <span>{current.short}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          aria-hidden
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute end-0 z-50 mt-2 min-w-[150px] overflow-hidden rounded-xl border border-white/10 bg-surface shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
        >
          {LOCALES.map((l) => {
            const active = l.code === locale;
            return (
              <button
                key={l.code}
                type="button"
                role="menuitem"
                onClick={() => select(l.code)}
                aria-current={active ? "true" : undefined}
                className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-start text-[14px] transition ${
                  active ? "bg-brand/10 font-semibold text-brand-bright" : "text-ink hover:bg-white/[0.06]"
                }`}
              >
                <span>{l.name}</span>
                <span className="font-mono text-[11px] text-muted">{l.short}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
