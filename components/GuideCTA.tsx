import { Link } from "@/i18n/navigation";

export function GuideCTA() {
  return (
    <section className="relative z-10 mx-auto max-w-[1100px] px-[6vw] py-16">
      <div className="rounded-[24px] border border-brand/20 bg-gradient-to-br from-brand/[0.08] to-transparent p-10">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-[540px]">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand">
              📥 Guide gratuit
            </div>
            <h2 className="mb-2 text-[22px] font-bold tracking-tight text-ink">
              Téléchargez notre guide IA pour entreprises
            </h2>
            <p className="text-[14px] leading-relaxed text-muted">
              5 solutions IA, 8 secteurs, cas clients réels — tout ce qu&apos;il faut savoir pour
              transformer votre entreprise avec l&apos;intelligence artificielle. Gratuit, accès immédiat.
            </p>
          </div>
          <Link
            href="/guide-ia"
            className="shrink-0 rounded-[10px] bg-gradient-to-br from-brand to-[#C6FF00] px-7 py-3.5 text-[14px] font-bold text-[#0A0B10] shadow-[0_4px_20px_rgba(143,212,0,0.35)] transition hover:opacity-90"
          >
            Télécharger le guide →
          </Link>
        </div>
      </div>
    </section>
  );
}
