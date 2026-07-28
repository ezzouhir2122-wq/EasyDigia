export type PseoService = {
  slug: string;
  label: string;
  icon: string;
  tagline: string;
  description: string;
  steps: { title: string; desc: string }[];
};

export type PseoSector = {
  slug: string;
  label: string;
  labelFull: string;
  icon: string;
  benefits: { icon: string; title: string; desc: string }[];
  stats: { value: string; label: string }[];
  faq: { q: string; a: string }[];
};

export const PSEO_SERVICES: PseoService[] = [
  {
    slug: "chatbot-ia",
    label: "Chatbot IA",
    icon: "🤖",
    tagline: "Votre assistant virtuel 24h/24, 7j/7",
    description:
      "Un chatbot IA répond instantanément aux questions de vos clients, qualifie les prospects et automatise la prise de rendez-vous — sans intervention humaine.",
    steps: [
      { title: "Analyse & configuration", desc: "On analyse vos besoins et on entraîne le modèle sur vos données, FAQ et produits." },
      { title: "Intégration multicanal", desc: "Déploiement sur WhatsApp Business, votre site web ou Instagram en moins de 72h." },
      { title: "Suivi & optimisation", desc: "Tableau de bord des conversations, taux de résolution et améliorations continues." },
    ],
  },
  {
    slug: "automatisation",
    label: "Automatisation des processus",
    icon: "⚙️",
    tagline: "Éliminez les tâches répétitives, concentrez-vous sur l'essentiel",
    description:
      "Automatisez vos flux de travail : relances clients, facturation, reporting, synchronisation d'outils — tout se déclenche automatiquement.",
    steps: [
      { title: "Cartographie des processus", desc: "On identifie les tâches répétitives et les points de friction dans votre activité." },
      { title: "Développement des workflows", desc: "Création des automatisations avec n8n, Make ou Zapier selon votre stack." },
      { title: "Tests & déploiement", desc: "Validation en conditions réelles, déploiement et documentation pour votre équipe." },
    ],
  },
  {
    slug: "agent-ia",
    label: "Agent IA",
    icon: "🧠",
    tagline: "Un collaborateur numérique qui agit de façon autonome",
    description:
      "Un agent IA analyse, décide et exécute des tâches complexes : recherche, rédaction, traitement de données, coordination entre vos outils.",
    steps: [
      { title: "Définition des objectifs", desc: "On définit les missions de l'agent, ses outils disponibles et ses limites d'action." },
      { title: "Configuration & tests", desc: "L'agent est configuré, testé en conditions réelles et calibré pour votre secteur." },
      { title: "Déploiement supervisé", desc: "Mise en production avec tableau de bord de supervision et alertes en temps réel." },
    ],
  },
  {
    slug: "crm-intelligent",
    label: "CRM Intelligent",
    icon: "📊",
    tagline: "Gérez vos clients avec l'intelligence artificielle",
    description:
      "Un CRM sur mesure enrichi par l'IA : scoring des leads, suivi automatique, rappels intelligents et analyses prédictives pour ne rater aucune opportunité.",
    steps: [
      { title: "Import & structuration", desc: "Migration de votre base clients existante et structuration des données." },
      { title: "Configuration IA", desc: "Mise en place du scoring, des automatisations et des tableaux de bord en temps réel." },
      { title: "Formation & lancement", desc: "Formation de votre équipe et go-live avec support dédié les 30 premiers jours." },
    ],
  },
  {
    slug: "analyse-donnees",
    label: "Analyse de données",
    icon: "📈",
    tagline: "Transformez vos données en décisions rentables",
    description:
      "Tableaux de bord interactifs, rapports automatiques et prédictions IA pour piloter votre activité avec précision et anticiper les tendances du marché.",
    steps: [
      { title: "Connexion aux sources", desc: "On connecte vos outils existants : ERP, CRM, Google Sheets, base de données." },
      { title: "Construction des dashboards", desc: "Développement des indicateurs clés et visualisations adaptées à votre métier." },
      { title: "Alertes & rapports auto", desc: "Rapports périodiques par email et alertes en cas d'anomalie ou de seuil atteint." },
    ],
  },
];

