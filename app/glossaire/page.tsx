"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Search } from "lucide-react";
import { useState } from "react";
import { glossaryEntries } from "@/data/glossary";

export default function GlossairePage() {
  const [search, setSearch] = useState("");

  const filtered = glossaryEntries.filter(
    (e) =>
      e.term.toLowerCase().includes(search.toLowerCase()) ||
      e.definition.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container className="py-12">
      <nav className="flex items-center gap-2 text-sm text-text-secondary mb-8">
        <Link href="/" className="hover:text-primary">Accueil</Link>
        <span>/</span>
        <span className="text-text font-medium">Glossaire</span>
      </nav>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold font-heading mb-4">Glossaire du nettoyage professionnel</h1>
        <p className="text-lg text-text-secondary mb-8">
          Retrouvez les définitions des principaux termes techniques du matériel de nettoyage
          professionnel.
        </p>

        <div className="relative mb-10">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder="Rechercher un terme..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg font-medium">Aucun terme trouvé</p>
            <p className="text-text-secondary mt-2">Essayez une autre recherche.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filtered.map((entry) => (
              <div
                key={entry.slug}
                className="rounded-lg border border-border bg-white p-6"
              >
                <h2 className="text-xl font-bold font-heading">{entry.term}</h2>
                <p className="mt-2 font-medium text-text-secondary">{entry.definition}</p>
                <p className="mt-3 text-text-secondary">{entry.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
