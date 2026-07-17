"use client";

import { Suspense, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, ChevronRight, Loader2, ArrowLeft, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/ui/ProductCard";
import { useAuth, useArticles, useShopContext } from "@extracom/site-kit/react";
import type { CatalogNode, Family } from "@extracom/site-kit";

/* ─── Utilities ─── */

function findNode(tree: CatalogNode[], id: number): CatalogNode | null {
  for (const n of tree) {
    if (n.id === id) return n;
    if (n.children) {
      const found = findNode(n.children, id);
      if (found) return found;
    }
  }
  return null;
}

function getNodePath(
  tree: CatalogNode[],
  targetId: number,
  parents: CatalogNode[] = [],
): CatalogNode[] | null {
  for (const n of tree) {
    if (n.id === targetId) return [...parents, n];
    if (n.children) {
      const found = getNodePath(n.children, targetId, [...parents, n]);
      if (found) return found;
    }
  }
  return null;
}

/* ─── Breadcrumb ─── */

function Breadcrumb({ path }: { path: CatalogNode[] | null }) {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-text-secondary/50 mb-6">
      <Link href="/" className="hover:text-text transition-colors">Accueil</Link>
      <ChevronRight className="h-3 w-3" />
      {path ? (
        <>
          <Link href="/catalogue" className="hover:text-text transition-colors">Catalogue</Link>
          {path.map((p, i) => (
            <span key={p.id} className="flex items-center gap-1.5">
              <ChevronRight className="h-3 w-3" />
              {i < path.length - 1 ? (
                <Link
                  href={`/catalogue?node=${p.id}&level=${p.level}`}
                  className="hover:text-text transition-colors"
                >
                  {p.label}
                </Link>
              ) : (
                <span className="text-text font-medium">{p.label}</span>
              )}
            </span>
          ))}
        </>
      ) : (
        <span className="text-text font-medium">Catalogue</span>
      )}
    </nav>
  );
}

/* ─── Header ─── */

