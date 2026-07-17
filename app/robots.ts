import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wedis.fr";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/panier", "/commande", "/paiement/", "/compte/", "/api/"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
