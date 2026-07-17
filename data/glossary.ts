export interface GlossaryEntry {
  slug: string;
  term: string;
  definition: string;
  description: string;
}

export const glossaryEntries: GlossaryEntry[] = [
  {
    slug: "autolaveuse",
    term: "Autolaveuse",
    definition: "Machine de nettoyage combinant le lavage et l'essuyage des sols en un seul passage.",
    description:
      "L'autolaveuse est équipée d'un réservoir d'eau propre et d'eau sale, de brosses rotatives et d'une raclette aspirante. Elle permet de laver et de sécher les sols simultanément, ce qui en fait un outil incontournable pour le nettoyage professionnel des grandes surfaces. Chez Wédis, nous proposons des autolaveuses Kärcher, Nilfisk, Numatic, Viper et Fimap adaptées à tous types de surfaces.",
  },
  {
    slug: "monobrosse",
    term: "Monobrosse",
    definition: "Machine de nettoyage à rotation lente utilisée pour le lavage, le lustrage et le décapage des sols.",
    description:
      "La monobrosse est une machine polyvalente qui peut être utilisée pour différentes opérations selon le disque ou la brosse montée : lavage, lustrage, cristallisation, décapage. Elle est particulièrement adaptée aux surfaces de taille moyenne (bureaux, commerces, écoles) et aux travaux de rénovation des sols.",
  },
  {
    slug: "aspirateur-industriel",
    term: "Aspirateur industriel",
    definition: "Aspirateur puissant conçu pour un usage intensif, capable d'aspirer poussières, liquides et débris.",
    description:
      "Contrairement aux aspirateurs domestiques, les aspirateurs industriels sont conçus pour fonctionner plusieurs heures par jour et aspirer des volumes importants de poussière, de liquides ou de débris. Ils existent en versions monophasées et triphasées, avec ou sans filtration HEPA. Wédis distribue des aspirateurs industriels Numatic, Kärcher et Nilfisk.",
  },
  {
    slug: "balayeuse",
    term: "Balayeuse",
    definition: "Machine de nettoyage motorisée qui balaye et collecte les déchets solides au sol.",
    description:
      "La balayeuse est idéale pour le nettoyage des grandes surfaces extérieures ou intérieures (parkings, entrepôts, voiries). Elle utilise un système de brosses rotatives et une trémie de collecte. Les modèles à conducteur assis offrent une productivité élevée pour les surfaces de plus de 5 000 m².",
  },
  {
    slug: "chariot-nettoyage",
    term: "Chariot de nettoyage",
    definition: "Équipement mobile permettant de transporter et d'organiser le matériel de nettoyage.",
    description:
      "Le chariot de nettoyage est l'outil de base du professionnel de l'entretien. Il permet de transporter seaux, balais, produits et accessoires de manière organisée et ergonomique. Les modèles récents intègrent des systèmes de pressage mécanique et de dosage des produits pour optimiser le travail.",
  },
  {
    slug: "nettoyeur-haute-pression",
    term: "Nettoyeur haute pression",
    definition: "Appareil projetant de l'eau à haute pression pour le nettoyage en profondeur des surfaces.",
    description:
      "Les nettoyeurs haute pression (NHP) utilisent une pompe pour comprimer l'eau jusqu'à 500 bars ou plus. Ils sont utilisés pour le nettoyage des sols, des machines, des véhicules et des bâtiments. Kärcher est le leader mondial du nettoyeur haute pression, avec une gamme professionnelle complète disponible chez Wédis.",
  },
  {
    slug: "cristallisation",
    term: "Cristallisation",
    definition: "Technique de rénovation et de protection des sols en marbre ou pierre naturelle.",
    description:
      "La cristallisation est un procédé mécanico-chimique qui crée une fine couche protectrice sur le sol, lui redonnant brillance et résistance. Elle est réalisée avec une monobrosse équipée d'un disque laine d'acier et d'un produit cristallisant. Wédis propose tout le matériel et les produits nécessaires à la cristallisation.",
  },
  {
    slug: "gamme",
    term: "Gamme (ou déclinaison produit)",
    definition: "Variante d'un produit selon des caractéristiques spécifiques (taille, couleur, puissance).",
    description:
      "Dans le catalogue Wédis, un même produit peut exister en plusieurs gammes : par exemple, une autolaveuse peut être proposée avec différentes largeurs de lavage, capacités de réservoir ou types de batteries. Les gammes permettent d'adapter précisément un produit aux besoins du client.",
  },
];
