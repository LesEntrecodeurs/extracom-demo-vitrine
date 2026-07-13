# Accueil

## Informations générales

| Champ | Valeur |
|---|---|
| **Nom de la page** | Accueil |
| **Route** | `app/page.tsx` |
| **Slug URL** | `/` |
| **Type de page** | editorial |
| **Indexation** | index |
| **Priorité** | Haute |
| **Statut** | En cours |

## Objectifs de la page

### Objectif principal

Présenter la boutique B2B, orienter le visiteur vers le catalogue et déclencher l’inscription ou la connexion pour accéder aux tarifs négociés.

### Objectifs secondaires

- Expliquer rapidement le fonctionnement de la boutique professionnelle.
- Montrer une sélection de cinq produits du catalogue.
- Donner accès aux principales catégories.
- Adapter les appels à l’action à la situation du visiteur.

### KPIs associés

- Taux de clic vers le catalogue.
- Taux de clic vers une fiche produit mise en avant.
- Taux d’inscription et de connexion.
- Taux de rebond.

## Structure actuelle de la page

### Zone 1 — Hero

- Nom dynamique de la boutique et mention « Espace professionnel ».
- Titre adapté au visiteur anonyme ou au client connecté.
- Texte d’introduction sur le catalogue, les tarifs négociés, la commande et le devis.
- Recherche directe dans le catalogue.
- Lien de connexion pour les visiteurs anonymes.
- Trois signaux de confiance : livraison, tarifs négociés et devis.

### Zone 2 — Onboarding visiteur

Visible uniquement pour un visiteur anonyme. Le parcours professionnel est expliqué en trois étapes : création du compte, affichage des tarifs et commande ou devis.

### Zone 3 — Réassurance

Trois cartes présentent la livraison rapide, le paiement sécurisé et le support dédié.

### Zone 4 — Sélection produits

- Titre « Notre sélection » et lien vers tout le catalogue.
- Cinq produits maximum issus du catalogue.
- Présentation dans un carrousel adapté au mobile et aux grands écrans.
- Chaque carte renvoie vers la fiche produit et respecte l’affichage conditionnel des prix.
- La section est masquée si aucun produit ne peut être chargé.

### Zone 5 — Catégories

- Six catégories maximum issues de l’arbre du catalogue.
- Grille de liens vers le catalogue filtré.
- La section est masquée si aucune catégorie ne peut être chargée.

### Zone 6 — Appel à l’action final

Visible uniquement pour un visiteur anonyme. La création de compte est proposée si les inscriptions sont ouvertes ; la connexion reste toujours accessible.

## Composants fonctionnels

| Élément | Rôle | État |
|---|---|---|
| Hero | Proposition de valeur et recherche | Actif |
| Onboarding | Expliquer le parcours B2B aux visiteurs anonymes | Actif |
| Cartes produit | Présenter les produits et leurs informations | Actif |
| Carrousel de sélection | Afficher cinq produits maximum | Actif |
| Grille de catégories | Orienter vers les familles du catalogue | Actif |
| CTA final | Inscription conditionnelle et connexion | Actif |

## Données consommées

| Donnée | Usage |
|---|---|
| Contexte boutique | Nom, catégories et ouverture des inscriptions |
| Utilisateur courant | Personnalisation du titre et affichage des blocs anonymes |
| Articles du catalogue | Sélection de cinq produits maximum |

## États gérés

- Visiteur anonyme ou client connecté.
- Inscription ouverte ou fermée.
- Prix visible ou réservé aux clients connectés dans les cartes produit.
- Catalogue ou catégories indisponibles : les sections concernées sont masquées.

## Contenu éditorial actuel

### Titre principal

- Visiteur anonyme : « Votre catalogue professionnel, au juste prix. »
- Client connecté : message de bienvenue personnalisé avec son prénom.

### Sous-titres principaux

1. « Comment ça marche » pour les visiteurs anonymes.
2. « Notre sélection » pour les cinq produits mis en avant.
3. « Explorez les catégories » pour l’entrée par catalogue.
4. « Un compte professionnel ? » pour l’appel à l’action final.

### Ton et style

Ton direct, professionnel et orienté vers l’accès aux tarifs négociés, la commande et le devis.

### Volume de contenu

La page reste nettement sous la cible éditoriale d’environ 1 000 mots. Un enrichissement factuel et une FAQ pourront être ajoutés lorsque des informations propres à la boutique seront disponibles.

## Bloc FAQ

Aucun bloc FAQ visible actuellement. Aucun balisage FAQ n’est présent.

## Appels à l’action

| CTA | Destination | Condition |
|---|---|---|
| Rechercher | Catalogue avec recherche | Toujours |
| Déjà client ? Connectez-vous | Connexion | Visiteur anonyme |
| Tout voir | Catalogue | Sélection produits disponible |
| Créer un compte | Inscription | Visiteur anonyme et inscriptions ouvertes |
| Connexion | Connexion | Visiteur anonyme |

## Maillage interne

### Liens sortants

- Catalogue via la recherche et le lien « Tout voir ».
- Fiches produit via les cinq cartes mises en avant.
- Catalogue filtré via les catégories.
- Connexion et inscription selon l’état du visiteur et de la boutique.

### Parcours utilisateurs

| Parcours | Entrée suivante |
|---|---|
| Prospect anonyme | Catalogue, fiche produit, inscription ou connexion |
| Client connecté | Catalogue, fiche produit ou catégorie |

## SEO et contenu structuré

| Champ | État actuel |
|---|---|
| **Indexation** | Héritée de la configuration globale |
| **Titre et description** | Hérités de la mise en page globale |
| **Canonical dédié** | Non défini sur la page |
| **JSON-LD dédié** | Non présent sur la page |
| **FAQ structurée** | Non présente |

## Notes

- La page est rendue côté serveur.
- Les données commerce proviennent exclusivement des fonctions prévues par la boutique.
- La sélection affiche les cinq premiers produits renvoyés par le catalogue, sans tri personnalisé ajouté par la page.
