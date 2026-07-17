# Commande (validation)

## Informations générales
- **Nom** : Commande
- **Route** : /commande
- **Type** : transactionnel
- **Indexation** : noindex

## Objectifs
- Finaliser la commande après le panier
- Choisir l'adresse de livraison et les options
- Valider la commande, demander un devis ou payer en ligne

## Structure
1. Résumé du panier (lignes, quantités, totaux)
2. Adresse de livraison [si deliveryEnabled]
3. Commentaire optionnel
4. Récapitulatif et CTA selon droits :
   - Valider la commande [si canOrder]
   - Demander un devis [si canQuote]
   - Payer en ligne [si paymentEnabled]
   - Valider sans paiement [si canCheckoutWithoutPayment]

## Données kit
- useCart() : lignes, setDelivery, setComment
- useDelivery() : adresses
- useCheckout() : createOrder, validateWithoutPayment
- usePayment() : start (redirection prestataire)

## Composants
- AuthGate (réservé aux connectés)
- AddressForm
- JsonLd (WebPage)

## Style
Linear : tunnel épuré, progression claire, formulaire minimal