export const PSEO_SECTORS: PseoSector[] = [
  {
    slug: "restaurants",
    label: "restaurants",
    labelFull: "Restaurants & Hôtels",
    icon: "🍽️",
    benefits: [
      { icon: "🕐", title: "Réservations 24h/24", desc: "Acceptez des réservations via WhatsApp ou votre site sans décrocher le téléphone, même la nuit." },
      { icon: "💬", title: "Réponses instantanées", desc: "Menu, allergènes, disponibilités — réponses en moins de 3 secondes à chaque question client." },
      { icon: "⭐", title: "Fidélisation clients", desc: "Offres personnalisées envoyées automatiquement à vos clients réguliers selon leurs préférences." },
      { icon: "📉", title: "Moins de no-shows", desc: "Rappels automatiques 24h avant la réservation avec confirmation en un clic par WhatsApp." },
    ],
    stats: [
      { value: "73%", label: "des clients veulent réserver en ligne hors heures d'ouverture" },
      { value: "3×", label: "plus de conversions avec un chatbot vs formulaire classique" },
    ],
    faq: [
      { q: "Le chatbot peut-il prendre des réservations sur WhatsApp ?", a: "Oui, il s'intègre directement à WhatsApp Business et gère les réservations de A à Z, avec confirmation automatique." },
      { q: "Comment gérer le menu et les disponibilités en temps réel ?", a: "Le système se connecte à votre planning et met à jour les disponibilités automatiquement selon vos horaires." },
      { q: "Est-ce que la solution fonctionne en arabe et en français ?", a: "Oui, notre solution est nativement multilingue : arabe, français et anglais — idéal pour le marché marocain." },
    ],
  },
  {
    slug: "immobilier",
    label: "agences immobilières",
    labelFull: "Agences Immobilières",
    icon: "🏠",
    benefits: [
      { icon: "🎯", title: "Qualification automatique", desc: "Filtrez les prospects sérieux : budget, délai, type de bien — avant qu'un agent intervienne." },
      { icon: "📅", title: "Prise de rendez-vous", desc: "Les prospects réservent leurs visites directement selon vos disponibilités, sans appel." },
      { icon: "🔔", title: "Relances intelligentes", desc: "Relancez automatiquement les prospects inactifs avec des biens correspondant à leurs critères." },
      { icon: "📊", title: "Suivi des mandats", desc: "Dashboard centralisé pour chaque mandat, visite et offre — aucune opportunité ne passe à travers." },
    ],
    stats: [
      { value: "68%", label: "des acheteurs contactent plusieurs agences simultanément" },
      { value: "5 min", label: "délai max pour convertir un lead immobilier (après, il va ailleurs)" },
    ],
    faq: [
      { q: "Le chatbot peut-il envoyer des annonces automatiquement ?", a: "Oui, il envoie les biens correspondant aux critères du prospect dès leur mise en ligne sur votre site." },
      { q: "Comment qualifier un lead immobilier ?", a: "Le chatbot pose une séquence de questions (budget, ville, type de bien, délai) et score chaque lead automatiquement." },
      { q: "Peut-on connecter le système à notre CRM existant ?", a: "Oui, on s'intègre avec les principaux CRM immobiliers et plateformes de gestion de mandats." },
    ],
  },
  {
    slug: "ecommerce",
    label: "boutiques en ligne",
    labelFull: "E-commerce & Retail",
    icon: "🛒",
    benefits: [
      { icon: "🛒", title: "Récupération de paniers", desc: "Relancez automatiquement les clients qui abandonnent leur panier avec une offre personnalisée." },
      { icon: "🎁", title: "Recommandations produits", desc: "L'IA suggère des produits complémentaires basés sur l'historique d'achat de chaque client." },
      { icon: "📦", title: "Suivi de commandes", desc: "Les clients suivent leurs livraisons via chatbot sans surcharger votre service après-vente." },
      { icon: "⭐", title: "Collecte d'avis", desc: "Avis produits collectés automatiquement après chaque livraison confirmée — sans rien faire." },
    ],
    stats: [
      { value: "69%", label: "taux moyen d'abandon de panier en e-commerce" },
      { value: "+35%", label: "de CA grâce aux recommandations personnalisées par l'IA (McKinsey)" },
    ],
    faq: [
      { q: "Peut-on connecter la solution à Shopify ou WooCommerce ?", a: "Oui, on s'intègre nativement avec Shopify, WooCommerce et PrestaShop en quelques clics." },
      { q: "Comment automatiser les relances de paniers abandonnés ?", a: "Un workflow se déclenche automatiquement X minutes après l'abandon, via WhatsApp ou email." },
      { q: "Le chatbot peut-il gérer les retours et remboursements ?", a: "Il collecte les informations et initie le processus, puis escalade vers un humain si nécessaire." },
    ],
  },
  {
    slug: "education",
    label: "établissements d'enseignement",
    labelFull: "Éducation & Formation",
    icon: "🎓",
    benefits: [
      { icon: "📝", title: "Inscriptions automatisées", desc: "Guidez les candidats dans leur dossier d'inscription étape par étape, disponible 24h/24." },
      { icon: "❓", title: "FAQ instantanée", desc: "Programmes, frais, conditions d'admission — réponses automatiques aux questions répétitives." },
      { icon: "📊", title: "Suivi des apprenants", desc: "Dashboard de suivi des présences, résultats et progression pour chaque apprenant." },
      { icon: "🔔", title: "Rappels & notifications", desc: "Alertes automatiques pour cours, examens, paiements et échéances importantes." },
    ],
    stats: [
      { value: "60%", label: "des questions des candidats sont identiques et répétitives" },
      { value: "40%", label: "de réduction du temps administratif avec l'automatisation" },
    ],
    faq: [
      { q: "Le chatbot peut-il gérer les inscriptions en ligne ?", a: "Oui, il guide le candidat à travers toutes les étapes et collecte les documents nécessaires." },
      { q: "Peut-on intégrer la solution avec notre plateforme LMS ?", a: "Oui, on s'intègre avec Moodle, Canvas et la plupart des LMS du marché." },
      { q: "Est-ce adapté aux formations en entreprise (B2B) ?", a: "Oui, l'agent IA gère les plannings, évaluations, certifications et reporting pour les formations intra." },
    ],
  },
  {
    slug: "sante",
    label: "cliniques et cabinets médicaux",
    labelFull: "Santé & Cliniques",
    icon: "🏥",
    benefits: [
      { icon: "📅", title: "RDV 24h/24", desc: "Les patients réservent, modifient ou annulent leurs rendez-vous sans appeler le secrétariat." },
      { icon: "🔔", title: "Rappels automatiques", desc: "SMS/WhatsApp de rappel 48h et 24h avant le RDV — réduction des no-shows jusqu'à 40%." },
      { icon: "📋", title: "Pré-admission", desc: "Collecte automatique des informations patient, antécédents et couverture avant la consultation." },
      { icon: "💊", title: "Suivi post-consultation", desc: "Rappels automatiques de prises de médicaments et de rendez-vous de contrôle." },
    ],
    stats: [
      { value: "23%", label: "des rendez-vous médicaux sont manqués sans rappel automatique" },
      { value: "4h", label: "économisées par semaine en tâches administratives grâce à l'automatisation" },
    ],
    faq: [
      { q: "La solution est-elle conforme aux réglementations de santé au Maroc ?", a: "Oui, nos solutions respectent la confidentialité des données patients et les réglementations locales en vigueur." },
      { q: "Le système peut-il gérer plusieurs praticiens ?", a: "Oui, l'agenda est multi-praticiens avec spécialités, disponibilités et règles individuelles." },
      { q: "Peut-on l'intégrer à un logiciel médical existant ?", a: "Oui, on s'intègre avec la plupart des logiciels de gestion de cabinet médicaux du marché." },
    ],
  },
  {
    slug: "rh",
    label: "équipes RH",
    labelFull: "Ressources Humaines",
    icon: "👥",
    benefits: [
      { icon: "📄", title: "Tri des candidatures", desc: "L'IA analyse et score les CVs selon vos critères et shortliste les meilleurs profils automatiquement." },
      { icon: "🎯", title: "Onboarding automatisé", desc: "Parcours d'intégration structuré : documents, formations, accès — tout se déclenche automatiquement." },
      { icon: "❓", title: "Chatbot RH interne", desc: "Congés, paie, avantages — réponses automatiques aux questions récurrentes des employés." },
      { icon: "📊", title: "Analytics RH", desc: "Turnover, satisfaction, performance — un dashboard pour des décisions RH basées sur les données." },
    ],
    stats: [
      { value: "75%", label: "du temps RH est consacré à des tâches répétitives (Deloitte)" },
      { value: "50%", label: "de réduction du temps de recrutement avec le tri IA des CVs" },
    ],
    faq: [
      { q: "Comment l'IA trie-t-elle les CVs ?", a: "Elle compare chaque CV avec votre fiche de poste selon des critères pondérés et génère un score de compatibilité." },
      { q: "Le chatbot RH peut-il gérer les demandes de congé ?", a: "Oui, il reçoit, valide selon vos règles et notifie automatiquement le manager concerné." },
      { q: "Peut-on connecter ça à notre SIRH existant ?", a: "Oui, on s'intègre avec les principaux SIRH du marché : SAP, Odoo, Sage, Bizneo, etc." },
    ],
  },
  {
    slug: "juridique",
    label: "cabinets juridiques et notaires",
    labelFull: "Cabinets Juridiques & Notaires",
    icon: "⚖️",
    benefits: [
      { icon: "📋", title: "Qualification des dossiers", desc: "L'IA collecte les informations essentielles et qualifie chaque dossier avant la première consultation." },
      { icon: "🔔", title: "Relances automatiques", desc: "Rappels pour documents manquants, échéances, signatures — zéro oubli, zéro relance manuelle." },
      { icon: "📅", title: "Prise de RDV en ligne", desc: "Les clients réservent directement leur consultation selon vos disponibilités, 24h/24." },
      { icon: "🔍", title: "Assistance documentaire", desc: "L'agent IA recherche et synthétise les textes de loi et jurisprudences pertinents pour vos dossiers." },
    ],
    stats: [
      { value: "30%", label: "du temps des juristes est consacré à des tâches administratives" },
      { value: "2×", label: "plus de dossiers traités par mois avec l'automatisation des tâches répétitives" },
    ],
    faq: [
      { q: "La confidentialité des dossiers est-elle garantie ?", a: "Oui, toutes les données sont chiffrées et accessibles uniquement aux membres autorisés de votre cabinet." },
      { q: "Le chatbot peut-il donner des conseils juridiques ?", a: "Non, il qualifie et oriente — il ne remplace jamais l'expertise du juriste ou du notaire." },
      { q: "Peut-on automatiser la génération de contrats type ?", a: "Oui, l'agent génère des contrats pré-remplis à partir de vos modèles, validés au préalable par vos juristes." },
    ],
  },
  {
    slug: "logistique",
    label: "entreprises de logistique",
    labelFull: "Logistique & Transport",
    icon: "🚚",
    benefits: [
      { icon: "📍", title: "Suivi en temps réel", desc: "Dashboard centralisé pour suivre toutes les livraisons, véhicules et chauffeurs en un seul endroit." },
      { icon: "🔔", title: "Alertes automatiques", desc: "Notifications clients et équipe en cas de retard, incident ou livraison confirmée — sans action manuelle." },
      { icon: "🗺️", title: "Optimisation des tournées", desc: "L'IA analyse et optimise les itinéraires pour réduire les coûts carburant et les délais de livraison." },
      { icon: "📋", title: "Reporting automatique", desc: "KPIs, taux de livraison, performances par zone — rapports générés automatiquement chaque semaine." },
    ],
    stats: [
      { value: "15%", label: "de réduction des coûts logistiques avec l'optimisation IA des tournées" },
      { value: "30 min", label: "économisées par chauffeur par jour avec les outils d'automatisation" },
    ],
    faq: [
      { q: "Peut-on intégrer la solution avec notre TMS existant ?", a: "Oui, on s'intègre avec les principaux TMS et ERP logistiques du marché marocain et international." },
      { q: "Comment automatiser les notifications de livraison aux clients ?", a: "Un workflow se déclenche à chaque étape clé : expédition, en route, livré, ou retard détecté." },
      { q: "L'IA peut-elle recalculer les tournées en temps réel ?", a: "Oui, elle recalcule les itinéraires selon le trafic en temps réel et les nouvelles commandes entrantes." },
    ],
  },
];

