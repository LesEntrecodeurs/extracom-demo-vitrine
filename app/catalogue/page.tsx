import type { Metadata } from 'next';
import { unstable_cache } from 'next/cache';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Lock,
  PackageSearch
} from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink
} from '@/components/ui/pagination';
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
import { ArticleRow } from '@/components/site/ArticleRow';
import { CatalogueFilters } from '@/components/site/CatalogueFilters';
import { InfoBanner } from '@/components/site/InfoBanner';
import { EmptyState } from '@/components/site/EmptyState';
import {
  ViewToggle,
  type CatalogueView
} from '@/components/site/ViewToggle';

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
    inStock?: string;
    view?: string;
  }>;
}) {
  const sp = await searchParams;
  const search = sp.q || undefined;
  const page = sp.page ? Math.max(1, Number(sp.page)) : 1;
  const limit = 24;
  const sort = (sp.sort as ArticleSort | undefined) || undefined;
  const minPrice = sp.pmin ? Number(sp.pmin) : undefined;
  const maxPrice = sp.pmax ? Number(sp.pmax) : undefined;
  const view: CatalogueView = sp.view === 'list' ? 'list' : 'grid';

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
    if (sp.inStock) params.set('inStock', sp.inStock);
    if (view === 'list') params.set('view', 'list');
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
        {sp.inStock && <input type="hidden" name="inStock" value={sp.inStock} />}
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
          pmax: sp.pmax,
          inStock: sp.inStock,
          view: sp.view
        }}
      />

      {total > 0 && (
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-sm text-neutral-500">
            {total} article{total > 1 ? 's' : ''}
            {activeCatalogLabel ? ` dans « ${activeCatalogLabel} »` : ''}
          </p>
          <ViewToggle
            currentView={view}
            searchParams={{
              q: sp.q,
              catalog: sp.catalog,
              clevel: sp.clevel,
              family: sp.family,
              sort: sp.sort,
              pmin: sp.pmin,
              pmax: sp.pmax,
              inStock: sp.inStock
            }}
          />
        </div>
      )}

      {res.data.length === 0 ? (
        <EmptyState
          icon={<PackageSearch className="size-8" />}
          title="Aucun article"
          description="Aucun article ne correspond à votre recherche. Essayez d'autres filtres."
          action={{ label: 'Réinitialiser', href: '/catalogue' }}
        />
      ) : view === 'list' ? (
        <div className="flex flex-col gap-2">
          {res.data.map((a) => (
            <ArticleRow key={a.reference} article={a} />
          ))}
        </div>
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
              <PaginationLink
                href={pageHref(Math.max(1, page - 1))}
                size="default"
                aria-label="Page précédente"
                className={
                  page === 1
                    ? 'pointer-events-none gap-1 px-2.5 opacity-50 sm:pl-2.5'
                    : 'gap-1 px-2.5 sm:pl-2.5'
                }
              >
                <ChevronLeftIcon />
                <span className="hidden sm:block">Précédent</span>
              </PaginationLink>
            </PaginationItem>
            {buildPageList(page, totalPages).map((p, i) =>
              p === '…' ? (
                <PaginationItem key={`ellipsis-${i}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={p}>
                  <PaginationLink
                    href={pageHref(p)}
                    isActive={p === page}
                    aria-label={`Page ${p}`}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              )
            )}
            <PaginationItem>
              <PaginationLink
                href={pageHref(Math.min(totalPages, page + 1))}
                size="default"
                aria-label="Page suivante"
                className={
                  page === totalPages
                    ? 'pointer-events-none gap-1 px-2.5 opacity-50 sm:pr-2.5'
                    : 'gap-1 px-2.5 sm:pr-2.5'
                }
              >
                <span className="hidden sm:block">Suivant</span>
                <ChevronRightIcon />
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

/** Construit la liste des boutons à afficher (1, …, courant-1, courant,
 *  courant+1, …, dernière) en remplaçant les trous par "…". */
function buildPageList(current: number, total: number): (number | '…')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: (number | '…')[] = [1];
  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);
  if (left > 2) pages.push('…');
  for (let i = left; i <= right; i += 1) pages.push(i);
  if (right < total - 1) pages.push('…');
  pages.push(total);
  return pages;
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
