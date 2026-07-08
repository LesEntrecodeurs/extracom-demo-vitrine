import type { Metadata } from 'next';
import { unstable_cache } from 'next/cache';
import { Lock, PackageSearch } from 'lucide-react';
import {
  getArticlesAction,
  getContextAction,
  meAction,
  getAnonymousArticlesAction,
  getAnonymousContextAction,
  isAuthenticatedAction
} from '@extracom/site-kit/server';
import type {
  ArticleListQuery,
  ArticleSort,
  CatalogNode
} from '@extracom/site-kit';
import { ArticleCard } from '@/components/site/ArticleCard';
import { CatalogueFilters } from '@/components/site/CatalogueFilters';
import { InfoBanner } from '@/components/site/InfoBanner';
import { EmptyState } from '@/components/site/EmptyState';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';

/**
 * Construit la liste des numéros à afficher dans la barre de pagination, avec
 * des « … » pour sauter les blocs lointains quand il y a beaucoup de pages.
 * Ex. page 50 sur 125 : 1 … 48 49 50 51 52 … 125.
 */
function buildPageNumbers(
  current: number,
  total: number
): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const out: (number | 'ellipsis')[] = [1];
  const start = Math.max(2, current - 2);
  const end = Math.min(total - 1, current + 2);
  if (start > 2) out.push('ellipsis');
  for (let i = start; i <= end; i++) out.push(i);
  if (end < total - 1) out.push('ellipsis');
  out.push(total);
  // Déduplique les numéros adjacents (sécurité si current est proche des bornes).
  const dedup: (number | 'ellipsis')[] = [];
  for (const v of out) {
    const prev = dedup[dedup.length - 1];
    if (v !== 'ellipsis' && prev === v) continue;
    dedup.push(v);
  }
  return dedup;
}

export const dynamic = 'force-dynamic';

// Cache ANONYME (SSG/ISR) : ne s'applique qu'aux visiteurs non connectés
// (prix de base/masqué, identiques pour tous) → aucun prix client n'est mis en
// cache. Les connectés passent par les actions normales (toujours frais).
const cachedAnonArticles = unstable_cache(
  (q: ArticleListQuery) => getAnonymousArticlesAction(q),
  ['catalogue-anon-articles'],
  { revalidate: 300, tags: ['catalogue'] }
);
const cachedAnonContext = unstable_cache(
  () => getAnonymousContextAction(),
  ['catalogue-anon-context'],
  { revalidate: 600, tags: ['catalogue'] }
);

