import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToFile,
} from "@react-pdf/renderer";
import path from "path";

// ─── Palette ────────────────────────────────────────────────────────────────
const C = {
  dark:    "#0A0B10",
  dark2:   "#12141C",
  dark3:   "#1A1D2E",
  brand:   "#8FD400",
  ink:     "#F5F6FA",
  muted:   "#9BA1B0",
  border:  "#1E2130",
};

// ─── Styles ─────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    backgroundColor: C.dark,
    color: C.ink,
    fontFamily: "Helvetica",
    paddingBottom: 58,
  },

  // ── Cover ─────────────────────────────────────────────────────────────────
  coverHeader: {
    backgroundColor: C.dark2,
    paddingHorizontal: 48,
    paddingTop: 44,
    paddingBottom: 36,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  badgeRow: { flexDirection: "row", marginBottom: 18 },
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
    fontSize: 30,
    fontFamily: "Helvetica-Bold",
    color: C.ink,
    lineHeight: 1.2,
    marginBottom: 14,
  },
  coverSubtitle: {
    fontSize: 12,
    color: C.muted,
    lineHeight: 1.65,
    maxWidth: 430,
    marginBottom: 24,
  },
  coverMeta: { flexDirection: "row", gap: 20 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  metaDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: C.brand,
    marginTop: 1,
  },
  metaText: { fontSize: 10, color: C.muted },

  // ── Sections ───────────────────────────────────────────────────────────────
  section: { paddingHorizontal: 48, paddingTop: 28 },
  sectionLabel: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: C.brand,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  h2: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: C.ink,
    marginBottom: 10,
    lineHeight: 1.25,
  },
  h3: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: C.ink,
    marginBottom: 4,
  },
  body: {
    fontSize: 10,
    color: C.muted,
    lineHeight: 1.65,
    marginBottom: 8,
  },

  // ── Stats (cover) ──────────────────────────────────────────────────────────
  statsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
    paddingHorizontal: 48,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#0F1500",
    borderWidth: 1,
    borderColor: "#2A3D00",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  statValue: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: C.brand,
    marginBottom: 4,
  },
  statLabel: { fontSize: 8.5, color: C.muted, textAlign: "center", lineHeight: 1.4 },

  // ── Divider ────────────────────────────────────────────────────────────────
  divider: {
    marginHorizontal: 48,
    marginTop: 22,
    height: 1,
    backgroundColor: C.border,
  },

  // ── Service rows (P2) ─────────────────────────────────────────────────────
  serviceRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    marginBottom: 9,
    backgroundColor: C.dark2,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 8,
    overflow: "hidden",
  },
  // Colored left accent strip
  serviceAccent: {
    width: 4,
    backgroundColor: C.brand,
    alignSelf: "stretch",
  },
  // Numbered badge
  serviceBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#1A2800",
    borderWidth: 1,
    borderColor: C.brand,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    flexShrink: 0,
  },
  serviceBadgeText: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: C.brand,
  },
  serviceContent: { flex: 1, paddingTop: 11, paddingBottom: 11, paddingRight: 14 },
  serviceTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: C.ink,
    marginBottom: 4,
  },
  serviceDesc: { fontSize: 9, color: C.muted, lineHeight: 1.55 },
  serviceTag: {
    marginTop: 6,
    backgroundColor: "#1A2800",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: "flex-start",
  },
  serviceTagText: { fontSize: 7.5, color: C.brand, fontFamily: "Helvetica-Bold" },

  // ── Sector cards (P3) — 4-column ──────────────────────────────────────────
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
    paddingHorizontal: 48,
  },
  card: {
    width: "22.5%",
    backgroundColor: C.dark2,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 8,
    overflow: "hidden",
  },
  cardAccent: {
    height: 3,
    backgroundColor: C.brand,
  },
  cardInner: { padding: 10 },
  cardTitle: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    color: C.ink,
    marginBottom: 4,
  },
  cardBody: { fontSize: 8, color: C.muted, lineHeight: 1.5 },

  // ── Quotes ─────────────────────────────────────────────────────────────────
  quoteBox: {
    backgroundColor: C.dark2,
    borderLeftWidth: 3,
    borderLeftColor: C.brand,
    borderRadius: 6,
    padding: 13,
    marginBottom: 10,
  },
  quoteText: {
    fontSize: 9.5,
    color: C.ink,
    fontFamily: "Helvetica-Oblique",
    lineHeight: 1.6,
    marginBottom: 6,
  },
  quoteAuthor: { fontSize: 8.5, color: C.brand, fontFamily: "Helvetica-Bold" },

  // ── Steps (P4) ─────────────────────────────────────────────────────────────
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    marginBottom: 12,
  },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#1A2800",
    borderWidth: 1,
    borderColor: C.brand,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  stepNumText: { fontSize: 12, fontFamily: "Helvetica-Bold", color: C.brand },
  stepContent: { flex: 1, paddingTop: 3 },

  // ── Tags ───────────────────────────────────────────────────────────────────
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 10 },
  tag: {
    backgroundColor: C.dark3,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 3,
    fontSize: 8.5,
    color: C.muted,
  },

  // ── CTA ────────────────────────────────────────────────────────────────────
  ctaBox: {
    marginHorizontal: 48,
    marginTop: 22,
    backgroundColor: "#0F1500",
    borderWidth: 1,
    borderColor: C.brand,
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
  },
  ctaTitle: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: C.ink,
    textAlign: "center",
    marginBottom: 8,
  },
  ctaBody: {
    fontSize: 10,
    color: C.muted,
    textAlign: "center",
    lineHeight: 1.6,
    marginBottom: 16,
    maxWidth: 370,
  },
  ctaBtn: {
    backgroundColor: C.brand,
    borderRadius: 7,
    paddingHorizontal: 22,
    paddingVertical: 9,
    marginBottom: 10,
  },
  ctaBtnText: { fontSize: 11, fontFamily: "Helvetica-Bold", color: C.dark },
  ctaContact: { fontSize: 8.5, color: C.muted, textAlign: "center" },

  // ── Page header (P2+) ─────────────────────────────────────────────────────
  pageHeader: {
    backgroundColor: C.dark2,
    paddingHorizontal: 48,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pageHeaderBrand: { fontSize: 10, fontFamily: "Helvetica-Bold", color: C.brand },
  pageHeaderChapter: { fontSize: 8.5, color: C.muted },

  // ── Footer — ancre absolue en bas ─────────────────────────────────────────
  footer: {
    position: "absolute",
    bottom: 18,
    left: 48,
    right: 48,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: C.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerBrand: { fontSize: 9, fontFamily: "Helvetica-Bold", color: C.brand },
  footerUrl:   { fontSize: 8.5, color: C.muted },
  footerPage:  { fontSize: 8.5, color: C.muted },
});

