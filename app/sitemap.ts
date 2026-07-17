import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wedis.fr";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticPages = [
    { url: "/", priority: 1.0 },
    { url: "/catalogue", priority: 0.9 },
    { url: "/marques", priority: 0.8 },
    { url: "/services", priority: 0.8 },
    { url: "/blog", priority: 0.7 },
    { url: "/a-propos", priority: 0.6 },
    { url: "/contact", priority: 0.6 },
    { url: "/glossaire", priority: 0.5 },
    { url: "/connexion", priority: 0.3 },
    { url: "/inscription", priority: 0.3 },
    { url: "/mentions-legales", priority: 0.2 },
    { url: "/cgv", priority: 0.2 },
  ];

  return staticPages.map((page) => ({
    url: `${BASE_URL}${page.url}`,
    lastModified,
    changeFrequency: page.priority >= 0.9 ? "weekly" : "monthly" as const,
    priority: page.priority,
  }));
}
