/**
 * Informations spécifiques à la boutique (vitrine).
 *
 * Ce fichier centralise les éléments éditables propres à la boutique :
 * coordonnées, horaires, ancienneté, spécialisation, zone livrée, etc.
 *
 * Le NOM de la boutique, lui, n'est pas ici : il vient du contexte runtime
 * (`useShopContext().data.branding.name`) géré par le kit — c'est la source
 * de vérité, partagée entre toutes les boutiques du projet.
 *
 * Volontairement SANS aucune donnée commerciale sensible (pas de prix, pas de
 * stock, pas de données client) — ce fichier est public et lu par les
 * moteurs classiques ET génératifs (ChatGPT, Claude, Perplexity…).
 */

export const shopInfo = {
  /** Accroche officielle — utilisée dans le footer, la page À propos, le
   *  JSON-LD, le llms.txt. Doit être courte, nommée etectorielle. */
  tagline: 'Spécialiste pièces détachées auto à Lyon depuis 1985',

  /** Année de fondation — sert pour l'autorité (GEO) et JSON-LD. */
  foundingDate: '1985',

  /** Adresse postale (schema.org PostalAddress). */
  address: {
    street: '12 rue des Acacias',
    postalCode: '69003',
    city: 'Lyon',
    country: 'FR'
  },

  /** Téléphone au format international pour schema.org (+33…). */
  phone: '+33 4 78 12 34 56',
  /** Variante sans espaces, prête pour les liens tel: et href. */
  phoneTel: '+33478123456',

  /** Email de contact public. */
  email: 'contact@boutique-martin.fr',

  /** Horaires d'ouverture au format schema.org (jours abrégés + HH:MM).
   *  Lundi au samedi, 8h–18h. Dimanche fermé. */
  openingHours: 'Mo-Sa 08:00-18:00',

  /** Description courte pour le footer et la meta description par défaut. */
  shortDescription:
    'Fournisseur de pièces détachées auto pour garagistes et particuliers, à Lyon. Spécialiste des voitures françaises depuis 1985, livraison sous 24h en Auvergne-Rhône-Alpes.',

  /** Spécialisation (secteur / familles) — sert pour JSON-LD `knowsAbout`. */
  specialty: [
    'Pièces détachées automobiles',
    'Voitures françaises',
    'Pièces pour garagistes professionnels'
  ],

  /** Zone principale de livraison (GEO). */
  serviceArea: 'Auvergne-Rhône-Alpes',

  /** Engagement livraison — élément de réassurance pour les clients
   *  professionnels et signal GEO. */
  deliveryPromise: 'Livraison sous 24h en Auvergne-Rhône-Alpes'
} as const;
