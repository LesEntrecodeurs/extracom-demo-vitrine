# Connexion

## Informations générales
- **Nom** : Connexion
- **Route** : /connexion
- **Type** : transactionnel
- **Indexation** : noindex

## Objectifs
- Permettre au client de se connecter à son compte
- Rediriger vers la page d'origine après connexion

## Structure
1. Carte centrée avec formulaire email / mot de passe
2. Lien « Mot de passe oublié »
3. Lien « Créer un compte » [si registrationOpen]
4. Message d'erreur si identifiants incorrects

## Données kit
- useAuth() : login
- useShopContext() : capabilities

## Composants
- form + input (components/ui)

## Style
Linear : centré, minimaliste, un seul champ par ligne
