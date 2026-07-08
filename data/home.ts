// Contenu éditorial de la page d'accueil.
// Voix hybride GEO/CRO : on parle de la marque en 3e personne dans le
// contenu factuel et en 1re personne dans le hero / les CTA. Le nom de
// marque est résolu dynamiquement (`branding.name`) côté composant.

export type Faq = { question: string; answer: string };

export type Section = {
  title: string;
  body: string;
  bullets?: string[];
};

export type TrustStat = { value: string; label: string };

// FAQ de l'accueil (référencée aussi par le JSON-LD `FAQPage`).
export const homeFaq: Faq[] = [
  {
    question:
      'Comment accéder aux tarifs négociés sur cette boutique en ligne ?',
    answer:
      'Les tarifs négociés s’affichent automatiquement après connexion. Créez un compte professionnel, validez votre inscription et vos prix personnels apparaissent sur chaque fiche produit et dans le catalogue.'
  },
  {
    question:
      'Qui peut commander sur cette boutique professionnelle ?',
    answer:
      'La commande est réservée aux clients professionnels disposant d’un compte validé. Les visiteurs anonymes peuvent parcourir le catalogue, mais doivent se connecter pour voir leurs prix et passer commande.'
  },
  {
    question: 'Comment demander un devis plutôt que commander en ligne ?',
    answer:
      'Sur chaque fiche produit, le bouton « Demander un devis » est disponible selon vos droits. Vous pouvez aussi nous écrire via la page Contact : nous revenons vers vous sous 24 à 48 heures ouvrées.'
  },
  {
    question: 'Quels sont les délais de livraison ?',
    answer:
      'Nous expédions les commandes sous 24 à 48 heures ouvrées. Le délai de transport dépend ensuite du transporteur et de la destination ; les conditions précises sont rappelées sur la page Contact.'
  },
  {
    question: 'Le paiement en ligne est-il sécurisé ?',
    answer:
      'Oui : les transactions sont protégées par notre prestataire de paiement. Aucune donnée bancaire n’est stockée sur notre site. Le règlement s’effectue uniquement après validation de votre commande.'
  },
  {
    question: 'Peut-on commander en tant qu’entreprise multi-sites ?',
    answer:
      'Oui, nous accompagnons les entreprises multi-établissements avec une gestion par société, des adresses de livraison multiples et des utilisateurs aux droits différenciés. Contactez-nous pour paramétrer votre compte.'
  }
];

// Sections éditoriales « Pourquoi nous choisir ».
export const whyUsSections: Section[] = [
  {
    title: 'Un catalogue professionnel structuré par familles',
    body:
      'Notre boutique en ligne référence l’ensemble de notre offre professionnelle, organisée en grandes familles pour aller directement au produit recherché. Chaque fiche détaille les caractéristiques techniques, les conditionnements et les documents associés (fiches techniques, fiches de données de sécurité).',
    bullets: [
      'Recherche par référence, désignation ou mots-clés',
      'Filtres par famille, prix et disponibilité',
      'Fiches techniques téléchargeables en un clic'
    ]
  },
  {
    title: 'Des tarifs négociés par client',
    body:
      'Chaque client professionnel dispose de ses propres conditions tarifaires, appliquées automatiquement après connexion. Vous voyez immédiatement votre prix net, les remises négociées et les prix barrés quand un tarif promotionnel est en cours.',
    bullets: [
      'Tarifs appliqués automatiquement à la connexion',
      'Remises contractuelles et centrales d’achat',
      'Prix de base visible pour les visiteurs anonymes'
    ]
  },
  {
    title: 'Une commande simple, en ligne ou sur devis',
    body:
      'Vous commandez directement en ligne lorsque le paiement est activé pour votre compte, ou vous demandez un devis en quelques clics pour les volumes spécifiques. Nous traitons les commandes du lundi au vendredi et expédions sous 24 à 48 heures.',
    bullets: [
      'Panier, validation et paiement en ligne',
      'Devis express pour les projets sur mesure',
      'Suivi de commande depuis votre espace client'
    ]
  }
];

// Chiffres clés affichés dans la bande de réassurance.
export const trustStats: TrustStat[] = [
  { value: '24–48h', label: 'Expédition' },
  { value: '100%', label: 'Tarifs pro' },
  { value: '1 clic', label: 'Devis express' },
  { value: 'B2B', label: 'Réservé aux pros' }
];
