"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Search, Calendar, ArrowRight } from "lucide-react";
import { useState } from "react";
import { blogPosts } from "@/data/blog";

const articles = blogPosts.map((p) => ({
  slug: p.slug,
  title: p.title,
  excerpt: p.excerpt,
  date: p.date,
  category: p.category,
  readTime: p.readingTime,
}));

const categories = ["Tous", ...Array.from(new Set(articles.map((a) => a.category)))];

export default function BlogPage() {
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("Tous");

  const filtered = articles.filter((a) => {
    const matchSearch =
      !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCat === "Tous" || a.category === activeCat;
    return matchSearch && matchCat;
  });

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <Container className="py-12">
      <nav className="flex items-center gap-2 text-sm text-text-secondary mb-8">
        <Link href="/" className="hover:text-primary">Accueil</Link>
        <span>/</span>
        <span className="text-text font-medium">Blog</span>
      </nav>

      <div className="max-w-2xl mb-10">
        <h1 className="text-4xl font-bold font-heading">Blog Wédis</h1>
        <p className="mt-4 text-lg text-text-secondary">
          Conseils, guides et actualités du matériel de nettoyage professionnel.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder="Rechercher un article…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeCat === cat
                  ? "bg-primary text-white"
                  : "bg-surface-secondary text-text-secondary hover:bg-border"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg font-medium">Aucun article trouvé</p>
          <p className="text-text-secondary mt-2">Essayez une autre recherche.</p>
        </div>
      ) : (
        <>
          {/* Featured article */}
          {featured && (
            <Link
              href={`/blog/${featured.slug}`}
              className="group block rounded-xl border border-border bg-white overflow-hidden mb-8 transition-all hover:shadow-card-hover"
            >
              <div className="md:flex">
                <div className="md:w-2/5 aspect-[16/9] md:aspect-auto bg-surface-secondary flex items-center justify-center">
                  <span className="text-4xl text-text-secondary/30 font-heading">Blog</span>
                </div>
                <div className="p-6 md:p-8 md:w-3/5 flex flex-col justify-center">
                  <div className="flex items-center gap-3 text-xs text-text-secondary mb-3">
                    <span className="rounded-full bg-primary/10 text-primary px-3 py-1 font-medium">
                      {featured.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(featured.date).toLocaleDateString("fr-FR")}
                    </span>
                    <span>{featured.readTime}</span>
                  </div>
                  <h2 className="text-2xl font-bold font-heading group-hover:text-primary transition-colors">
                    {featured.title}
                  </h2>
                  <p className="mt-3 text-text-secondary">{featured.excerpt}</p>
                  <span className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
                    Lire l&apos;article <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </Link>
          )}

          {/* Rest of articles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="group rounded-lg border border-border bg-white p-6 transition-all hover:shadow-card-hover"
              >
                <div className="flex items-center gap-3 text-xs text-text-secondary mb-4">
                  <span className="rounded-full bg-secondary/10 text-secondary px-3 py-1 font-medium">
                    {article.category}
                  </span>
                  <span>{article.readTime}</span>
                </div>
                <h3 className="font-bold font-heading group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <p className="mt-2 text-sm text-text-secondary line-clamp-2">
                  {article.excerpt}
                </p>
                <div className="mt-4 flex items-center gap-1 text-xs text-text-secondary">
                  <Calendar className="h-3 w-3" />
                  {new Date(article.date).toLocaleDateString("fr-FR")}
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </Container>
  );
}
