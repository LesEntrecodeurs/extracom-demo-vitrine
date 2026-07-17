"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Calendar, ArrowLeft } from "lucide-react";
import { blogPosts } from "@/data/blog";

export default function ArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <Container className="py-20 text-center">
        <h1 className="text-3xl font-bold font-heading">Article introuvable</h1>
        <p className="mt-4 text-text-secondary">
          Désolé, cet article n&apos;existe pas ou a été déplacé.
        </p>
        <Link href="/blog" className="mt-8 inline-block">
          <Button>Retour au blog</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-12">
      <nav className="flex items-center gap-2 text-sm text-text-secondary mb-8">
        <Link href="/" className="hover:text-primary">Accueil</Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-primary">Blog</Link>
        <span>/</span>
        <span className="text-text font-medium">{post.title}</span>
      </nav>

      <Link
        href="/blog"
        className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-primary transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" /> Retour aux articles
      </Link>

      <article className="max-w-3xl mx-auto">
        <header className="mb-10">
          <div className="flex items-center gap-3 text-sm text-text-secondary mb-4">
            <span className="rounded-full bg-primary/10 text-primary px-3 py-1 font-medium">
              {post.category}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(post.date).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span>{post.readingTime}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-heading">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-text-secondary">{post.excerpt}</p>
        </header>

        <div className="prose prose-lg max-w-none">
          {post.content.map((block, i) => {
            switch (block.type) {
              case "paragraph":
                return (
                  <p key={i} className="text-text-secondary leading-relaxed mb-5">
                    {block.text}
                  </p>
                );
              case "heading":
                const Tag = block.level === 2 ? "h2" : "h3";
                const hClass =
                  block.level === 2
                    ? "text-2xl font-bold font-heading mt-10 mb-4"
                    : "text-xl font-bold font-heading mt-8 mb-3";
                return (
                  <Tag key={i} className={hClass}>
                    {block.text}
                  </Tag>
                );
              case "list":
                const ListTag = block.ordered ? "ol" : "ul";
                return (
                  <ListTag
                    key={i}
                    className={`mb-5 space-y-2 ${block.ordered ? "list-decimal" : "list-disc"} pl-6 text-text-secondary`}
                  >
                    {block.items.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ListTag>
                );
              case "cta":
                return (
                  <div key={i} className="my-8 rounded-lg bg-primary/5 border border-primary/20 p-6 text-center">
                    <Link href={block.href}>
                      <Button size="lg">{block.label}</Button>
                    </Link>
                  </div>
                );
              default:
                return null;
            }
          })}
        </div>

        {/* Article suivant / précédent */}
        <div className="mt-16 pt-8 border-t border-border">
          <div className="flex justify-between">
            {(() => {
              const idx = blogPosts.findIndex((p) => p.slug === slug);
              const prev = idx > 0 ? blogPosts[idx - 1] : null;
              const next = idx < blogPosts.length - 1 ? blogPosts[idx + 1] : null;
              return (
                <>
                  {prev ? (
                    <Link
                      href={`/blog/${prev.slug}`}
                      className="group max-w-[45%]"
                    >
                      <span className="text-xs text-text-secondary">Article précédent</span>
                      <p className="mt-1 text-sm font-medium group-hover:text-primary transition-colors">
                        ← {prev.title}
                      </p>
                    </Link>
                  ) : (
                    <div />
                  )}
                  {next ? (
                    <Link
                      href={`/blog/${next.slug}`}
                      className="group max-w-[45%] text-right"
                    >
                      <span className="text-xs text-text-secondary">Article suivant</span>
                      <p className="mt-1 text-sm font-medium group-hover:text-primary transition-colors">
                        {next.title} →
                      </p>
                    </Link>
                  ) : (
                    <div />
                  )}
                </>
              );
            })()}
          </div>
        </div>
      </article>
    </Container>
  );
}
