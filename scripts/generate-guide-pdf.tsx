import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToFile,
  Font,
} from "@react-pdf/renderer";
import path from "path";

// ─── Palette ────────────────────────────────────────────────────────────────
const C = {
  dark:    "#0A0B10",
  dark2:   "#12141C",
  dark3:   "#1A1D2E",
  brand:   "#8FD400",
  brand2:  "#C6FF00",
  ink:     "#F5F6FA",
  muted:   "#9BA1B0",
  border:  "#1E2130",
  white10: "rgba(255,255,255,0.06)",
};

// ─── Styles ─────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    backgroundColor: C.dark,
    color: C.ink,
    fontFamily: "Helvetica",
    paddingTop: 0,
    paddingBottom: 40,
    paddingHorizontal: 0,
  },

  // Cover header strip
  coverHeader: {
    backgroundColor: C.dark2,
    paddingHorizontal: 48,
    paddingTop: 48,
    paddingBottom: 40,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  badgeRow: {
    flexDirection: "row",
    marginBottom: 20,
  },
  badge: {
    backgroundColor: "#1A2800",
    borderWidth: 1,
    borderColor: C.brand,
    borderRadius: 99,
    paddingHorizontal: 12,
    paddingVertical: 4,
    fontSize: 9,
    color: C.brand,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1,
  },
  h1: {
    fontSize: 32,
    fontFamily: "Helvetica-Bold",
    color: C.ink,
    lineHeight: 1.2,
    marginBottom: 16,
  },
  brandSpan: {
    color: C.brand,
  },
  coverSubtitle: {
    fontSize: 13,
    color: C.muted,
    lineHeight: 1.6,
    maxWidth: 420,
    marginBottom: 28,
  },
  coverMeta: {
    flexDirection: "row",
    gap: 24,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.brand,
    marginTop: 1,
  },
  metaText: {
    fontSize: 10,
    color: C.muted,
  },

  // Section wrapper
  section: {
    paddingHorizontal: 48,
    paddingTop: 36,
  },
  sectionLabel: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: C.brand,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  h2: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: C.ink,
    marginBottom: 12,
    lineHeight: 1.25,
  },
  h3: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: C.ink,
    marginBottom: 6,
  },
  body: {
    fontSize: 11,
    color: C.muted,
    lineHeight: 1.65,
    marginBottom: 10,
  },

  // Card grid
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 16,
  },
  card: {
    width: "47%",
    backgroundColor: C.dark2,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    padding: 14,
  },
  cardIcon: {
    fontSize: 18,
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: C.ink,
    marginBottom: 4,
  },
  cardBody: {
    fontSize: 9.5,
    color: C.muted,
    lineHeight: 1.55,
  },

  // Stats row
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#0F1500",
    borderWidth: 1,
    borderColor: "#2A3D00",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
  },
  statValue: {
    fontSize: 26,
    fontFamily: "Helvetica-Bold",
    color: C.brand,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 9,
    color: C.muted,
    textAlign: "center",
    lineHeight: 1.4,
  },

  // Divider
  divider: {
    marginHorizontal: 48,
    marginTop: 28,
    height: 1,
    backgroundColor: C.border,
  },

  // Service list
  serviceRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    marginBottom: 14,
    backgroundColor: C.dark2,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    padding: 14,
  },
  serviceIcon: {
    fontSize: 22,
    marginTop: 1,
  },
  serviceContent: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: C.ink,
    marginBottom: 3,
  },
  serviceDesc: {
    fontSize: 9.5,
    color: C.muted,
    lineHeight: 1.55,
  },
  serviceTag: {
    marginTop: 6,
    backgroundColor: "#1A2800",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: "flex-start",
  },
  serviceTagText: {
    fontSize: 8,
    color: C.brand,
    fontFamily: "Helvetica-Bold",
  },

  // Steps
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    marginBottom: 16,
  },
  stepNum: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#1A2800",
    borderWidth: 1,
    borderColor: C.brand,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumText: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: C.brand,
    marginTop: -1,
  },
  stepContent: {
    flex: 1,
    paddingTop: 4,
  },

  // Quote
  quoteBox: {
    backgroundColor: C.dark2,
    borderLeftWidth: 3,
    borderLeftColor: C.brand,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  quoteText: {
    fontSize: 10.5,
    color: C.ink,
    fontFamily: "Helvetica-Oblique",
    lineHeight: 1.6,
    marginBottom: 8,
  },
  quoteAuthor: {
    fontSize: 9,
    color: C.brand,
    fontFamily: "Helvetica-Bold",
  },

  // CTA box
  ctaBox: {
    marginHorizontal: 48,
    marginTop: 28,
    backgroundColor: "#0F1500",
    borderWidth: 1,
    borderColor: C.brand,
    borderRadius: 14,
    padding: 28,
    alignItems: "center",
  },
  ctaTitle: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: C.ink,
    textAlign: "center",
    marginBottom: 8,
  },
  ctaBody: {
    fontSize: 10.5,
    color: C.muted,
    textAlign: "center",
    lineHeight: 1.6,
    marginBottom: 20,
    maxWidth: 360,
  },
  ctaBtn: {
    backgroundColor: C.brand,
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  ctaBtnText: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: C.dark,
  },
  ctaContact: {
    marginTop: 12,
    fontSize: 9,
    color: C.muted,
  },

  // Footer
  footer: {
    marginTop: 20,
    marginHorizontal: 48,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: C.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerBrand: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: C.brand,
  },
  footerUrl: {
    fontSize: 9,
    color: C.muted,
  },
  footerPage: {
    fontSize: 9,
    color: C.muted,
  },

  // Sector tags
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 12,
  },
  tag: {
    backgroundColor: C.dark3,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontSize: 9,
    color: C.muted,
  },

  // Page header (pages 2+)
  pageHeader: {
    backgroundColor: C.dark2,
    paddingHorizontal: 48,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pageHeaderBrand: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: C.brand,
  },
  pageHeaderChapter: {
    fontSize: 9,
    color: C.muted,
  },
});

