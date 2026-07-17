# Mot de passe oublié

## Informations générales
- **Nom** : Mot de passe oublié
- **Route** : /mot-de-passe-oublie
- **Type** : transactionnel
- **Indexation** : noindex

## Objectifs
- Permettre la réinitialisation du mot de passe en 3 étapes

## Structure
1. Étape 1 : saisie de l'adresse email → demande de code
2. Étape 2 : saisie du code (input-otp) → vérification
3. Étape 3 : nouveau mot de passe
4. Lien retour vers la connexion

## Données kit
- useAccount() : requestPasswordReset, verifyResetCode, changePassword

## Composants
- InputOtp (components/ui)
- form / input

## Style
Linear : progression en étapes, centré, minimal
