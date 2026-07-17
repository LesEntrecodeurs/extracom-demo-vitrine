export const dynamic = "force-static";

export async function GET() {
  const name = "Wédis";
  const url = process.env.NEXT_PUBLIC_SITE_URL || "https://wedis.fr";

  const lines = [
    `# ${name}`,
    "",
    `> ${name} est votre distributeur de matériel et produits de nettoyage professionnel dans le Grand Est depuis 1998.`,
    "",
    "## À propos",
    "",
    `${name} est une entreprise basée à Neuves-Maisons (54), spécialisée dans la fourniture de matériel de nettoyage professionnel : autolaveuses, aspirateurs industriels, monobrosses, balayeuses, robots de nettoyage, chariots, produits d'entretien, matériel manuel. Wédis propose également des services complets : SAV, location de matériel, formation et accompagnement aux aides CARSAT.`,
    "",
    "## Pages principales",
    "",
    `- [Accueil](${url}/): Page d'accueil présentant les produits, services et catégories.`,
    `- [Catalogue](${url}/catalogue): Catalogue complet avec recherche et filtres par famille.`,
    `- [Marques](${url}/marques): Les marques distribuées (Kärcher, Nilfisk, Numatic, Viper, Tennant, Wetrok, Fimap, Pudu).`,
    `- [Services](${url}/services): SAV, location de matériel, formation, aides CARSAT.`,
    `- [Blog](${url}/blog): Conseils, guides et actualités du matériel de nettoyage professionnel.`,
    `- [À propos](${url}/a-propos): Présentation de ${name}.`,
    `- [Contact](${url}/contact): Coordonnées et formulaire de contact.`,
    `- [Glossaire](${url}/glossaire): Glossaire des termes du nettoyage professionnel.`,
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
