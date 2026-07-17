# Blog (liste)

## Informations generales
- **Nom** : Blog
- **Route** : /blog
- **Type** : editorial
- **Indexation** : index

## Objectifs
- Contenu editorial (conseils, actualites, guides)
- SEO / GEO, autorite thematique
- Maillage vers le catalogue

## Structure
1. En-tete + fil d Ariane
2. Article mis en avant
3. Grille d articles (filtres + tri + pagination)
4. CTA vers catalogue

## Fonctionnement
- 100% dans le code : fichiers TS dans data/blog/
- Pas de base de donnees, pas de dependance
- Chaque article = 1 fichier modifiable par prompt

## Composants
- BlogCard
- BlogFilters (recherche, categorie, tri)
- BlogPagination
- BlogArticleBody (rend les blocs types)
- JsonLd (ItemList)