function CatalogueHeader() {
  const { user } = useAuth();
  const { data: shopContext } = useShopContext();
  const searchParams = useSearchParams();
  const nodeId = searchParams.get("node") ? Number(searchParams.get("node")) : null;
  const node = nodeId && shopContext?.catalogTree
    ? findNode(shopContext.catalogTree, nodeId)
    : null;
  const path = nodeId && shopContext?.catalogTree
    ? getNodePath(shopContext.catalogTree, nodeId)
    : null;

  const isSearching = !!searchParams.get("q");

  return (
    <div className="pt-12 pb-6">
      <Container>
        <Breadcrumb path={path} />
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-heading tracking-tight">
              {isSearching ? "Résultats de recherche" : node ? node.label : "Catalogue"}
            </h1>
            {!node && !isSearching && (
              <p className="mt-2 text-text-secondary/60 max-w-xl">
                Parcourez nos gammes de matériel et produits de nettoyage professionnel.
              </p>
            )}
          </div>
          {!user && (
            <div className="hidden sm:block shrink-0 rounded-lg border border-border/50 bg-white px-4 py-2.5 text-sm text-text-secondary shadow-xs">
              <Link href="/connexion" className="font-medium text-primary hover:underline">
                Connectez-vous
              </Link> pour voir vos tarifs
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

/* ─── Barre de recherche ─── */

function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [input, setInput] = useState(searchParams.get("q") || "");

  const handle = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (input.trim()) {
      params.set("q", input.trim());
    } else {
      params.delete("q");
    }
    router.push(`/catalogue?${params.toString()}`);
  }, [input, searchParams, router]);

  return (
    <div className="border-b border-border/40">
      <Container className="py-3">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary/40" />
          <input
            type="text"
            placeholder="Rechercher un produit…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handle(); }}
            className="w-full rounded-lg border border-border/50 bg-white py-2.5 pl-10 pr-10 text-sm placeholder:text-text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/40 transition-all"
          />
          {input && (
            <button
              onClick={() => { setInput(""); router.push("/catalogue"); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary/40 hover:text-text-secondary transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </Container>
    </div>
  );
}

/* ─── Navigation par sous-catégories ─── */

function SubcategoryGrid({ nodes }: { nodes: CatalogNode[] }) {
  if (nodes.length === 0) return null;

  return (
    <Container className="py-8">
      <p className="text-xs font-medium text-text-secondary/40 tracking-wider uppercase mb-5">
        Sous-catégories
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {nodes.map((n) => {
          const childCount = n.children?.length ?? 0;
          return (
            <Link
              key={n.id}
              href={`/catalogue?node=${n.id}&level=${n.level}`}
              className="group relative rounded-lg border border-border/40 bg-white px-5 py-4 transition-all duration-200 hover:border-border/80 hover:shadow-xs"
            >
              <span className="text-sm font-medium text-text group-hover:text-primary transition-colors">
                {n.label}
              </span>
              {childCount > 0 && (
                <span className="mt-1 block text-xs text-text-secondary/40">
                  {childCount} sous-catégorie{childCount > 1 ? "s" : ""}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </Container>
  );
}

/* ─── Filtre familles ─── */

function FamilyFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: shopContext } = useShopContext();
  const families = shopContext?.families ?? [];
  const currentFamille = searchParams.get("famille") || "";

  if (families.length === 0) return null;

  return (
    <div className="border-b border-border/40">
      <Container className="py-4">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => { const p = new URLSearchParams(searchParams.toString()); p.delete("famille"); router.push(`/catalogue?${p.toString()}`); }}
            className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
              !currentFamille
                ? "bg-primary text-white"
                : "bg-white text-text-secondary/60 border border-border/40 hover:border-border/60 hover:text-text"
            }`}
          >
            Tous
          </button>
          {families.map((f: Family) => (
            <button
              key={f.code}
              onClick={() => { const p = new URLSearchParams(searchParams.toString()); p.set("famille", f.code); router.push(`/catalogue?${p.toString()}`); }}
              className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                currentFamille === f.code
                  ? "bg-primary text-white"
                  : "bg-white text-text-secondary/60 border border-border/40 hover:border-border/60 hover:text-text"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </Container>
    </div>
  );
}

/* ─── Grille produits ─── */

function ProductGrid() {
  const searchParams = useSearchParams();
  const nodeId = searchParams.get("node") ? Number(searchParams.get("node")) : undefined;
  const level = searchParams.get("level") ? Number(searchParams.get("level")) : undefined;
  const famille = searchParams.get("famille") || "";
  const search = searchParams.get("q") || "";
  const { data: shopContext } = useShopContext();

  const currentNode = useMemo(() => {
    if (!nodeId || !shopContext?.catalogTree) return null;
    return findNode(shopContext.catalogTree, nodeId);
  }, [nodeId, shopContext?.catalogTree]);

  const hasChildren = (currentNode?.children?.length ?? 0) > 0;

  // Si on est sur une catégorie qui a des sous-catégories (et pas de filtre actif), afficher les sous-catégories
  if (hasChildren && !search && !famille) {
    return null; // CategoryNavigation gère via l'affichage des sous-catégories
  }

  // Déterminer s'il faut charger les produits
  const shouldLoadProducts = !hasChildren || !!search || !!famille;

  const query = useMemo(() => ({
    ...(nodeId && shouldLoadProducts ? { catalogId: nodeId, catalogLevel: level ?? 1 } : {}),
    ...(famille ? { familyCode: famille } : {}),
    ...(search ? { search } : {}),
    limit: 48,
  }), [nodeId, level, famille, search, shouldLoadProducts]);

  const { data, isLoading, error } = useArticles(
    shouldLoadProducts || !!search || !!famille ? query : { limit: 0 }
  );
  const articles = data?.data || [];
  const total = data?.pagination?.total || 0;

  const families = shopContext?.families || [];
  const getFamilyLabel = (code?: string) => {
    const f = families.find((fm) => fm.code === code);
    return f?.label || code || "";
  };

  if (isLoading) {
    return (
      <Container className="py-20">
        <div className="flex items-center justify-center gap-2 text-text-secondary/50">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Chargement…</span>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-20">
        <div className="text-center">
          <p className="font-medium text-red-500">Erreur de chargement</p>
          <p className="mt-1 text-sm text-text-secondary/60">Impossible de charger le catalogue pour le moment.</p>
          <Link href="/catalogue">
            <Button variant="secondary" className="mt-4">Réessayer</Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      {articles.length === 0 ? (
        <div className="text-center py-20">
          <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-surface-secondary">
            <Search className="h-4 w-4 text-text-secondary/50" />
          </div>
          <p className="font-medium text-text">Aucun produit trouvé</p>
          <p className="mt-1 text-sm text-text-secondary/60">Essayez de modifier votre recherche ou parcourez une autre catégorie.</p>
          <Link href="/catalogue">
            <Button variant="secondary" className="mt-4">Voir tout le catalogue</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs text-text-secondary/50">{total} produit{total > 1 ? "s" : ""}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {articles.map((article) => (
              <ProductCard
                key={article.reference}
                reference={article.reference}
                name={article.title}
                category={getFamilyLabel(article.family?.code)}
                price={article.price}
                imageUrl={article.imageUrl}
              />
            ))}
          </div>
        </>
      )}
    </Container>
  );
}

/* ─── Contenu principal ─── */

function CatalogueContent() {
  const searchParams = useSearchParams();
  const { data: shopContext } = useShopContext();
  const nodeId = searchParams.get("node") ? Number(searchParams.get("node")) : null;
  const search = searchParams.get("q") || "";
  const famille = searchParams.get("famille") || "";

  const currentNode = nodeId && shopContext?.catalogTree
    ? findNode(shopContext.catalogTree, nodeId)
    : null;
  const hasChildren = (currentNode?.children?.length ?? 0) > 0;
  const showSubcategories = hasChildren && !search && !famille;

  return (
    <>
      <CatalogueHeader />
      <SearchBar />
      <FamilyFilter />
      {showSubcategories && currentNode?.children ? (
        <SubcategoryGrid nodes={currentNode.children} />
      ) : null}
      <ProductGrid />
    </>
  );
}

export default function CataloguePage() {
  return (
    <Suspense fallback={<Container className="py-20"><div className="text-center text-text-secondary/50 text-sm">Chargement…</div></Container>}>
      <CatalogueContent />
    </Suspense>
  );
}
