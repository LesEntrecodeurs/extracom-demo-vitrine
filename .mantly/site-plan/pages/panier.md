# Panier

## Informations générales
- **Nom** : Panier
- **Route** : /panier
- **Type** : transactionnel
- **Indexation** : noindex

## Objectifs
- Permettre au client connecté de vérifier son panier
- Modifier les quantités, supprimer des articles
- Accéder à la finalisation de commande

## Structure
1. Garde authentification (si anonyme → redirection connexion)
2. Lignes panier : image, désignation, quantité, prix, sous-total
3. Commentaire de commande
4. Récapitulatif total
5. CTA vers la commande / demande de devis

## Données kit
- useCart() : lignes, quantités, removeItem, updateLine, setComment
- useAuth() : état connecté
- membership.capabilities : canOrder, canQuote

## Composants
- AuthGate
- CartLine
- JsonLd (WebPage)