export async function generateMetadata({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const q = (await searchParams).q;
  return {
    title: q ? `Recherche : ${q}` : 'Catalogue',
    description: q
      ? `Résultats pour « ${q} » dans le catalogue.`
      : 'Parcourez tout le catalogue produit.',
    alternates: { canonical: '/catalogue' }
  };
}

export default async function CataloguePage({
  searchParams
}: {
  searchParams: Promise<{
    q?: string;
    page?: string;
    catalog?: string;
    clevel?: string;
    family?: string;
    sort?: string;
    pmin?: string;
    pmax?: string;
  }>;
}) {
  const sp = await searchParams;
  const search = sp.q || undefined;
  const page = sp.page ? Math.max(1, Number(sp.page)) : 1;
  const limit = 24;
  const sort = (sp.sort as ArticleSort | undefined) || undefined;
  const minPrice = sp.pmin ? Number(sp.pmin) : undefined;
  const maxPrice = sp.pmax ? Number(sp.pmax) : undefined;

  const articlesQuery: ArticleListQuery = {
    search,
    page,
    limit,
    catalogId: sp.catalog ? Number(sp.catalog) : undefined,
    catalogLevel: sp.clevel ? Number(sp.clevel) : undefined,
    familyCode: sp.family || undefined,
    sort,
    minPrice: Number.isFinite(minPrice) ? minPrice : undefined,
    maxPrice: Number.isFinite(maxPrice) ? maxPrice : undefined
  };

  // Connecté → données FRAÎCHES (prix client). Anonyme → cache (ISR).
  const authed = await isAuthenticatedAction();
  const [res, context, user] = await Promise.all([
    authed
      ? getArticlesAction(articlesQuery)
      : cachedAnonArticles(articlesQuery),
    (authed ? getContextAction() : cachedAnonContext()).catch(() => null),
    authed ? meAction().catch(() => null) : Promise.resolve(null)
  ]);

  const families = context?.families ?? [];
  const total = res.pagination.total;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  // Libellé du catalogue actif (posé via le menu navbar) → puce dans les filtres.
  const activeCatalogId = sp.catalog ? Number(sp.catalog) : undefined;
  const activeCatalogLabel =
    activeCatalogId != null && context?.catalogTree
      ? findCatalogLabel(context.catalogTree, activeCatalogId)
      : undefined;

  const pageHref = (p: number) => {
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    if (sp.catalog) params.set('catalog', sp.catalog);
    if (sp.clevel) params.set('clevel', sp.clevel);
    if (sp.family) params.set('family', sp.family);
    if (sp.sort) params.set('sort', sp.sort);
    if (sp.pmin) params.set('pmin', sp.pmin);
    if (sp.pmax) params.set('pmax', sp.pmax);
    params.set('page', String(p));
    return `/catalogue?${params.toString()}`;
  };

  return (
    <div>
      <form className="mb-4">
        <input
          name="q"
          defaultValue={search}
          placeholder="Rechercher un article…"
          aria-label="Rechercher un article"
          className="field max-w-md"
        />
        {sp.catalog && (
          <input type="hidden" name="catalog" value={sp.catalog} />
        )}
        {sp.clevel && <input type="hidden" name="clevel" value={sp.clevel} />}
        {sp.family && <input type="hidden" name="family" value={sp.family} />}
        {sp.sort && <input type="hidden" name="sort" value={sp.sort} />}
        {sp.pmin && <input type="hidden" name="pmin" value={sp.pmin} />}
        {sp.pmax && <input type="hidden" name="pmax" value={sp.pmax} />}
      </form>

      {/* Onboarding visiteur anonyme : les tarifs s'affichent après connexion. */}
      {!user && (
        <div className="mb-4">
          <InfoBanner
            icon={<Lock className="size-4" />}
            action={{ label: 'Se connecter', href: '/connexion' }}
          >
            Connectez-vous pour voir vos tarifs négociés et passer commande.
          </InfoBanner>
        </div>
      )}

      <CatalogueFilters
        families={families}
        activeCatalogLabel={activeCatalogLabel}
        current={{
          q: search,
          family: sp.family,
          catalog: sp.catalog,
          clevel: sp.clevel,
          sort: sp.sort,
          pmin: sp.pmin,
          pmax: sp.pmax
        }}
      />

      {total > 0 && (
        <p className="mb-3 text-sm text-neutral-500">
          {total} article{total > 1 ? 's' : ''}
          {activeCatalogLabel ? ` dans « ${activeCatalogLabel} »` : ''}
        </p>
      )}

      {res.data.length === 0 ? (
        <EmptyState
          icon={<PackageSearch className="size-8" />}
          title="Aucun article"
          description="Aucun article ne correspond à votre recherche. Essayez d'autres filtres."
          action={{ label: 'Réinitialiser', href: '/catalogue' }}
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {res.data.map((a) => (
            <ArticleCard key={a.reference} article={a} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={page > 1 ? pageHref(page - 1) : undefined}
                aria-disabled={page === 1}
                className={
                  page === 1
                    ? 'pointer-events-none opacity-50'
                    : undefined
                }
              >
                <span className="hidden sm:block">Précédent</span>
              </PaginationPrevious>
            </PaginationItem>

            {buildPageNumbers(page, totalPages).map((n, i) =>
              n === 'ellipsis' ? (
                <PaginationItem key={`e-${i}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={n}>
                  <PaginationLink
                    href={pageHref(n)}
                    isActive={n === page}
                  >
                    {n}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <PaginationNext
                href={page < totalPages ? pageHref(page + 1) : undefined}
                aria-disabled={page === totalPages}
                className={
                  page === totalPages
                    ? 'pointer-events-none opacity-50'
                    : undefined
                }
              >
                <span className="hidden sm:block">Suivant</span>
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

/** Cherche récursivement le libellé d'un nœud catalogue par son id. */
function findCatalogLabel(
  nodes: CatalogNode[],
  id: number
): string | undefined {
  for (const node of nodes) {
    if (node.id === id) return node.label;
    const child = node.children
      ? findCatalogLabel(node.children, id)
      : undefined;
    if (child) return child;
  }
  return undefined;
}
