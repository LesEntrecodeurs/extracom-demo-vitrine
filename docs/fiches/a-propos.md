# À propos

> Fiche d'état réelle de la page, synchronisée à chaque édition
> (cf. `docs/PRINCIPES.md` §9). Le gabarit source est
> `docs/templates/pages/conditionnelles/a-propos.md`.

---

## Informations générales

| Champ | Valeur |
|---|---|
| **Nom de la page** | À propos |
| **Route** | `app/a-propos/page.tsx` |
| **Slug URL** | `/a-propos` |
| **Type de page** | `editorial` |
| **Indexation** | `index` |
| **Priorité** | Moyenne |
| **Statut** | en cours (placeholders à personnaliser) |

## Propagation

- ✅ Route créée
- ✅ Lien présent dans le footer (colonne « Aide »)
- ✅ Présente dans `app/sitemap.ts`
- ✅ Présente dans `app/llms.txt/route.ts`
- ✅ Fiche d'état créée

## Sections affichées

1. Fil d'Ariane (Accueil › À propos)
2. Hero éditorial — titre de marque + phrase d'accroche (placeholders)
3. Notre histoire — récit en 3 paragraphes (placeholders)
4. Nos engagements — 4 piliers (Proximité, Expertise, Réactivité, Confiance)
5. {Marque} en chiffres — bandeau 4 chiffres (placeholders)
6. Notre métier au quotidien — 2 paragraphes (placeholders)
7. CTA — Catalogue + Contact
8. Questions fréquentes — 4 entrées, JSON-LD `FAQPage`

## Placeholders à compléter avec l'utilisateur

Éléments marqués `[…]` à remplacer par les vraies informations de
l'entreprise :

- Année de fondation
- Ville / région d'origine
- Fondateur ou initiative à l'origine du projet
- Secteur(s) accompagné(s) et territoire
- Parcours / étapes clés / jalons
- Chiffres : nombre de collaborateurs, de clients, de références, de marques
  partenaires, ancienneté
- Phrase d'accroche entreprise
- Description du quotidien de l'équipe
- Localisation de la FAQ si elle doit devenir spécifique au shop

## SEO

| Champ | Valeur |
|---|---|
| **Indexation** | `index` |
| **Meta title** | « À propos » (template layout ajoute `· ${shopName}`) |
| **Meta description** | « Découvrez notre entreprise : histoire, engagements et expertise au service des professionnels. » |
| **Canonical** | `/a-propos` |
| **JSON-LD** | `WebPage`, `BreadcrumbList`, `FAQPage` |

## Maillage

- **Footer** : colonne « Aide » → « À propos »
- **Sortants** : Catalogue (`/catalogue`), Contact (`/contact`), Inscription (`/inscription`)
- **Entrants** : à ajouter depuis l'accueil si pertinent

## Notes

- Le H1 utilise `branding.name` (kit) — s'adapte automatiquement au shop
  paramétré.
- Le JSON-LD FAQ remplace « notre entreprise » par le nom de marque pour
  l'entité nommée GEO, sans modifier le rendu visible (qui reste lisible
  pendant la personnalisation).