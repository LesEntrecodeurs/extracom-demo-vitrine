# Inscription

## Informations générales
- **Nom** : Inscription
- **Route** : /inscription
- **Type** : transactionnel
- **Indexation** : noindex

## Objectifs
- Permettre à un prospect de créer un compte
- Accepter les CGV

## Structure
1. Carte centrée avec formulaire d'inscription (RegisterForm)
2. Acceptation des CGV
3. Lien vers la connexion si déjà inscrit

## Données kit
- useAccount() : register
- useShopContext() : terms, capabilities.registrationOpen

## Composants
- RegisterForm
- form / input (components/ui)

## Réglages
- [si !registrationOpen] → masquer l'entrée (lien supprimé)

## Style
Linear : centré, moderne, formulaire épuré
