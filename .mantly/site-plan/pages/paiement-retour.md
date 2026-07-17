# Paiement — Retour

## Informations générales
- **Nom** : Retour de paiement
- **Route** : /paiement/retour
- **Type** : transactionnel
- **Indexation** : noindex

## Objectifs
- Afficher le résultat du paiement au retour du prestataire externe
- Orienter le client : compte si succès, panier si échec

## Structure
1. Bloc centré avec icône (succès/échec)
2. Titre et message selon searchParams.paymentStatus
3. CTA : « Voir mon compte » (succès) ou « Retour au panier » (échec)

## Données kit
- usePayment() : start (en amont)
- searchParams.paymentStatus (fourni par le prestataire)

## Composants
- Bouton / lien (components/ui/button)
- JsonLd (WebPage)

## Style
Linear : bloc centré sobre, une action unique
