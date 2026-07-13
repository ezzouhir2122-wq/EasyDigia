import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const CASES = [
  {
    sector: "Immobilier",
    icon: "🏠",
    tag: "Automatisation",
    location: "Marrakech",
    title: "Relances clients automatisées pour une agence immobilière",
    context:
      "L'agence gérait manuellement ses relances prospects par WhatsApp et email — un processus chronophage et source d'oublis fréquents.",
    solution:
      "Mise en place d'un workflow automatisé : dès qu'un prospect remplit un formulaire, il reçoit un message personnalisé, puis des relances échelonnées à J+2, J+7 et J+14 selon son comportement.",
    results: [
      { label: "Temps récupéré", value: "3h / semaine" },
      { label: "Leads manqués", value: "0" },
      { label: "Taux de réponse", value: "+40 %" },
    ],
    tools: ["Make", "WhatsApp Business API", "Airtable"],
  },
  {
    sector: "Mode & Retail",
    icon: "👗",
    tag: "Chatbot IA",
    location: "Casablanca",
    title: "Chatbot IA WhatsApp pour une boutique de mode",
    context:
      "La boutique recevait des dizaines de questions par jour sur WhatsApp (tailles, disponibilités, délais de livraison) — l'équipe passait 2h/jour à répondre manuellement.",
    solution:
      "Déploiement d'un agent IA entraîné sur le catalogue produits, les FAQ et la politique de livraison. Il répond 24h/24, qualifie les acheteurs sérieux et transfère les demandes complexes à un humain.",
    results: [
      { label: "Ventes en ligne", value: "+25 %" },
      { label: "Temps SAV économisé", value: "2h / jour" },
      { label: "Satisfaction client", value: "4.8 / 5" },
    ],
    tools: ["Agent IA sur-mesure", "WhatsApp Business API", "Supabase"],
  },
  {
    sector: "Industrie",
    icon: "🏭",
    tag: "Automatisation RH",
    location: "Agadir",
    title: "Onboarding collaborateur entièrement automatisé",
    context:
      "Chaque nouvel employé nécessitait 2 jours d'administratif : collecte de documents, création de comptes, formation initiale, suivi de progression — tout fait à la main.",
    solution:
      "Conception d'un workflow RH complet : formulaire d'entrée, collecte automatique des pièces, création des accès systèmes, envoi du plan de formation et relances jusqu'à validation.",
    results: [
      { label: "Durée onboarding", value: "2 jours → 2h" },
      { label: "Erreurs administratives", value: "−80 %" },
      { label: "Satisfaction RH équipe", value: "+60 %" },
    ],
    tools: ["Make", "Google Workspace", "Notion"],
  },
  {
    sector: "Restauration",
    icon: "🍽️",
    tag: "Dashboard IA",
    location: "Rabat",
    title: "Tableau de bord IA pour piloter 3 restaurants",
    context:
      "Le dirigeant pilotait 3 restaurants avec des données éparpillées : caisse, stocks, réservations et avis clients dans des outils différents, sans vue consolidée.",
    solution:
      "Création d'un dashboard unifié : consolidation des données en temps réel, alertes automatiques (stock critique, pic de réservations), résumé quotidien envoyé par email chaque matin.",
    results: [
      { label: "Temps de reporting", value: "−90 %" },
      { label: "Pertes sur stocks", value: "−35 %" },
      { label: "Décisions data-driven", value: "× 3" },
    ],
    tools: ["Dashboard sur-mesure", "Make", "Supabase", "Resend"],
  },
];

export default function Realisations() {
  const t = useTranslations("realisations");
  return (
    <main className="min-h-screen bg-[#0A0B10]">
      {/* Hero */}
      <section className="mx-auto max-w-[860px] px-[6vw] pb-12 pt-20 text-center">
        <div className="mb-4 font-mono text-[12px] uppercase tracking-[0.1em] text-[#8FD400]">
          {t("kicker")}
        </div>
        <h1 className="font-heading text-[clamp(32px,5vw,52px)] font-bold leading-[1.08] tracking-[-0.02em] text-[#F5F6FA]">
          {t("title")}
        </h1>
        <p className="mx-auto mt-5 max-w-[620px] text-[17px] leading-[1.65] text-[#9BA1B0]">
          {t("sub")}
        </p>
      </section>

      {/* Cases */}
      <section className="mx-auto max-w-[1100px] px-[6vw] pb-24">
        <div className="flex flex-col gap-8">
          {CASES.map((c, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-[24px] border border-white/[0.07] bg-[#12141C]"
            >
              {/* Top bar */}
              <div className="h-[3px] w-full bg-gradient-to-r from-[#8FD400] to-[#C6FF00] opacity-70" />

              <div className="p-8 md:p-10">
                {/* Header */}
                <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[#8FD400]/10 text-[24px]">
                      {c.icon}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-[#8FD400]/30 bg-[#8FD400]/[0.07] px-3 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-[0.07em] text-[#C6FF00]">
                          {c.tag}
                        </span>
                        <span className="text-[13px] text-[#9BA1B0]">
                          {c.sector} · {c.location}
                        </span>
                      </div>
                      <h2 className="mt-1 font-heading text-[20px] font-bold leading-[1.2] text-[#F5F6FA]">
                        {c.title}
                      </h2>
                    </div>
                  </div>

                  {/* Results inline */}
                  <div className="flex flex-wrap gap-3">
                    {c.results.map((r, j) => (
                      <div
                        key={j}
                        className="rounded-[12px] border border-[#8FD400]/20 bg-[#8FD400]/[0.05] px-4 py-2 text-center"
                      >
                        <div className="font-heading text-[18px] font-bold text-[#C6FF00]">
                          {r.value}
                        </div>
                        <div className="text-[11px] text-[#9BA1B0]">{r.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Body */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.07em] text-[#9BA1B0]/70">
                      Contexte
                    </p>
                    <p className="text-[14.5px] leading-[1.7] text-[#F5F6FA]/80">{c.context}</p>
                  </div>
                  <div>
                    <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.07em] text-[#9BA1B0]/70">
                      Solution
                    </p>
                    <p className="text-[14.5px] leading-[1.7] text-[#F5F6FA]/80">{c.solution}</p>
                  </div>
                </div>

                {/* Tools */}
                <div className="mt-6 flex flex-wrap items-center gap-2">
                  <span className="text-[12px] text-[#9BA1B0]/60">Outils :</span>
                  {c.tools.map((tool) => (
                    <span
                      key={tool}
                      className="rounded-[6px] border border-white/[0.08] bg-white/[0.03] px-2.5 py-0.5 text-[12px] text-[#9BA1B0]"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="pb-24">
        <div className="mx-auto max-w-[620px] px-[6vw] text-center">
          <div className="rounded-[24px] border border-[#8FD400]/20 bg-gradient-to-b from-[#8FD400]/[0.06] to-transparent px-8 py-12">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.1em] text-[#8FD400]">
              Votre projet
            </p>
            <h3 className="mb-4 font-heading text-[24px] font-bold text-[#F5F6FA]">
              {t("ctaTitle")}
            </h3>
            <p className="mb-7 text-[15px] text-[#9BA1B0]">{t("ctaSub")}</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-[12px] bg-gradient-to-br from-[#8FD400] to-[#C6FF00] px-8 py-3.5 text-[15px] font-bold text-[#0A0B10] shadow-[0_4px_24px_rgba(143,212,0,0.4)] transition hover:opacity-90"
            >
              {t("cta")} →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
