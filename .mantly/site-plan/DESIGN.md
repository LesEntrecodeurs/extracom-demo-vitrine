# Brief de design — Wédis

## Ambiance générale
Site épuré, moderne, professionnel. Inspiré de l'esprit Linear.app : beaucoup d'espace, typographie soignée, grille aérée, pas de fioritures. L'accent est mis sur la clarté et la confiance, pour un public de professionnels du nettoyage.

## Palette de couleurs

| Rôle | Couleur | Code hex | Usage |
|---|---|---|---|
| **Primaire (accent)** | Bleu foncé Wédis | `#295795` | Boutons, liens, titres importants, header, footer |
| **Secondaire** | Bleu clair | `#00ADEF` | Accents secondaires, badges, icônes, survol de certains éléments |
| **Fond principal** | Blanc | `#FFFFFF` | Fond général des pages |
| **Fond secondaire** | Gris très clair | `#F8F9FA` | Sections alternées, cartes, arrière-plan des blocs |
| **Texte principal** | Gris foncé | `#1A1A2E` | Corps de texte, titres |
| **Texte secondaire** | Gris moyen | `#6B7280` | Sous-titres, descriptions, meta |
| **Bordure** | Gris clair | `#E5E7EB` | Séparateurs, bordures de cartes |
| **Succès / disponible** | Vert | `#10B981` | Disponibilités, validations |
| **Alerte / rupture** | Rouge | `#EF4444` | Rupture de stock, erreurs |

## Typographie

- **Titres (h1, h2, h3, grands titres)** : Satoshi — importé depuis Fontshare (https://fontshare.com/fonts/satoshi), graisses Medium, Bold
- **Corps de texte, navigation, boutons** : Inter — importé depuis Google Fonts, graisses Regular, Medium, Semibold

### Hiérarchie des tailles (approximative)
- h1 : très grand (environ 48-56px)
- h2 : grand (environ 32-40px)
- h3 : intermédiaire (environ 24-28px)
- Corps : 16px
- Petit texte / meta : 14px

## Éléments de style

### Header
- Fond blanc, logo à gauche, menu de navigation centré ou à droite
- Menu : Accueil, Catalogue (dropdown avec catégories), Marques (dropdown), Services, Blog, Contact
- Barre de recherche visible
- Icônes panier et compte utilisateur à droite

### Footer
- Fond bleu foncé (#295795), texte blanc
- 3-4 colonnes : Coordonnées, Liens rapides, Produits, Marques
- Bas de page : mentions légales, CGV, ©

### Cartes produits
- Fond blanc, ombre légère, image produit en haut
- Titre en Satoshi, prix en Inter
- Bouton "Ajouter au panier" bleu foncé
- Badge "Nouveau" ou "Promo" en bleu clair

### Boutons
- Bouton principal : fond bleu foncé, texte blanc, coins légèrement arrondis
- Bouton secondaire : contour gris, texte gris foncé
- Effet de survol : léger assombrissement

### Images
- Angles droits (pas d'arrondis prononcés) — sauf les avatars/logos clients
- Images produits : fond blanc ou transparent, bien cadrées

## Notes techniques à l'attention du build
- Polices : Satoshi importé via Fontshare (inclure la graisse Medium et Bold pour les titres, et éventuellement Variable), Inter importé via Google Fonts (Regular 400, Medium 500, Semibold 600)
- Le gris très clair #F8F9FA servira de fond aux sections alternées et aux cartes
- Les ombres portées seront très légères (petit offset, faible opacité)
