import Link from 'next/link';
import {
  ShoppingCart,
  ReceiptText,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import {
  formatPrice,
  type Cart,
  type DocumentSummary,
  type User
} from '@extracom/site-kit';

type Props = {
  user: User;
  cart: Cart | null;
  documents: DocumentSummary[];
  canViewDocuments: boolean;
};

export function UserDashboard({
  user,
  cart,
  documents,
  canViewDocuments
}: Props) {
  const firstName = user.name?.split(' ')[0] ?? '';
  const itemCount =
    cart?.lines?.reduce((n, l) => n + (l.quantity ?? 0), 0) ?? 0;
  const total = cart?.totals?.totalInclVat ?? null;
  const currency = cart?.currency ?? 'EUR';

  return (
    <section className="space-y-4">
      <div className="card flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="rounded-xl bg-[var(--brand-light)]/40 p-2.5 text-[var(--brand-dark)]">
            <Sparkles className="size-5" />
          </span>
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-[var(--brand-dark)] uppercase">
              Mon espace
            </p>
            <h2 className="mt-1 text-2xl font-semibold leading-tight md:text-3xl">
              Bonjour {firstName || 'à vous'}
              <span className="block text-base font-normal text-neutral-500 sm:inline sm:ml-2">
                bon retour parmi nous.
              </span>
            </h2>
          </div>
        </div>
        <Link
          href="/compte"
          className="text-sm font-medium text-[var(--brand-dark)] hover:underline"
        >
          Ouvrir mon compte →
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card flex h-full flex-col p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="rounded-xl bg-[var(--brand-light)]/40 p-2.5 text-[var(--brand-dark)]">
              <ShoppingCart className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium">Mon panier</p>
              {itemCount > 0 ? (
                <p className="mt-1 text-sm text-neutral-600">
                  {itemCount} article{itemCount > 1 ? 's' : ''} en cours
                  {total !== null ? (
                    <>
                      {' '}·{' '}
                      <span className="font-medium text-neutral-800">
                        {formatPrice(total, currency)}
                      </span>
                    </>
                  ) : null}
                </p>
              ) : (
                <p className="mt-1 text-sm text-neutral-500">
                  Aucun article pour le moment.
                </p>
              )}
            </div>
          </div>
          <Link
            href="/panier"
            className="btn-outline mt-5 inline-flex w-fit items-center gap-1.5"
          >
            {itemCount > 0 ? 'Reprendre mon panier' : 'Voir mon panier'}
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {canViewDocuments && (
          <div className="card flex h-full flex-col p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <span className="rounded-xl bg-[var(--brand-light)]/40 p-2.5 text-[var(--brand-dark)]">
                <ReceiptText className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium">Mes dernières commandes</p>
                {documents.length > 0 ? (
                  <ul className="mt-2 space-y-1.5 text-sm text-neutral-600">
                    {documents.map((d) => (
                      <li
                        key={d.id}
                        className="flex items-center justify-between gap-2"
                      >
                        <span className="min-w-0 truncate">
                          <span className="font-medium text-neutral-800">
                            {d.reference}
                          </span>{' '}
                          ·{' '}
                          <time dateTime={d.date}>
                            {new Date(d.date).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </time>
                        </span>
                        {d.totalInclVat != null && (
                          <span className="shrink-0 text-neutral-500">
                            {formatPrice(d.totalInclVat)}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1 text-sm text-neutral-500">
                    Aucune commande pour l'instant.
                  </p>
                )}
              </div>
            </div>
            <Link
              href="/compte/commandes"
              className="btn-outline mt-5 inline-flex w-fit items-center gap-1.5"
            >
              Voir tout
              <ArrowRight className="size-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