// ─── Composants partagés ─────────────────────────────────────────────────────
const PageHeader = ({ chapter }: { chapter: string }) => (
  <View style={s.pageHeader}>
    <Text style={s.pageHeaderBrand}>EasyDigia</Text>
    <Text style={s.pageHeaderChapter}>{chapter}</Text>
  </View>
);

const Footer = () => (
  <View style={s.footer} fixed>
    <Text style={s.footerBrand}>EasyDigia</Text>
    <Text style={s.footerUrl}>www.easydigia.com</Text>
    <Text
      style={s.footerPage}
      render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`}
    />
  </View>
);

// ─── Donnees ─────────────────────────────────────────────────────────────────
const SERVICES = [
  {
    num: "1",
    title: "Chatbot disponible 24h/24",
    desc: "Vos clients posent une question a 23h ? Ils obtiennent une reponse immediate. Le chatbot qualifie les demandes, propose des rendez-vous et filtre les sollicitations avant meme que votre equipe arrive le matin.",
    tag: "Premiers resultats en 7 jours",
  },
  {
    num: "2",
    title: "Automatisation des taches repetitives",
    desc: "Relances clients, confirmations de RDV, facturation, rapports hebdomadaires... Toutes ces taches qui prennent du temps sans creer de valeur peuvent se declencher automatiquement.",
    tag: "3 a 5 heures recuperees chaque semaine",
  },
  {
    num: "3",
    title: "Agent IA comme collaborateur",
    desc: "Plutot qu'un simple outil, un agent IA agit comme un membre de l'equipe : il cherche, redige, traite et coordonne. Vous definissez la mission, il s'en occupe.",
    tag: "Actif en continu, meme les week-ends",
  },
  {
    num: "4",
    title: "CRM avec suivi intelligent",
    desc: "Fini les prospects qui passent a travers les mailles. Le CRM identifie les opportunites chaudes, envoie les bons messages au bon moment et vous alerte avant qu'un client parte chez un concurrent.",
    tag: "+35 % de conversions en moyenne",
  },
  {
    num: "5",
    title: "Tableau de bord et analyses",
    desc: "Vos donnees parlent — encore faut-il les ecouter. Des tableaux de bord clairs vous donnent une vision nette de ce qui marche, ce qui stagne, et ce qu'il faut ajuster.",
    tag: "Decisions fondees sur les faits",
  },
];

const SECTORS = [
  { title: "Restaurants & Hotels",    desc: "Reservations automatiques, rappels anti no-show, fidelisation via messagerie" },
  { title: "Agences immobilieres",    desc: "Qualification des prospects, prises de RDV visites, relances sur mesure" },
  { title: "E-commerce & Boutiques",  desc: "Paniers abandonnes, recommandations produits, suivi de commandes" },
  { title: "Centres de formation",    desc: "Inscriptions automatisees, questions frequentes, suivi des apprenants" },
  { title: "Sante & Cliniques",       desc: "RDV a toute heure, rappels patients, suivi post-consultation" },
  { title: "Ressources humaines",     desc: "Tri des candidatures, onboarding, chatbot interne, rapports RH" },
  { title: "Cabinets juridiques",     desc: "Qualification des dossiers, relances, prise de contact automatisee" },
  { title: "Logistique & Transport",  desc: "Suivi en temps reel, alertes livraison, reporting automatique" },
];

// ─── Document PDF ─────────────────────────────────────────────────────────────
const GuidePDF = () => (
  <Document
    title="Guide Pratique — Automatisation pour Entreprises — EasyDigia"
    author="EasyDigia"
    subject="Comment gagner du temps et des clients grace a l'automatisation"
    keywords="automatisation, chatbot, PME, Maroc, productivite"
  >

    {/* ════════════════════════════════════════════════════════════════════════
        PAGE 1 — COUVERTURE
    ════════════════════════════════════════════════════════════════════════ */}
    <Page size="A4" style={s.page}>
      <View style={s.coverHeader}>
        <View style={s.badgeRow}>
          <Text style={s.badge}>GUIDE PRATIQUE 2025</Text>
        </View>

        <Text style={s.h1}>
          {"Gagnez du temps, gagnez des clients —\nsans recruter, sans tout changer.\n"}
          <Text style={{ color: C.brand }}>{"Voici comment."}</Text>
        </Text>

        <Text style={s.coverSubtitle}>
          Ce guide s'adresse aux dirigeants de PME qui n'ont pas le temps de tester
          toutes les solutions du marche. Nous avons fait le tri pour vous : cinq
          approches concretes, des exemples reels, et un plan d'action pour demarrer
          cette semaine sans perturber votre organisation.
        </Text>

        <View style={s.coverMeta}>
          {["5 approches detaillees", "8 secteurs couverts", "Cas clients reels"].map((item) => (
            <View key={item} style={s.metaItem}>
              <View style={s.metaDot} />
              <Text style={s.metaText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={s.section}>
        <Text style={s.sectionLabel}>Pourquoi maintenant</Text>
        <Text style={s.h2}>
          Vos concurrents automatisent deja. La question n'est plus si, mais quoi.
        </Text>
        <Text style={s.body}>
          L'automatisation n'est plus reservee aux grandes entreprises. Aujourd'hui, une
          agence immobiliere de cinq personnes peut qualifier ses prospects automatiquement.
          Un restaurant peut confirmer des reservations a 2h du matin sans qu'un employe
          ne soit reveille. Un cabinet peut relancer ses clients sans y penser.
          Ce guide vous montre comment — simplement, concretement, sans jargon.
        </Text>
      </View>

      <View style={s.statsRow}>
        {[
          { value: "73 %",  label: "des clients attendent une reponse dans l'heure, quelle que soit l'heure" },
          { value: "4 h",   label: "par semaine recuperees en moyenne des la premiere solution mise en place" },
          { value: "x 3",   label: "plus de prospects convertis avec un suivi automatise vs un suivi manuel" },
          { value: "30 j",  label: "pour voir les premiers resultats mesurables — garanti ou on ajuste" },
        ].map((stat) => (
          <View key={stat.value} style={s.statCard}>
            <Text style={s.statValue}>{stat.value}</Text>
            <Text style={s.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View style={s.divider} />

      <View style={[s.section, { paddingTop: 16 }]}>
        <Text style={s.body}>
          Dans les pages qui suivent, vous trouverez cinq solutions que nous deployons
          regulierement pour des entreprises marocaines — avec pour chacune les benefices
          concrets, le temps necessaire pour les mettre en place, et ce que vous pouvez
          attendre dans le premier mois.
        </Text>
      </View>

      <Footer />
    </Page>

    {/* ════════════════════════════════════════════════════════════════════════
        PAGE 2 — LES 5 SOLUTIONS
    ════════════════════════════════════════════════════════════════════════ */}
    <Page size="A4" style={s.page}>
      <PageHeader chapter="Ce que nous mettons en place pour vous" />

      <View style={s.section}>
        <Text style={s.sectionLabel}>Cinq solutions, un seul objectif</Text>
        <Text style={s.h2}>Moins de taches repetitives, plus de temps pour ce qui compte</Text>
        <Text style={s.body}>
          Chaque solution est configuree en fonction de votre activite. Pas de modele
          generique — on part de vos vrais problemes et on adapte.
        </Text>
      </View>

      <View style={{ paddingHorizontal: 48, paddingTop: 8 }}>
        {SERVICES.map((svc) => (
          <View key={svc.num} style={s.serviceRow}>
            <View style={s.serviceAccent} />
            <View style={s.serviceBadge}>
              <Text style={s.serviceBadgeText}>{svc.num}</Text>
            </View>
            <View style={s.serviceContent}>
              <Text style={s.serviceTitle}>{svc.title}</Text>
              <Text style={s.serviceDesc}>{svc.desc}</Text>
              <View style={s.serviceTag}>
                <Text style={s.serviceTagText}>{svc.tag}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      <Footer />
    </Page>

    {/* ════════════════════════════════════════════════════════════════════════
        PAGE 3 — PAR SECTEUR + TEMOIGNAGES
    ════════════════════════════════════════════════════════════════════════ */}
    <Page size="A4" style={s.page}>
      <PageHeader chapter="Votre secteur, vos specificites" />

      <View style={s.section}>
        <Text style={s.sectionLabel}>Adapte a votre metier</Text>
        <Text style={s.h2}>Chaque secteur a ses propres problemes. Nous les connaissons.</Text>
        <Text style={s.body}>
          Nous avons accompagne des entreprises dans huit domaines differents.
          Voici les problemes que chacun rencontre — et ce que nous mettons en place.
        </Text>
      </View>

      <View style={s.cardGrid}>
        {SECTORS.map((sector) => (
          <View key={sector.title} style={s.card}>
            <View style={s.cardAccent} />
            <View style={s.cardInner}>
              <Text style={s.cardTitle}>{sector.title}</Text>
              <Text style={s.cardBody}>{sector.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={s.divider} />

      <View style={[s.section, { paddingTop: 16 }]}>
        <Text style={s.sectionLabel}>Ce qu'ils en disent</Text>
        <Text style={s.h2}>Des resultats concrets, racontes par ceux qui les vivent</Text>

        {[
          {
            quote: "On recevait des reservations a 2h du matin — sans que personne ne soit reveille. Notre taux de no-show a baisse de 40 % en six semaines. Ce n'est pas de la magie, c'est juste un systeme qui tourne pendant qu'on dort.",
            author: "Directeur, hotel boutique — Marrakech",
          },
          {
            quote: "J'avais l'impression de passer mes journees a relancer des clients. Depuis qu'on a mis en place le suivi automatique, mon equipe fait ce pourquoi elle a ete recrutee. On a signe deux gros dossiers qu'on aurait rates avant.",
            author: "Directeur commercial, agence immobiliere — Casablanca",
          },
        ].map((q) => (
          <View key={q.author} style={s.quoteBox}>
            <Text style={s.quoteText}>"{q.quote}"</Text>
            <Text style={s.quoteAuthor}>-- {q.author}</Text>
          </View>
        ))}
      </View>

      <Footer />
    </Page>

    {/* ════════════════════════════════════════════════════════════════════════
        PAGE 4 — COMMENT ON TRAVAILLE + CTA
    ════════════════════════════════════════════════════════════════════════ */}
    <Page size="A4" style={s.page}>
      <PageHeader chapter="Comment on demarre ensemble" />

      <View style={s.section}>
        <Text style={s.sectionLabel}>Notre methode en trois etapes</Text>
        <Text style={s.h2}>Une mise en place rapide, sans perturber votre equipe</Text>
        <Text style={s.body}>
          On ne vous demande pas de tout changer du jour au lendemain. On commence
          par un point precis qui vous fait perdre du temps, on le regle, et on avance.
        </Text>

        {[
          {
            num: "1",
            title: "Un audit de 30 minutes — gratuit, sans engagement",
            desc: "On echange sur votre activite, vos processus et vos frustrations du quotidien. Pas de presentation commerciale : on identifie ensemble le premier levier qui aura le plus d'impact pour vous specifiquement.",
          },
          {
            num: "2",
            title: "Mise en place en moins de 72 heures",
            desc: "Notre equipe configure la solution, la connecte a vos outils existants et forme vos collaborateurs. Vous n'avez pas besoin de competences techniques — on s'occupe de tout.",
          },
          {
            num: "3",
            title: "Suivi et ajustements dans la duree",
            desc: "Un tableau de bord vous permet de voir ce qui se passe en temps reel. On fait un point mensuel pour ajuster, optimiser et anticiper les prochaines etapes selon vos priorites.",
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

      <View style={[s.section, { paddingTop: 14 }]}>
        <Text style={s.sectionLabel}>Secteurs accompagnes</Text>
        <View style={s.tagRow}>
          {["Restaurants", "Hotels", "Immobilier", "E-commerce", "Formation", "Sante", "RH", "Juridique", "Logistique", "Retail"].map((tag) => (
            <Text key={tag} style={s.tag}>{tag}</Text>
          ))}
        </View>
      </View>

      <View style={s.ctaBox}>
        <Text style={s.ctaTitle}>Prenons 30 minutes pour regarder votre cas</Text>
        <Text style={s.ctaBody}>
          Pas de discours generique. On regarde votre activite, on identifie une piste
          concrete, et vous repartez avec quelque chose d'actionnable — que vous travailliez
          avec nous ou non.
        </Text>
        <View style={s.ctaBtn}>
          <Text style={s.ctaBtnText}>Reserver mon audit gratuit — www.easydigia.com</Text>
        </View>
        <Text style={s.ctaContact}>
          contact@easydigia.com  |  +212 781 995 665
        </Text>
      </View>

      <Footer />
    </Page>

  </Document>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
const outputPath = path.resolve(process.cwd(), "public", "guide-ia-easydigia.pdf");

renderToFile(<GuidePDF />, outputPath)
  .then(() => {
    console.log(`PDF genere : ${outputPath}`);
  })
  .catch((err: Error) => {
    console.error("Erreur :", err);
    process.exit(1);
  });
