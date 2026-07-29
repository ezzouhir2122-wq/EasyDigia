"use client";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

function Flag({ code }: { code: string }) {
  if (code === "fr") return (
    <svg width="20" height="14" viewBox="0 0 20 14" aria-hidden className="rounded-sm overflow-hidden">
      <rect width="7" height="14" fill="#002395" />
      <rect x="7" width="6" height="14" fill="#fff" />
      <rect x="13" width="7" height="14" fill="#ED2939" />
    </svg>
  );
  if (code === "en") return (
    <svg width="20" height="14" viewBox="0 0 60 40" aria-hidden className="rounded-sm overflow-hidden">
      <rect width="60" height="40" fill="#012169" />
      <path d="M0,0 L60,40 M60,0 L0,40" stroke="#fff" strokeWidth="8" />
      <path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" strokeWidth="5" />
      <path d="M30,0 V40 M0,20 H60" stroke="#fff" strokeWidth="13" />
      <path d="M30,0 V40 M0,20 H60" stroke="#C8102E" strokeWidth="8" />
    </svg>
  );
  if (code === "ar") return (
    <svg width="20" height="14" viewBox="0 0 60 40" aria-hidden className="rounded-sm overflow-hidden">
      <rect width="60" height="40" fill="#C1272D" />
      <path d="M30,10 L32.4,17.5 H40.1 L34,22 L36.4,29.5 L30,25 L23.6,29.5 L26,22 L19.9,17.5 H27.6 Z" fill="none" stroke="#006233" strokeWidth="1.5" />
    </svg>
  );
  return null;
}

const LOCALES = [
  { code: "fr", short: "FR", name: "Français" },
  { code: "en", short: "EN", name: "English" },
  { code: "ar", short: "ع", name: "العربية" },
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
        <Flag code={current.code} />
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
                <span className="flex items-center gap-2">
                  <Flag code={l.code} />
                  <span>{l.name}</span>
                </span>
                <span className="font-mono text-[11px] text-muted">{l.short}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