export function getPseoPage(slug: string): { service: PseoService; sector: PseoSector } | null {
  // slug format: {service.slug}-pour-{sector.slug}
  for (const sector of PSEO_SECTORS) {
    for (const service of PSEO_SERVICES) {
      if (slug === `${service.slug}-pour-${sector.slug}`) {
        return { service, sector };
      }
    }
  }
  return null;
}

export function getAllPseoSlugs(): string[] {
  const slugs: string[] = [];
  for (const service of PSEO_SERVICES) {
    for (const sector of PSEO_SECTORS) {
      slugs.push(`${service.slug}-pour-${sector.slug}`);
    }
  }
  return slugs;
}

export type PseoCity = {
  slug: string;
  label: string;
  region: string;
  context: string;
};

export const PSEO_CITIES: PseoCity[] = [
  {
    slug: "casablanca",
    label: "Casablanca",
    region: "Grand Casablanca-Settat",
    context: "capitale économique du Maroc et hub digital en pleine transformation numérique",
  },
  {
    slug: "rabat",
    label: "Rabat",
    region: "Rabat-Salé-Kénitra",
    context: "capitale administrative et ville en forte modernisation de ses services",
  },
  {
    slug: "marrakech",
    label: "Marrakech",
    region: "Marrakech-Safi",
    context: "capitale touristique mondiale avec un tissu économique dynamique en restauration et hôtellerie",
  },
  {
    slug: "tanger",
    label: "Tanger",
    region: "Tanger-Tétouan-Al Hoceïma",
    context: "hub industriel et logistique en forte croissance grâce à sa zone franche",
  },
  {
    slug: "agadir",
    label: "Agadir",
    region: "Souss-Massa",
    context: "pôle touristique balnéaire et capitale de l'agroalimentaire au Maroc",
  },
];

export function getPseoCity(slug: string): PseoCity | null {
  return PSEO_CITIES.find((c) => c.slug === slug) ?? null;
}

export function getAllPseoGeoSlugs(): string[] {
  const slugs: string[] = [];
  for (const service of PSEO_SERVICES) {
    for (const sector of PSEO_SECTORS) {
      for (const city of PSEO_CITIES) {
        slugs.push(`${service.slug}-pour-${sector.slug}-a-${city.slug}`);
      }
    }
  }
  return slugs;
}

export function getPseoGeoPage(
  slug: string
): { service: PseoService; sector: PseoSector; city: PseoCity } | null {
  const dashA = slug.lastIndexOf("-a-");
  if (dashA === -1) return null;
  const nationalSlug = slug.slice(0, dashA);
  const citySlug = slug.slice(dashA + 3);
  const national = getPseoPage(nationalSlug);
  if (!national) return null;
  const city = getPseoCity(citySlug);
  if (!city) return null;
  return { service: national.service, sector: national.sector, city };
}
