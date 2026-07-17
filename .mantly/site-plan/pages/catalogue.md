# Catalogue

## Informations generales
- **Nom** : Catalogue
- **Route** : /catalogue
- **Type** : editorial
- **Indexation** : index

## Objectifs
- Parcourir et filtrer l offre produits
- Naviguer dans l'arborescence hierarchique (catalogTree)
- Acceder aux fiches produit

## Structure
1. En-tete + fil d'Ariane dynamique (arbre catalogue)
2. Bandeau tarifs (si anonyme)
3. Barre de recherche
4. Navigation hierarchique (catalogTree) : categories puis sous-categories
5. Grille de produits (ProductCard) + compteur

## Donnees kit
- useArticles(query) : liste paginee (supporte catalogId + catalogLevel pour la navigation hierarchique, familyCode pour filtre famille plate, search)
- useShopContext() : catalogTree (arbre avec children), families (liste plate)
- useAuth() : etat connecte

## Composants
- CatalogueHeader : titre + breadcrumb + bandeau connexion
- SearchBar : champ de recherche
- CategoryNavigation : affiche les noeuds de l'arbre catalogue (avec fallback familles plates)
- ProductGrid : grille produits avec etats vide/chargement/erreur
- ProductCard : carte produit (reliée)

## Organisation
- Navigation hierarchique via catalogTree (noeuds avec niveaux 1-4)
- Filtre par famille plate en fallback
- Parcours : niveau 1 → sous-categories → produits
