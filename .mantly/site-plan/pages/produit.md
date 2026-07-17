# Fiche produit

## Informations générales
- **Nom** : Fiche produit
- **Route** : /produit/[reference]
- **Type** : editorial
- **Indexation** : index

## Objectifs
- Présenter un article en détail (spécifications, déclinaisons, prix)
- Permettre l'ajout au panier ou la demande de devis
- Inciter l'anonyme à se connecter pour voir les tarifs

## Structure
1. Fil d'Ariane (Accueil > Catalogue > Famille > Produit)
2. Galerie image + BuyBox (déclinaisons/gamme, prix, ajout panier)
3. Description longue et tableau de spécifications
4. Produits liés / complémentaires (même famille)
5. FAQ

## Données kit
- useArticle(reference) : détail article (prix nullable)
- useAddToCart() : ajout panier léger
- useAuth() : état connecté
- Prise en compte des droits canOrder / canQuote

## Composants
- BuyBox (déclinaisons + ajout panier)
- ArticleCard (produits liés)
- AuthGate (si anonyme + prix masqué)
- JsonLd (WebPage, BreadcrumbList, Product, FAQPage)

## Style
Linear : présentation claire et aérée, image grande, specs en tableau
