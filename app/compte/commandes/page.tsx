"use client";

import { useState } from "react";
import { useAuth, useDocuments } from "@extracom/site-kit/react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, Package, ChevronRight, Search } from "lucide-react";

function CompteLayout({ children }: { children: React.ReactNode }) {
  const links = [
    { label: "Mes commandes", href: "/compte/commandes" },
    { label: "Mes adresses", href: "/compte/adresses" },
    { label: "Mon profil", href: "/compte/profil" },
  ];

  return (
    <Container className="py-12">
      <h1 className="text-3xl font-bold font-heading mb-8">Mon compte</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-56 shrink-0">
          <nav className="space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-md px-3 py-2 text-sm font-medium text-text-secondary hover:bg-surface-secondary hover:text-text transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </Container>
  );
}

function CommandesContent() {
  const { user, isLoading: authLoading } = useAuth();
  const { data, isLoading, error } = useDocuments();
  const [search, setSearch] = useState("");

  if (authLoading || isLoading) {
    return (
      <CompteLayout>
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 bg-surface-secondary rounded-lg" />
          ))}
        </div>
      </CompteLayout>
    );
  }

  if (!user) {
    return (
      <CompteLayout>
        <div className="text-center py-12">
          <p className="text-lg font-medium">Connectez-vous pour voir vos commandes</p>
          <Link href="/connexion">
            <Button className="mt-4">Se connecter</Button>
          </Link>
        </div>
      </CompteLayout>
    );
  }

  const documents = data?.data || [];
  const filtered = search
    ? documents.filter((d: any) =>
        d.reference?.toLowerCase().includes(search.toLowerCase())
      )
    : documents;

  return (
    <CompteLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold font-heading">Mes commandes</h2>
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
        <input
          type="text"
          placeholder="Rechercher une commande…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-lg">
          <Package className="mx-auto h-12 w-12 text-text-secondary mb-4" />
          <p className="font-medium">Aucune commande trouvée</p>
          <p className="mt-2 text-sm text-text-secondary">
            {search ? "Essayez un autre terme." : "Vous n'avez pas encore passé de commande."}
          </p>
          {!search && (
            <Link href="/catalogue">
              <Button variant="secondary" className="mt-4">Découvrir le catalogue</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((doc: any) => (
            <Link
              key={doc.id || doc.reference}
              href={`/compte/commandes/${doc.reference}`}
              className="block rounded-lg border border-border p-4 transition-all hover:shadow-card-hover"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{doc.reference}</p>
                  <p className="text-sm text-text-secondary mt-1">
                    {doc.date && new Date(doc.date).toLocaleDateString("fr-FR")}
                    {doc.totalInclVat != null && ` — ${doc.totalInclVat.toFixed(2)} €`}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={doc.status === "livree" ? "success" : "default"}>
                    {doc.status || "En cours"}
                  </Badge>
                  <ChevronRight className="h-4 w-4 text-text-secondary" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </CompteLayout>
  );
}

export default function CommandesPage() {
  return <CommandesContent />;
}
