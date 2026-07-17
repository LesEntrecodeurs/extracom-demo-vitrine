# Espace compte

## Informations générales
- **Nom** : Espace client
- **Routes** : /compte, /compte/commandes, /compte/commandes/[id], /compte/adresses, /compte/profil
- **Type** : transactionnel
- **Indexation** : noindex

## Objectifs
- Donner accès à l'historique des documents (commandes, factures, BL, devis)
- Gérer les adresses de livraison
- Modifier le profil et le mot de passe
- Recommander depuis une commande passée

## Structure
1. Layout 2 colonnes : menu latéral (commandes / adresses / profil) + contenu
2. Commandes : liste filtrable + détail + PDF + « Recommander »
3. Adresses : liste + AddressForm (ajout/modification)
4. Profil : formulaire updateProfile + changement mot de passe
5. CompanySwitcher [si multi-société]

## Données kit
- useDocuments() / useDocument() : historique et détail
- getDocumentPdfAction() : PDF
- useDelivery() : adresses
- useAccount() : updateProfile, changePassword
- useCompany() : switchTo (multi-société)
- useCart().reorder() : recommander

## Composants
- AuthGate (réservé aux connectés)
- CompanySwitcher
- AddressForm
- Table (components/ui/table)
- JsonLd (WebPage)

## Style
Linear : sobre, menu latéral épuré, tableaux minimalistes
