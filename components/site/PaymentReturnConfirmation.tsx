'use client';

import Link from 'next/link';
import { useDocuments } from '@extracom/site-kit/react';

/**
 * Bloc affiché au retour du prestataire de paiement.
 *
 * Le prestataire ne transmet pas la référence de commande dans l'URL — on
 * récupère donc la commande la plus récente du client via l'historique pour
 * l'afficher en évidence. Si l'API n'a pas encore indexé la commande
 * (quelques secondes de latence possibles), on tombe sur un message de
 * transition avec un lien vers l'historique complet.
 */
export function PaymentReturnConfirmation({ success }: { success: boolean }) {
  const { data, isLoading } = useDocuments({ limit: 1 });
  const latest = data?.data?.[0];

  if (!success) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-2xl font-bold">Paiement non abouti</h1>
        <p className="mt-4 text-neutral-600">
          Le paiement a échoué ou a été annulé. Votre panier a été conservé.
        </p>
        <Link
          href="/panier"
          className="mt-8 inline-block rounded bg-[var(--brand)] px-6 py-3 text-white"
        >
          Retour au panier
        </Link>
      </div>
    );
  }

  return (
    <div className="py-16 text-center">
      <h1 className="text-2xl font-bold">Paiement réussi ✓</h1>

      {latest ? (
        <>
          <p className="mt-4 text-neutral-600">
            Merci ! Votre commande est enregistrée.
          </p>
          <div className="mx-auto mt-6 inline-block rounded-lg border border-[var(--brand)] bg-[var(--brand-light)] px-6 py-4">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--brand-dark)]">
              Numéro de commande
            </p>
            <p className="mt-1 font-mono text-3xl font-bold text-[var(--brand-dark)]">
              {latest.reference}
            </p>
          </div>
          <p className="mt-6 text-sm text-neutral-600">
            Conservez cette référence pour suivre votre commande.
          </p>
        </>
      ) : (
        <p className="mt-4 text-neutral-600">
          {isLoading
            ? 'Nous finalisons l'enregistrement de votre commande…'
            : 'Votre commande est enregistrée. Elle apparaît dans quelques instants dans votre historique.'}
        </p>
      )}

      <div className="mt-8 flex justify-center gap-3">
        <Link
          href="/compte/commandes"
          className="rounded bg-[var(--brand)] px-6 py-3 text-white"
        >
          Voir mes commandes
        </Link>
        <Link
          href="/catalogue"
          className="rounded border border-[var(--brand)] px-6 py-3 text-[var(--brand-dark)]"
        >
          Continuer mes achats
        </Link>
      </div>
    </div>
  );
}