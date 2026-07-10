# Notre entreprise

> Page éditoriale indexable — raconte l'entreprise (histoire, métier,
> engagements, chiffres). Route `app/notre-entreprise/page.tsx`.

## Informations générales

| Champ | Valeur |
|---|---|
| **Nom de la page** | Notre entreprise |
| **Route** | `app/notre-entreprise/page.tsx` |
| **Slug URL** | `/notre-entreprise` |
| **Type de page** | `editorial` |
| **Indexation** | `index` |
| **Priorité** | Moyenne |
| **Statut** | à compléter (placeholders `[…]`) |

## Objectifs de la page

### Objectif principal
Présenter l'entreprise (histoire, métier, engagements) pour construire la
confiance des visiteurs professionnels avant achat.

### Objectifs secondaires
- Appuyer la crédibilité (chiffres, engagements)
- Nourrir le GEO (entité nommée + contexte)
- Offrir une porte d'entrée vers le catalogue et le contact

## Structure de la page

### Zone 1 — Hero éditorial
- **Fonction** : accroche de marque
- **Contenu** : sur-titre, H1, sous-titre
- **Comportement** : statique

### Zone 2 — Notre histoire
- **Fonction** : récit des origines (3e personne)
- **Contenu** : 3 paragraphes factuels (placeholders)

### Zone 3 — Notre métier
- **Fonction** : expliquer l'offre et la cible
- **Contenu** : 2 paragraphes (placeholders)

### Zone 4 — Nos engagements
- **Fonction** : différenciation
- **Contenu** : 4 cartes (Expertise, Confiance, Logistique, Ancrage local)

### Zone 5 — Chiffres clés
- **Fonction** : autorité (données chiffrées)
- **Contenu** : 4 cellules (années, clients, références, délai) — valeurs à compléter

### Zone 6 — CTA
- **Fonction** : orienter vers Catalogue + Contact

### Zone 7 — FAQ
- **Fonction** : réponses aux questions récurrentes
- **Contenu** : 5 questions (3 à compléter, 2 prêtes)

## Composants fonctionnels

| Composant | Source | Description | Obligatoire |
|---|---|---|---|
| Breadcrumb | `components/ui/breadcrumb` | Fil d'Ariane | Oui |
| JsonLd | `components/site/JsonLd` | `WebPage` + `BreadcrumbList` + `FAQPage` | Oui |

## Données kit consommées

Aucune (page 100 % éditoriale).

## Réglages shop & droits conditionnant l'affichage

Aucun.

## Contenu éditorial

### Titre principal (H1)
[Accroche — phrase de mission] *(placeholder)*

### Sous-titres (H2)
1. Notre histoire
2. Notre métier
3. Nos engagements
4. [Nom de l'entreprise] en chiffres
5. Questions fréquentes

### Ton et style
3e personne pour les origines, 1re personne pour le présent. Voix
chaleureuse, factuelle, orientée pro.

### Volume de contenu
- Cible ~1000 mots. À compléter par le marchand. Les zones `[…]` sont
  volontairement vides — ne pas inventer de chiffres ou de dates.

## Bloc FAQ

| # | Question | Réponse | Lien interne |
|---|---|---|---|
| 1 | Depuis quand [Nom] existe-t-elle ? | à compléter | — |
| 2 | À quels professionnels s'adresse la boutique ? | à compléter | [Catalogue](/catalogue) |
| 3 | Comment obtenir mes tarifs négociés ? | Connectez-vous à votre compte pro | [Connexion](/connexion) |
| 4 | Où êtes-vous implantés ? | à compléter | — |
| 5 | Comment vous contacter ? | Téléphone, email, formulaire, ticket connecté | [Contact](/contact) |

## Appels à l'action (CTA)

| CTA | Texte | Destination | Priorité | Condition |
|---|---|---|---|---|
| Principal | Découvrir le catalogue | /catalogue | Haute | toujours |
| Secondaire | Nous contacter | /contact | Moyenne | — |

## Maillage interne

- **Footer** : colonne « Aide » → « Notre entreprise »
- **Liens sortants** : Catalogue, Contact, Connexion (depuis FAQ)
- **Liens entrants à venir** : Accueil (« Découvrir notre entreprise »), pages
  catalogue si pertinent

## SEO

| Champ | Valeur |
|---|---|
| **Indexation** | `index` |
| **Meta title** | Notre entreprise — histoire, valeurs et engagements |
| **Meta description** | Découvrez qui nous sommes : notre histoire, notre métier et nos engagements au service des professionnels. |
| **Canonical** | `/notre-entreprise` |
| **Mot-clé principal** | notre entreprise |
| **JSON-LD** | `WebPage`, `BreadcrumbList`, `FAQPage` |

## Notes et remarques

- Page livrée avec des placeholders `[…]` pour éviter toute invention de
  faits. À compléter par le marchand : histoire, métier, engagements,
  chiffres, FAQ 1/2/4.
- Statut SEO « OK » (sitemap + footer + JSON-LD en place) ; statut contenu
  « en attente de complétion ».