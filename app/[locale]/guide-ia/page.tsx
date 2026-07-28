import type { Metadata } from "next";
import { Orbs } from "@/components/Orbs";
import { GuideDownloadForm } from "@/components/GuideDownloadForm";

export const metadata: Metadata = {
  title: "Guide IA pour Entreprises Marocaines — Téléchargement Gratuit | EasyDigia",
  description: "Téléchargez notre guide pratique : comment les PME marocaines utilisent l'IA pour automatiser, fidéliser et croître. 4 pages, résultats concrets.",
  alternates: { canonical: "https://www.easydigia.com/fr/guide-ia" },
  openGraph: {
    title: "Guide IA pour Entreprises — Gratuit | EasyDigia",
    description: "5 solutions IA, 8 secteurs, cas clients réels. Téléchargez le guide pratique d'EasyDigia.",
    url: "https://www.easydigia.com/fr/guide-ia",
    images: [{ url: "https://www.easydigia.com/og-image.png", width: 1200, height: 630 }],
  },
};

const BENEFITS = [
  { icon: "🤖", text: "Les 5 solutions IA d'EasyDigia expliquées simplement" },
  { icon: "📊", text: "Cas concrets par secteur : restaurants, immobilier, santé, RH…" },
  { icon: "📈", text: "Statistiques et ROI mesurables (dès 30 jours)" },
  { icon: "🗺️", text: "Plan d'action en 3 étapes pour démarrer cette semaine" },
];

export default function GuideIAPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-base text-ink">
      <Orbs />

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-[1100px] px-[6vw] pb-8 pt-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

          {/* Left — copy */}
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-[12px] font-semibold uppercase tracking-wider text-brand">
              📥 Téléchargement gratuit
            </div>

            <h1 className="mb-4 text-[36px] font-extrabold leading-[1.15] tracking-tight text-ink lg:text-[48px]">
              L&apos;IA au service de votre{" "}
              <span className="bg-gradient-to-r from-brand to-[#C6FF00] bg-clip-text text-transparent">
                croissance
              </span>
            </h1>

            <p className="mb-8 text-[16px] leading-relaxed text-muted">
              Guide pratique 2025 — Comment les PME marocaines utilisent l&apos;intelligence
              artificielle pour automatiser leurs processus, fidéliser leurs clients et augmenter
              leur chiffre d&apos;affaires.
            </p>

            <ul className="mb-8 space-y-3">
              {BENEFITS.map((b) => (
                <li key={b.text} className="flex items-start gap-3">
                  <span className="mt-0.5 text-[18px]">{b.icon}</span>
                  <span className="text-[14px] text-[#C8CDD8]">{b.text}</span>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3 text-[12px] text-muted">
              <span className="rounded-full border border-white/10 px-3 py-1">📄 4 pages</span>
              <span className="rounded-full border border-white/10 px-3 py-1">⚡ Accès immédiat</span>
              <span className="rounded-full border border-white/10 px-3 py-1">🆓 100% gratuit</span>
            </div>
          </div>

          {/* Right — form */}
          <div id="formulaire" className="rounded-[20px] border border-white/[0.08] bg-white/[0.03] p-8">
            <h2 className="mb-2 text-[20px] font-bold text-ink">
              Recevez votre guide gratuitement
            </h2>
            <p className="mb-6 text-[13px] text-muted">
              Remplissez le formulaire ci-dessous. Le téléchargement démarre immédiatement.
            </p>
            <GuideDownloadForm />
          </div>
        </div>
      </section>

      {/* Social proof strip */}
      <section className="relative z-10 border-y border-white/[0.06] bg-white/[0.02] py-10">
        <div className="mx-auto flex max-w-[1100px] flex-wrap justify-center gap-10 px-[6vw]">
          {[
            { value: "50+", label: "Entreprises accompagnées" },
            { value: "8", label: "Secteurs couverts" },
            { value: "30j", label: "Pour voir les premiers résultats" },
            { value: "100%", label: "Clients satisfaits" },
          ].map((stat) => (
            <div key={stat.value} className="text-center">
              <div className="text-[38px] font-extrabold text-brand">{stat.value}</div>
              <div className="mt-1 text-[12px] text-muted">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Preview section */}
      <section className="relative z-10 mx-auto max-w-[1100px] px-[6vw] py-16">
        <h2 className="mb-2 text-center text-[12px] font-semibold uppercase tracking-[0.1em] text-brand">
          Contenu du guide
        </h2>
        <h3 className="mb-10 text-center text-[26px] font-bold tracking-tight text-ink">
          Ce que vous allez découvrir
        </h3>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { num: "01", title: "Le contexte IA au Maroc", desc: "Chiffres clés, tendances 2025 et opportunités pour les PME marocaines." },
            { num: "02", title: "Les 5 solutions IA", desc: "Chatbot, Automatisation, Agent IA, CRM Intelligent, Analyse de données — expliqués simplement." },
            { num: "03", title: "L'IA par secteur", desc: "Cas concrets pour restaurants, immobilier, santé, éducation, RH, logistique et plus." },
            { num: "04", title: "Plan d'action", desc: "3 étapes pour démarrer cette semaine, avec les résultats attendus à 30, 60 et 90 jours." },
          ].map((chapter) => (
            <div
              key={chapter.num}
              className="rounded-[16px] border border-white/[0.07] bg-white/[0.03] p-6"
            >
              <div className="mb-3 text-[28px] font-extrabold text-brand/30">{chapter.num}</div>
              <h4 className="mb-2 font-semibold text-ink">{chapter.title}</h4>
              <p className="text-[13px] leading-relaxed text-muted">{chapter.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative z-10 mx-auto max-w-[700px] px-[6vw] pb-24 text-center">
        <div className="rounded-[20px] border border-brand/20 bg-gradient-to-br from-brand/10 to-transparent p-10">
          <p className="mb-2 text-[13px] font-semibold uppercase tracking-wider text-brand">
            Gratuit — Accès immédiat
          </p>
          <h3 className="mb-4 text-[24px] font-bold text-ink">
            Prêt à transformer votre entreprise avec l&apos;IA ?
          </h3>
          <p className="mb-6 text-[14px] text-muted">
            Téléchargez le guide et recevez votre audit gratuit de 30 minutes offert par notre équipe.
          </p>
          <a
            href="#formulaire"
            className="inline-block rounded-[10px] bg-gradient-to-br from-brand to-[#C6FF00] px-8 py-3.5 text-[15px] font-bold text-[#0A0B10] shadow-[0_4px_24px_rgba(143,212,0,0.4)] transition hover:opacity-90"
          >
            Télécharger le guide →
          </a>
        </div>
      </section>
    </main>
  );
}
