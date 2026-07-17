# Marque — Page dédiée

## Informations générales
- **Nom** : Page marque
- **Route** : /marques/[slug]
- **Type** : editorial
- **Indexation** : index

## Objectifs
- Présenter une marque et ses produits disponibles chez Wédis
- SEO local (ex. « Kärcher Nancy », « Nilfisk Metz »)

## Structure
1. Bannière / logo de la marque
2. Texte de présentation (historique, spécialités, pourquoi Wédis la distribue)
3. Grille des produits Wédis de cette marque
4. CTA : « Voir tous les produits [Marque] » ou « Demander un devis »
5. FAQ

## Données kit
- useArticles() avec filtre marque (si disponible dans le kit)

## Composants
- ArticleCard
- JsonLd (WebPage, BreadcrumbList, FAQPage)

## Style
Linear : sobre, bannière large, grille produits

## Liens
- Page /marques (liste) → /marques/[slug]
- Catalogue : filtre par marque
