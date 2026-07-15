# Design — FAQ · Testimonials · Availability Badge

Date: 2026-07-13

## 1. Page FAQ `/faq`

### But
Page dédiée pour réduire les questions en contact et améliorer le SEO autour des mots-clés : automatisation Maroc, IA, chatbot, délai livraison.

### Structure
- Route : `app/[locale]/faq/page.tsx`
- Traductions : `messages/fr.json`, `en.json`, `ar.json` — clé `faq`
- Accordéon natif (état local React, une question ouverte à la fois)
- Lien CTA vers `/contact` en bas de page

### Catégories & questions (FR)
**Automatisation**
- Qu'est-ce que l'automatisation pour mon business ?
- Quels outils utilisez-vous ? (Make, n8n, Zapier…)
- Est-ce que ça fonctionne avec mes outils existants ?

**Intelligence Artificielle**
- Quelle différence entre un chatbot et un agent IA ?
- Mes données restent-elles confidentielles ?
- L'IA peut-elle répondre en darija ou en arabe ?

**Délais & Process**
- Quel est le délai moyen pour un projet ?
- Comment se déroule une collaboration ?
- Que se passe-t-il après la livraison ?

**Paiement & Tarifs**
- Quels modes de paiement acceptez-vous au Maroc ?
- Y a-t-il un engagement minimum ?
- Proposez-vous des devis gratuits ?

### Style
- Même dark theme `#0A0B10` / `#12141C`
- Accordéon avec chevron animé (rotate 180° à l'ouverture)
- Catégories avec badge mono vert

---

## 2. Témoignages avec avatars

### But
Renforcer la crédibilité des témoignages existants sur la home page.

### Composant `TestimonialCard`
- Avatar : cercle 44px avec initiales (ex: "K.B.")
- Couleur de fond : dérivée du hash du nom (parmi 5 teintes vert/bleu/violet)
- Étoiles 5/5 en haut de chaque carte
- Même données `t.raw("testimonials")` — pas de changement de données

### Fichier modifié
- `app/[locale]/page.tsx` — section Testimonials
- Possible extraction en composant `components/TestimonialCard.tsx`

---

## 3. Badge disponibilité dans le Hero

### But
Créer de l'urgence et pousser au contact via un signal de rareté visible dès le Hero.

### Config
- Fichier : `config/availability.ts`
- Champs : `slots: number`, `label: string`
- Si `slots === 0` → badge masqué automatiquement

### Composant
- Badge dans `components/Hero.tsx`, au-dessus du titre H1
- Point vert animé (`animate-pulse`)
- Texte : "🟢 2 créneaux disponibles ce mois"
- Style : pill dark avec bordure verte légère

---

## Fichiers impactés

| Fichier | Action |
|---|---|
| `app/[locale]/faq/page.tsx` | Créer |
| `messages/fr.json` | Ajouter clé `faq` |
| `messages/en.json` | Ajouter clé `faq` |
| `messages/ar.json` | Ajouter clé `faq` |
| `config/availability.ts` | Créer |
| `components/Hero.tsx` | Modifier — ajouter badge |
| `app/[locale]/page.tsx` | Modifier — avatars témoignages |
| `components/Header.tsx` | Modifier — ajouter lien /faq dans nav |
