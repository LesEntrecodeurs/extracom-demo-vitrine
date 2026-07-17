# Glossaire

## Informations generales
- **Nom** : Glossaire
- **Route** : /glossaire
- **Type** : editorial
- **Indexation** : index

## Objectifs
- Definir le vocabulaire technique du nettoyage professionnel
- SEO longue traine
- Alimenter les tooltips sur les autres pages

## Structure
1. Index : recherche + index alphabetique + liste termes
2. Pages individuelles /glossaire/[slug] : definition, description, exemple

## Fonctionnement
- Donnees centralisees dans data/glossary.ts
- Tooltips automatiques sur les pages editoriales
- Maillage vers catalogue/produits

## Composants
- GlossaryTooltip (nouveau)
- linkifyGlossaryTerms (lib)
- JsonLd (DefinedTerm)
