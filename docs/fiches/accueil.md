# Accueil

> État réel de la page d'accueil (`app/page.tsx`), tenu à jour à chaque édition
> (cf. `docs/PRINCIPES.md` §9).

---

## Informations générales

| Champ | Valeur |
|---|---|
| **Nom de la page** | Accueil |
| **Route** | `app/page.tsx` |
| **Slug URL** | `/` |
| **Type de page** | `editorial` |
| **Indexation** | `index` |
| **Priorité** | Haute |
| **Statut** | validé |

---

## Objectifs de la page

### Objectif principal
Présenter la boutique B2B, orienter le visiteur vers le catalogue et déclencher l'inscription/connexion pour accéder aux tarifs négociés.

### Objectifs secondaires
- Expliquer en 5 secondes ce que vend la boutique et pour qui
- Rassurer le visiteur professionnel (conditions d'accès, tarifs client, devis)
- Guider l'anonyme vers l'inscription (parcours « comment ça marche »)
- Lever les dernières hésitations via un bloc FAQ visible (livraison, devis, paiement)

---

## Structure de la page

### Zone 1 — Hero
- **Fonction** : Capter l'attention, poser la proposition de valeur
- **Contenu** : accroche (`branding.name`), sous-accroche, recherche intégrée, CTA « Voir le catalogue », signaux de confiance (24–48h, 100% tarifs négociés, devis en 1 clic)
- **Comportement** : above the fold, rendu serveur, recherche qui envoie sur `/catalogue?q=`

### Zone 2 — Onboarding visiteur `[si !user]`
- **Fonction** : expliquer le fonctionnement B2B (3 étapes)
- **Contenu** : « Créez votre compte → vos tarifs s'affichent → commandez ou devisez »

### Zone 3 — Réassurance transversale
- **Fonction** : 3 arguments clés (livraison, paiement, support)
- **Contenu** : 3 cartes avec icônes

### Zone 4 — Sélection produits
- **Fonction** : donner à voir le catalogue
- **Contenu** : `FeaturedCarousel` d'`ArticleCard` (8 max, prix/stock conditionnels)

### Zone 5 — Catégories
- **Fonction** : entrée par famille de produits
- **Contenu** : grille des 6 premières catégories du `catalogTree`
- **Comportement** : liens `/catalogue?catalog=…`

### Zone 6 — CTA final `[si !user]`
- **Fonction** : convertir
- **Contenu** : argumentaire + CTA « Créer un compte » `[si registrationOpen]` + « Connexion »

### Zone 7 — FAQ
- **Fonction** : lever les objections finales (tarifs, livraison, devis, éligibilité, paiement)
- **Contenu** : accordéon de 5 questions/réponses (voix hybride, answer-first, 3e personne + marque)
- **Composant** : `components/site/FaqAccordion` (accordéon shadcn)
- **JSON-LD** : `FAQPage` via `<JsonLd data={faqLd(...)} />`
- **Maillage** : liens internes vers `/inscription`, `/catalogue`

---

## Composants fonctionnels

| Composant | Source | Description | Obligatoire |
|---|---|---|---|
| Hero | inline `app/page.tsx` | Accroche + recherche + signaux | Oui |
| Onboarding 3 étapes | inline `app/page.tsx` | Parcours B2B | Oui (`!user`) |
| Réassurance | inline `app/page.tsx` (tableau `valueProps`) | 3 cartes | Oui |
| FeaturedCarousel | `components/site/FeaturedCarousel` | Carrousel 8 produits | Non (si vide : masqué) |
| ArticleCard | `components/site/ArticleCard` | Carte produit | Non |
| CategoryMenu | inline (grille catégories) | Catégories du catalogue | Oui |
| FaqAccordion | `components/site/FaqAccordion` | Accordéon Q/R | Oui |
| JsonLd | `components/site/JsonLd` | Données structurées `FAQPage` | Oui (zone 7) |

---

## Données kit consommées

| Donnée | Hook / action kit | Notes |
|---|---|---|
| Contexte shop (branding, catalogTree, capabilities) | `getContextAction()` | pilote hero + onboarding + CTA |
| Utilisateur courant | `meAction()` | `user === null` → onboarding + CTA anonyme |
| Produits mis en avant | `getArticlesAction({ limit: 8 })` | `price` peut être `null` |
| Nom boutique | `context.branding.name ?? context.shopName ?? 'Boutique'` | injecté dans la FAQ (voix hybride) |

---

## Réglages shop & droits conditionnant l'affichage

| Élément d'UI | Condition | Source |
|---|---|---|
| Onboarding « comment ça marche » | `!user` | `meAction()` |
| Bloc CTA « Un compte professionnel ? » | `!user` | `meAction()` |
| CTA « Créer un compte » (footer section) | `capabilities.registrationOpen` | `context.capabilities` |
| Prix sur les cartes | `price != null` sinon « Connectez-vous » | article |

---

## Contenu éditorial

### Titre principal (H1)
« Bonjour {firstName}, vos tarifs vous attendent. » (connecté) ou
« Votre catalogue professionnel, au juste prix. » (anonyme)

### Sous-titres (H2)
1. Comment ça marche
2. Notre sélection
3. Explorez les catégories
4. Un compte professionnel ? `[si !user]`
5. Questions fréquentes

### Ton et style
Voix hybride : hero/CTA en 1re personne (« nous »), FAQ en 3e personne + nom de marque (`branding.name`).
Answer-first, données chiffrées (24–48h, 100%, devis 1 clic).

### Volume de contenu
Cible ~1000 mots. Le contenu actuel reste sous le seuil (la FAQ pousse vers
~700 mots visibles). Enrichissement éventuel à proposer plus tard si besoin
SEO (témoignages, cas d'usage chiffrés, secteurs servis).

---

## Bloc FAQ (contenu effectif)

| # | Question | Réponse (résumé) | Lien interne |
|---|---|---|---|
| 1 | Comment accéder aux tarifs négociés sur {marque} ? | Connexion requise ; inscription gratuite validée par un commercial. | [créer un compte](/inscription) |
| 2 | Quels sont les délais de livraison de {marque} ? | Expédition 24–48h ouvrées ; délai confirmé au panier. | — |
| 3 | Comment demander un devis sur {marque} ? | Panier → « Demander un devis » ; réponse sous 24h ouvrées. | [catalogue](/catalogue) |
| 4 | Qui peut commander sur la boutique ? | Professionnels uniquement (entreprises, artisans, revendeurs, collectivités, centrales). | — |
| 5 | Le paiement est-il sécurisé ? | Transactions chiffrées, prestataire certifié, moyens selon droits du compte. | — |

---

## SEO

| Champ | Valeur |
|---|---|
| **Indexation** | `index` |
| **Meta title** | `{ absolute: "{branding.name} — {slogan B2B}" }` (layout) |
| **Canonical** | `/` |
| **JSON-LD** | `WebSite`, `Organization` (layout) + `FAQPage` (zone 7) |

> Pas de `generateMetadata` local dans `app/page.tsx` : la home hérite du
> `metadata.title.absolute` du layout (seule home autorisée à contenir le nom
> de marque dans le title).

---

## Notes et remarques

- Rendu serveur obligatoire (`dynamic = 'force-dynamic'`) — contenu visible aux crawlers.
- L'onboarding anonyme réutilise le pattern « 3 étapes », pas de composant dédié ajouté (zone suffisamment petite et contextualisée).
- Le bloc FAQ est rendu serveur pour le JSON-LD, mais l'accordéon interactif est délégué à `FaqAccordion` (`'use client'`).
- Toute la FAQ est ancrée sur des **faits déjà affichés ailleurs** sur la page (24–48h, devis 1 clic, validation commerciale) — pas d'invention.
