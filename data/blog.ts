export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  readingTime: string;
  image?: string;
  content: BlogBlock[];
}

export type BlogBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string; level: 2 | 3 }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "cta"; label: string; href: string }
  | { type: "image"; src: string; alt: string };

export const blogPosts: BlogPost[] = [
  {
    slug: "bien-choisir-autolaveuse-professionnelle",
    title: "Bien choisir son autolaveuse professionnelle",
    excerpt:
      "Autolaveuse à conducteur assis ou poussée ? Quelle largeur de lavage ? Découvrez tous nos conseils pour choisir l'autolaveuse adaptée à vos besoins dans le Grand Est.",
    category: "Conseils",
    date: "2025-01-15",
    author: "Wédis",
    readingTime: "6 min",
    content: [
      { type: "paragraph", text: "L'autolaveuse est un investissement important pour tout professionnel du nettoyage. Que vous soyez un prestataire de services, une collectivité ou une entreprise industrielle, le choix de votre machine doit être réfléchi pour optimiser votre productivité et votre retour sur investissement." },
      { type: "heading", text: "Les critères essentiels", level: 2 },
      { type: "paragraph", text: "Pour bien choisir votre autolaveuse, plusieurs critères sont à prendre en compte : la surface à nettoyer, le type de sol, l'accessibilité des locaux, et la fréquence d'utilisation." },
      { type: "heading", text: "1. La surface à nettoyer", level: 3 },
      { type: "paragraph", text: "Pour des surfaces inférieures à 500 m², une autolaveuse poussée (ou autoportée) est généralement suffisante. Au-delà de 1 000 m², une autolaveuse à conducteur assis sera plus productive. Entre les deux, les modèles à conducteur accompagné offrent un bon compromis." },
      { type: "heading", text: "2. Le type de sol", level: 3 },
      { type: "paragraph", text: "Les sols lisses (carrelage, PVC) nécessitent une brosse standard. Pour les sols rugueux (béton, pierre), préférez une brosse abrasive. Les tapis et moquettes demandent un équipement spécifique avec un système de moussage." },
      { type: "heading", text: "3. L'autonomie et la capacité", level: 3 },
      { type: "list", items: [
        "Capacité du réservoir d'eau : de 10 à 150 litres selon les modèles",
        "Autonomie de la batterie : de 2 à 6 heures en utilisation continue",
        "Largeur de lavage : de 45 cm à 120 cm",
        "Débit de la solution : de 1 à 5 litres par minute"
      ]},
      { type: "heading", text: "Les marques disponibles chez Wédis", level: 2 },
      { type: "paragraph", text: "Chez Wédis, nous distribuons les plus grandes marques d'autolaveuses : Kärcher, Nilfisk, Numatic, Viper, Tennant et Fimap. Nos experts vous accompagnent dans le choix de la machine la plus adaptée à vos besoins, avec démonstration sur site dans tout le Grand Est (Nancy, Metz, Épinal, Reims)." },
      { type: "cta", label: "Découvrir notre catalogue d'autolaveuses", href: "/catalogue" },
      { type: "heading", text: "L'entretien de votre autolaveuse", level: 2 },
      { type: "paragraph", text: "Pour prolonger la durée de vie de votre autolaveuse, un entretien régulier est indispensable. Vidange des réservoirs, nettoyage des brosses, contrôle des batteries... Notre SAV à Neuves-Maisons assure la maintenance de toutes les marques que nous distribuons." },
    ],
  },
  {
    slug: "aides-carsat-nettoyage-locaux-professionnels",
    title: "Aides CARSAT pour le nettoyage des locaux professionnels",
    excerpt:
      "La CARSAT propose des aides financières pour améliorer les conditions de travail. Découvrez comment Wédis vous accompagne dans le montage de votre dossier dans le Grand Est.",
    category: "Financement",
    date: "2024-12-10",
    author: "Wédis",
    readingTime: "4 min",
    content: [
      { type: "paragraph", text: "La CARSAT (Caisse d'Assurance Retraite et de la Santé au Travail) propose des aides financières aux entreprises qui souhaitent améliorer les conditions de travail de leurs salariés. Le nettoyage des locaux professionnels fait partie des axes prioritaires." },
      { type: "heading", text: "Quelles aides pour le nettoyage ?", level: 2 },
      { type: "paragraph", text: "La CARSAT peut financer jusqu'à 70 % du coût d'un équipement de nettoyage, dans la limite de 25 000 €. Les machines éligibles sont celles qui réduisent la pénibilité : autolaveuses, aspirateurs à trainard, chariots de nettoyage ergonomiques..." },
      { type: "heading", text: "Comment constituer son dossier ?", level: 2 },
      { type: "paragraph", text: "Le montage d'un dossier CARSAT peut sembler complexe. Chez Wédis, nous accompagnons nos clients du Grand Est dans cette démarche : analyse des besoins, choix du matériel éligible, rédaction du dossier technique, et suivi jusqu'à l'obtention de l'aide." },
      { type: "list", items: [
        "Éligibilité : entreprises du Grand Est (Nancy, Metz, Épinal, Reims, Troyes)",
        "Taux de financement : jusqu'à 70 % du matériel",
        "Plafond : 25 000 € d'aide par projet",
        "Délais : 2 à 4 mois pour le traitement du dossier"
      ]},
      { type: "heading", text: "Exemples de matériels financés", level: 2 },
      { type: "paragraph", text: "Les autolaveuses (Kärcher, Nilfisk, Numatic) et les chariots de nettoyage sont les équipements les plus souvent financés par la CARSAT. Nous vous aidons à sélectionner le matériel le plus adapté à votre activité." },
      { type: "cta", label: "Contactez-nous pour monter votre dossier", href: "/contact" },
    ],
  },
  {
    slug: "robot-nettoyage-professionnel-avantages",
    title: "Robot de nettoyage professionnel : avantages et retour sur investissement",
    excerpt:
      "Les robots de nettoyage séduisent de plus en plus d'entreprises. Quel retour sur investissement attendre ? Nos conseils pour le Grand Est.",
    category: "Innovation",
    date: "2024-11-20",
    author: "Wédis",
    readingTime: "5 min",
    content: [
      { type: "paragraph", text: "Les robots de nettoyage professionnel (robots autolaveurs) connaissent un essor remarquable. Autonomes, programmables et de plus en plus performants, ils transforment la façon dont les entreprises nettoient leurs locaux." },
      { type: "heading", text: "Quels avantages pour votre entreprise ?", level: 2 },
      { type: "list", items: [
        "Productivité : le robot nettoie en dehors des heures de présence, sans interruption",
        "Qualité : trajectoire optimisée, couverture systématique de toute la surface",
        "Traçabilité : rapport de nettoyage détaillé pour chaque mission",
        "Sécurité : réduction des tâches pénibles pour les opérateurs"
      ]},
      { type: "heading", text: "Quel retour sur investissement ?", level: 2 },
      { type: "paragraph", text: "Pour une surface de 2 000 m² nettoyée quotidiennement, un robot autolaveur peut réduire le temps de nettoyage de 70 %. L'investissement (entre 15 000 € et 35 000 €) est généralement amorti en 18 à 24 mois, sans compter les aides CARSAT disponibles." },
      { type: "heading", text: "Les robots disponibles chez Wédis", level: 2 },
      { type: "paragraph", text: "Wédis distribue des robots de nettoyage des marques Kärcher (KIRA), Nilfisk (Liberty), et Fimap. Nos experts vous conseillent et assurent la mise en service, la programmation et la formation de vos équipes dans toute la région Grand Est." },
      { type: "cta", label: "Demander une démonstration", href: "/contact" },
    ],
  },
];
