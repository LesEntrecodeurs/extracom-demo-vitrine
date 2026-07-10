import Link from 'next/link';
import {
  formatPrice,
  formatDate,
  type Article,
  type DocumentSummary
} from '@extracom/site-kit';
import { ArrowRight, FileText, Receipt } from 'lucide-react';
import { ArticleCard } from './ArticleCard';
import { ReorderButton } from './ReorderButton';

interface Props {
  /** 3 dernières commandes (type=1), les plus récentes en premier. */
  recentOrders: DocumentSummary[];
  /** 3 derniers devis (type=0), les plus récents en premier. */
  recentQuotes: DocumentSummary[];
  /** Produits de la dernière commande, avec leur fiche article résolue. */
  usualProducts: { article: Article; quantity: number }[];
  /** Référence de la dernière commande — sert au bouton « Tout recommander ». */
  lastOrderReference: string | null;
}

/**
 * Raccourcis visibles uniquement pour les clients connectés : dernières
 * commandes, devis en cours, produits habituels + bouton « Tout recommander ».
 * Rendu serveur (les données viennent de `app/page.tsx`), sauf le bouton de
 * reorder (client → appel `useCart().reorder`).
 */
export function ClientShortcuts({
  recentOrders,
  recentQuotes,
  usualProducts,
  lastOrderReference
}: Props) {
  const hasOrders = recentOrders.length > 0;
  const hasQuotes = recentQuotes.length > 0;
  const hasUsual = usualProducts.length > 0;

  // Si le client n'a encore rien (ni commandes ni devis), on ne rend rien —
  // le reste de la page (sélection, catégories) suffit.
  if (!hasOrders && !hasQuotes && !hasUsual) return null;

  return (
    <div className="space-y-12">
      {/* Raccourcis commandes / devis — 2 cartes côte à côte. */}
      {(hasOrders || hasQuotes) && (
        <section>
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-xl font-semibold">Vos raccourcis</h2>
            <Link
              href="/compte/commandes"
              className="text-sm text-[var(--brand-dark)] hover:underline"
            >
              Tout l'historique →
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <ShortcutCard
              title="Vos dernières commandes"
              icon={<Receipt className="size-4" />}
              emptyLabel="Aucune commande pour le moment."
              docs={recentOrders}
              emptyHref={{ label: 'Parcourir le catalogue', href: '/catalogue' }}
            />
            <ShortcutCard
              title="Vos devis en cours"
              icon={<FileText className="size-4" />}
              emptyLabel="Aucun devis en cours."
              docs={recentQuotes}
            />
          </div>
        </section>
      )}

      {/* Produits habituels — issus de la dernière commande. */}
      {hasUsual && lastOrderReference && (
        <section>
          <div className="mb-1 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">Vos produits habituels</h2>
              <p className="mt-1 text-sm text-neutral-500">
                Basé sur votre dernière commande — un clic pour la relancer.
              </p>
            </div>
            <ReorderButton orderReference={lastOrderReference} />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {usualProducts.map(({ article }) => (
              <ArticleCard key={article.reference} article={article} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

/**
 * Une carte raccourci : titre + icône + 3 lignes (réf/date/total) + lien «
 * Tout voir ». Utilisée pour les commandes récentes et les devis en cours.
 */
function ShortcutCard({
  title,
  icon,
  docs,
  emptyLabel,
  emptyHref
}: {
  title: string;
  icon: React.ReactNode;
  docs: DocumentSummary[];
  emptyLabel: string;
  emptyHref?: { label: string; href: string };
}) {
  return (
    <div className="card flex flex-col p-5">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-neutral-700">
        <span className="text-[var(--brand)]">{icon}</span>
        {title}
      </div>
      {docs.length === 0 ? (
        <div className="flex flex-1 flex-col items-start justify-center gap-2 py-2">
          <p className="text-sm text-neutral-500">{emptyLabel}</p>
          {emptyHref && (
            <Link
              href={emptyHref.href}
              className="inline-flex items-center gap-1 text-sm font-medium text-[var(--brand-dark)] hover:underline"
            >
              {emptyHref.label} <ArrowRight className="size-3.5" />
            </Link>
          )}
        </div>
      ) : (
        <ul className="divide-y divide-neutral-100">
          {docs.map((d) => (
            <li key={d.id}>
              <Link
                href={`/compte/commandes/${encodeURIComponent(d.id)}${
                  d.typeCode != null ? `?type=${d.typeCode}` : ''
                }`}
                className="flex items-center justify-between gap-3 py-2.5 hover:bg-neutral-50/60"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{d.reference}</p>
                  <p className="text-xs text-neutral-500">
                    {formatDate(d.date)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {d.status && (
                    <span className="hidden rounded-full bg-[var(--brand-light)] px-2 py-0.5 text-[10px] font-medium text-[var(--brand-dark)] sm:inline">
                      {d.status}
                    </span>
                  )}
                  <span className="text-sm font-medium">
                    {formatPrice(d.totalInclVat ?? null)}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}