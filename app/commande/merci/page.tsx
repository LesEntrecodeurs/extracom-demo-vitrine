'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useDocument } from '@extracom/site-kit/react';
import { formatPrice, formatDate } from '@extracom/site-kit';
import { PageLoader } from '@/components/site/Loader';

// Codes type Sage (cf. tabs de l'historique).
const TYPE_LABELS: Record<string, string> = {
  '0': 'Devis',
  '1': 'Commande'
};

export default function MerciPage() {
  const params = useSearchParams();
  const ref = params.get('ref') ?? '';
  const type = params.get('type') ?? '';
  // 'created' = bon de commande Sage déjà visible dans l'historique,
  // 'quote' = devis, 'submitted' = soumise à validation commerciale (pas de
  // document Sage disponible → pas de récap détaillé).
  const status = params.get('status') ?? 'created';

  // Détail du document Sage pour le récap (uniquement quand il existe).
  const needsDoc = status !== 'submitted' && ref && type;
  const { data: doc, isLoading: docLoading } = useDocument(
    ref,
    needsDoc ? type : undefined
  );

  // Titre / sous-titre selon le cas rencontré en sortie de tunnel.
  const headline =
    status === 'quote'
      ? 'Votre devis a bien été créé'
      : status === 'submitted'
        ? 'Votre demande a été envoyée'
        : 'Merci pour votre commande';
  const subtitle =
    status === 'quote'
      ? 'Vous le retrouvez dès maintenant dans votre historique.'
      : status === 'submitted'
        ? 'Elle sera traitée par notre équipe commerciale dans les plus brefs délais.'
        : 'Votre commande est enregistrée. Vous recevrez un suivi par e-mail.';

  return (
    <div className="mx-auto max-w-xl">
      <header className="reveal text-center">
        <div
          aria-hidden
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--brand-light)] text-2xl text-[var(--brand-dark)]"
        >
          ✓
        </div>
        <h1 className="text-2xl font-semibold">{headline}</h1>
        <p className="mt-2 text-sm text-neutral-600">{subtitle}</p>
      </header>

      {/* Numéro de commande bien visible (référence Sage). */}
      {ref && (
        <section className="card reveal reveal-1 mt-6 p-5 text-center">
          <p className="text-xs uppercase tracking-wide text-neutral-500">
            {TYPE_LABELS[type] ?? 'Référence'}
          </p>
          <p className="mt-1 font-mono text-xl font-semibold text-[var(--brand-dark)]">
            {ref}
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            Conservez cette référence pour toute question.
          </p>
        </section>
      )}

      {/* Récap détaillé (lignes, totaux, livraison) — uniquement si le document
          Sage existe (cas 'created' / 'quote'). */}
      {needsDoc && (
        <section className="reveal reveal-2 mt-6">
          {docLoading ? (
            <PageLoader label="Chargement du récap…" />
          ) : doc ? (
            <div className="card p-5">
              <div className="flex items-baseline justify-between text-sm text-neutral-500">
                <span>{doc.type ?? TYPE_LABELS[type]}</span>
                <span>{formatDate(doc.date)}</span>
              </div>

              {doc.deliveryAddress && (
                <p className="mt-3 text-sm">
                  <span className="text-neutral-500">Livraison : </span>
                  {doc.deliveryAddress}
                </p>
              )}

              <ul className="mt-4 divide-y divide-neutral-100 text-sm">
                {doc.lines.map((l, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: référence produit non garantie unique
                  <li
                    key={`${l.reference}-${i}`}
                    className="flex justify-between py-2"
                  >
                    <span>
                      {l.label ?? l.reference}
                      {l.variantLabel ? ` — ${l.variantLabel}` : ''} ×{' '}
                      {l.quantity}
                    </span>
                    <span className="font-medium">
                      {formatPrice(l.lineTotalInclVat ?? null)}
                    </span>
                  </li>
                ))}
              </ul>

              <dl className="mt-3 space-y-1 border-t border-neutral-100 pt-3 text-sm">
                {doc.totalExclVat != null && (
                  <div className="flex justify-between">
                    <dt className="text-neutral-500">Total HT</dt>
                    <dd>{formatPrice(doc.totalExclVat)}</dd>
                  </div>
                )}
                {doc.totalVat != null && (
                  <div className="flex justify-between">
                    <dt className="text-neutral-500">TVA</dt>
                    <dd>{formatPrice(doc.totalVat)}</dd>
                  </div>
                )}
                <div className="flex justify-between pt-1 text-lg font-semibold">
                  <dt>Total TTC</dt>
                  <dd>{formatPrice(doc.totalInclVat ?? null)}</dd>
                </div>
              </dl>
            </div>
          ) : (
            <p className="text-sm text-neutral-500">
              Le détail n'a pas pu être chargé. Vous le retrouverez dans votre
              historique.
            </p>
          )}
        </section>
      )}

      {/* Actions de fin de parcours. */}
      <div className="reveal reveal-3 mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link href="/compte/commandes" className="btn-primary">
          Voir mes commandes
        </Link>
        <Link href="/catalogue" className="btn-outline">
          Continuer mes achats
        </Link>
      </div>

      {/* Mention d'assistance — utile pour les questions de suivi. */}
      <p className="reveal reveal-4 mt-8 text-center text-xs text-neutral-500">
        Une question ? Contactez-nous via la page{' '}
        <Link
          href="/contact"
          className="text-[var(--brand-dark)] underline-offset-2 hover:underline"
        >
          Contact
        </Link>{' '}
        en indiquant votre référence.
      </p>
    </div>
  );
}