// ─── Helpers ────────────────────────────────────────────────────────────────
const PageHeader = ({ chapter }: { chapter: string }) => (
  <View style={s.pageHeader}>
    <Text style={s.pageHeaderBrand}>EasyDigia</Text>
    <Text style={s.pageHeaderChapter}>{chapter}</Text>
  </View>
);

const Footer = ({ page }: { page: string }) => (
  <View style={s.footer}>
    <Text style={s.footerBrand}>EasyDigia</Text>
    <Text style={s.footerUrl}>www.easydigia.com</Text>
    <Text style={s.footerPage}>{page}</Text>
  </View>
);

// ─── PDF Document ────────────────────────────────────────────────────────────
const GuidePDF = () => (
  <Document
    title="Guide IA pour Entreprises — EasyDigia"
    author="EasyDigia"
    subject="L'IA au service de votre croissance"
    keywords="intelligence artificielle, automatisation, chatbot, Maroc, PME"
  >

    {/* ═══════════════════════════════════════════
        PAGE 1 — COUVERTURE
    ═══════════════════════════════════════════ */}
    <Page size="A4" style={s.page}>

      {/* Cover header */}
      <View style={s.coverHeader}>
        <View style={s.badgeRow}>
          <Text style={s.badge}>GUIDE PRATIQUE 2025</Text>
        </View>

        <Text style={s.h1}>
          {"L'Intelligence Artificielle\nau Service de Votre\n"}
          <Text style={{ color: C.brand }}>Croissance</Text>
        </Text>

        <Text style={s.coverSubtitle}>
          Découvrez comment les PME marocaines utilisent l'IA pour automatiser leurs processus,
          fidéliser leurs clients et augmenter leur chiffre d'affaires — avec des résultats
          concrets dès les 30 premiers jours.
        </Text>

        <View style={s.coverMeta}>
          {["5 solutions IA détaillées", "8 secteurs couverts", "Cas clients réels"].map((item) => (
            <View key={item} style={s.metaItem}>
              <View style={s.metaDot} />
              <Text style={s.metaText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Intro stats */}
      <View style={s.section}>
        <Text style={s.sectionLabel}>Le contexte</Text>
        <Text style={s.h2}>L'IA n'est plus une option, c'est un avantage concurrentiel</Text>
        <Text style={s.body}>
          En 2025, les entreprises qui n'adoptent pas l'intelligence artificielle prennent du retard
          sur leurs concurrents. Au Maroc, la transformation digitale s'accélère et les PME qui
          intègrent l'IA aujourd'hui domineront leurs marchés demain.
        </Text>
      </View>

      <View style={[s.statsRow, { paddingHorizontal: 48 }]}>
        {[
          { value: "73%", label: "des clients préfèrent une réponse instantanée à toute heure" },
          { value: "40%", label: "de réduction des tâches administratives avec l'automatisation" },
          { value: "3×", label: "plus de leads convertis avec un chatbot vs formulaire classique" },
          { value: "30j", label: "pour voir les premiers résultats mesurables avec l'IA" },
        ].map((stat) => (
          <View key={stat.value} style={s.statCard}>
            <Text style={s.statValue}>{stat.value}</Text>
            <Text style={s.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View style={s.divider} />

      <View style={[s.section, { paddingTop: 20 }]}>
        <Text style={s.body}>
          Ce guide vous présente les 5 solutions IA qu'EasyDigia déploie pour les entreprises
          marocaines, avec des exemples concrets par secteur, les bénéfices attendus et un plan
          d'action pour démarrer rapidement.
        </Text>
      </View>

      <Footer page="Page 1 / 4" />
    </Page>

    {/* ═══════════════════════════════════════════
        PAGE 2 — LES 5 SOLUTIONS IA
    ═══════════════════════════════════════════ */}
    <Page size="A4" style={s.page}>
      <PageHeader chapter="Les 5 solutions IA d'EasyDigia" />

      <View style={s.section}>
        <Text style={s.sectionLabel}>Nos solutions</Text>
        <Text style={s.h2}>5 technologies IA pour transformer votre entreprise</Text>
        <Text style={s.body}>
          Chaque solution est déployée en moins de 72h et adaptée à votre secteur d'activité.
          Aucune compétence technique requise de votre part.
        </Text>
      </View>

      <View style={[{ paddingHorizontal: 48 }]}>
        {[
          {
            icon: "🤖",
            title: "Chatbot IA",
            desc: "Répondez à vos clients 24h/24, 7j/7 via WhatsApp Business, votre site web ou Instagram. Qualifiez les prospects et automatisez la prise de rendez-vous sans intervention humaine.",
            tag: "ROI visible dès J+7",
          },
          {
            icon: "⚙️",
            title: "Automatisation des processus",
            desc: "Éliminez les tâches répétitives : relances clients, facturation, reporting, synchronisation d'outils. Tout se déclenche automatiquement avec n8n, Make ou Zapier.",
            tag: "3h économisées / semaine",
          },
          {
            icon: "🧠",
            title: "Agent IA",
            desc: "Un collaborateur numérique qui analyse, décide et exécute des tâches complexes : recherche d'informations, rédaction de contenu, traitement de données, coordination entre vos outils.",
            tag: "Autonome 24h/24",
          },
          {
            icon: "📊",
            title: "CRM Intelligent",
            desc: "Gérez vos clients avec l'IA : scoring des leads, suivi automatique, rappels intelligents et analyses prédictives. Ne ratez plus jamais une opportunité de vente.",
            tag: "+35% de conversions",
          },
          {
            icon: "📈",
            title: "Analyse de données",
            desc: "Tableaux de bord interactifs, rapports automatiques et prédictions IA pour piloter votre activité avec précision et anticiper les tendances de votre marché.",
            tag: "Décisions basées sur les données",
          },
        ].map((service) => (
          <View key={service.title} style={s.serviceRow}>
            <Text style={s.serviceIcon}>{service.icon}</Text>
            <View style={s.serviceContent}>
              <Text style={s.serviceTitle}>{service.title}</Text>
              <Text style={s.serviceDesc}>{service.desc}</Text>
              <View style={s.serviceTag}>
                <Text style={s.serviceTagText}>{service.tag}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      <Footer page="Page 2 / 4" />
    </Page>

    {/* ═══════════════════════════════════════════
        PAGE 3 — PAR SECTEUR + TÉMOIGNAGES
    ═══════════════════════════════════════════ */}
    <Page size="A4" style={s.page}>
      <PageHeader chapter="L'IA par secteur" />

      <View style={s.section}>
        <Text style={s.sectionLabel}>Votre secteur</Text>
        <Text style={s.h2}>L'IA s'adapte à chaque métier</Text>
        <Text style={s.body}>
          Nous accompagnons les entreprises de 8 secteurs différents avec des solutions
          spécifiquement adaptées à leurs défis et leurs clients.
        </Text>
      </View>

      <View style={[s.cardGrid, { paddingHorizontal: 48 }]}>
        {[
          { icon: "🍽️", title: "Restaurants & Hôtels", desc: "Réservations 24h/24, rappels anti no-show, fidélisation clients via WhatsApp" },
          { icon: "🏠", title: "Agences Immobilières", desc: "Qualification automatique des prospects, prise de RDV visite, relances intelligentes" },
          { icon: "🛒", title: "E-commerce & Retail", desc: "Récupération de paniers abandonnés, recommandations produits, suivi de commandes" },
          { icon: "🎓", title: "Éducation & Formation", desc: "Inscriptions automatisées, FAQ instantanée, suivi des apprenants" },
          { icon: "🏥", title: "Santé & Cliniques", desc: "RDV 24h/24, rappels patients, pré-admission automatique, suivi post-consultation" },
          { icon: "👥", title: "Ressources Humaines", desc: "Tri IA des CVs, onboarding automatisé, chatbot RH interne, analytics RH" },
          { icon: "⚖️", title: "Cabinets Juridiques", desc: "Qualification des dossiers, relances automatiques, prise de RDV, assistance documentaire" },
          { icon: "🚚", title: "Logistique & Transport", desc: "Suivi en temps réel, optimisation des tournées, alertes automatiques, reporting" },
        ].map((sector) => (
          <View key={sector.title} style={s.card}>
            <Text style={s.cardIcon}>{sector.icon}</Text>
            <Text style={s.cardTitle}>{sector.title}</Text>
            <Text style={s.cardBody}>{sector.desc}</Text>
          </View>
        ))}
      </View>

      <View style={s.divider} />

      <View style={[s.section, { paddingTop: 20 }]}>
        <Text style={s.sectionLabel}>Témoignages</Text>
        <Text style={s.h2}>Ce que disent nos clients</Text>

        {[
          {
            quote: "Depuis qu'on a déployé le chatbot WhatsApp, on reçoit des réservations à 2h du matin sans que personne ne décroche. Notre taux de no-show a chuté de 40%. C'est du concret.",
            author: "Directeur, Hôtel Boutique — Marrakech",
          },
          {
            quote: "L'automatisation de nos relances commerciales nous a économisé 4h par jour. Mon équipe peut se concentrer sur les vrais dossiers. Le ROI était visible en 2 semaines.",
            author: "Directeur Commercial, Agence Immobilière — Casablanca",
          },
        ].map((q) => (
          <View key={q.author} style={s.quoteBox}>
            <Text style={s.quoteText}>"{q.quote}"</Text>
            <Text style={s.quoteAuthor}>— {q.author}</Text>
          </View>
        ))}
      </View>

      <Footer page="Page 3 / 4" />
    </Page>

    {/* ═══════════════════════════════════════════
        PAGE 4 — PLAN D'ACTION + CTA
    ═══════════════════════════════════════════ */}
    <Page size="A4" style={s.page}>
      <PageHeader chapter="Plan d'action & Démarrage" />

      <View style={s.section}>
        <Text style={s.sectionLabel}>Démarrer</Text>
        <Text style={s.h2}>Comment passer à l'IA en 3 étapes</Text>
        <Text style={s.body}>
          Notre méthode éprouvée vous permet d'avoir votre première solution IA opérationnelle
          en moins de 72h, avec un accompagnement complet de notre équipe.
        </Text>

        {[
          {
            num: "1",
            title: "Audit gratuit de 30 minutes",
            desc: "On analyse votre activité, vos processus répétitifs et vos points de friction. On identifie ensemble la solution IA qui aura le plus d'impact immédiat sur votre chiffre d'affaires.",
          },
          {
            num: "2",
            title: "Déploiement en 72h",
            desc: "Notre équipe configure, personnalise et intègre la solution à vos outils existants. Vous recevez une formation complète et une documentation pour votre équipe.",
          },
          {
            num: "3",
            title: "Suivi & optimisation continue",
            desc: "Tableau de bord en temps réel, rapports mensuels de performance, et optimisations continues basées sur vos données réelles. On reste à vos côtés sur le long terme.",
          },
        ].map((step) => (
          <View key={step.num} style={s.stepRow}>
            <View style={s.stepNum}>
              <Text style={s.stepNumText}>{step.num}</Text>
            </View>
            <View style={s.stepContent}>
              <Text style={s.h3}>{step.title}</Text>
              <Text style={s.body}>{step.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={s.divider} />

      <View style={[s.section, { paddingTop: 20 }]}>
        <Text style={s.sectionLabel}>Secteurs accompagnés</Text>
        <View style={s.tagRow}>
          {["Restaurants", "Hôtels", "Immobilier", "E-commerce", "Éducation", "Santé", "RH", "Juridique", "Logistique", "Retail"].map((tag) => (
            <Text key={tag} style={s.tag}>{tag}</Text>
          ))}
        </View>
      </View>

      {/* CTA Final */}
      <View style={s.ctaBox}>
        <Text style={s.ctaTitle}>Prêt à automatiser votre activité ?</Text>
        <Text style={s.ctaBody}>
          Obtenez votre audit gratuit et découvrez quelle solution IA peut transformer
          votre entreprise dès cette semaine. Sans engagement, en 30 minutes.
        </Text>
        <View style={s.ctaBtn}>
          <Text style={s.ctaBtnText}>Demander mon audit gratuit →  www.easydigia.com</Text>
        </View>
        <Text style={s.ctaContact}>
          Ou contactez-nous directement : contact@easydigia.com  |  +212 781 995 665
        </Text>
      </View>

      <Footer page="Page 4 / 4" />
    </Page>

  </Document>
);

// ─── Main ────────────────────────────────────────────────────────────────────
const outputPath = path.resolve(process.cwd(), "public", "guide-ia-easydigia.pdf");

renderToFile(<GuidePDF />, outputPath)
  .then(() => {
    console.log(`✅ PDF généré : ${outputPath}`);
  })
  .catch((err: Error) => {
    console.error("❌ Erreur :", err);
    process.exit(1);
  });
