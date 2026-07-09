import Link from 'next/link';
import { getDocumentsAction, meAction } from '@extracom/site-kit/server';

export const dynamic = 'force-dynamic';

export default async function RetourPaiementPage({
  searchParams
}: {
  searchParams: Promise<{ paymentStatus?: string }>;
}) {
  const { paymentStatus } = await searchParams;
  const success = paymentStatus === 'success';

  // Sur paiement réussi : on récupère la commande la plus récente du client
  // pour afficher son numéro. Le prestataire de paiement ne transmet pas la
  // référence, mais la commande existe dans l'historique juste après le
  // paiement (côté serveur Extracom). Fallback silencieux si indisponible.
  let orderRef: string | null = null;
  if (success) {
    try {
      const user = await meAction();
      if (user) {
        const docs = await getDocumentsAction({ type: 1, limit: 1 });
        const first = docs?.data?.[0];
        if (first?.reference) orderRef = first.reference;
      }
    } catch {
      orderRef = null;
    }
  }

  return (
    <div className="mx-auto max-w-lg py-12">
      <div className="card p-10 text-center">
        <div
          className={`mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full text-3xl ${
            success
              ? 'bg-[var(--brand-light)] text-[var(--brand-dark)]'
              : 'bg-neutral-100 text-neutral-500'
          }`}
        >
          {success ? '✓' : '×'}
        </div>

        <h1 className="text-2xl font-semibold">
          {success ? 'Paiement confirmé' : 'Paiement non abouti'}
        </h1>

        {success ? (
          orderRef ? (
            <>
              <p className="mt-2 text-sm text-neutral-600">
                Merci ! Votre commande est enregistrée.
              </p>
              <div className="mx-auto mt-6 inline-flex flex-col items-center gap-1 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-8 py-4">
                <span className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                  Numéro de commande
                </span>
                <span className="font-mono text-2xl font-semibold text-neutral-900">
                  {orderRef}
                </span>
              </div>
              <p className="mt-6 text-sm text-neutral-600">
                Un email de confirmation vous a été envoyé. Vous retrouverez
                cette commande dans votre espace.
              </p>
            </>
          ) : (
            <p className="mt-2 text-sm text-neutral-600">
              Votre commande a bien été enregistrée. Vous la retrouverez dans
              votre espace client.
            </p>
          )
        ) : (
          <p className="mt-2 text-sm text-neutral-600">
            Le paiement a échoué ou a été annulé. Vous pouvez réessayer depuis
            votre panier.
          </p>
        )}

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {success ? (
            <>
              <Link
                href={orderRef ? `/compte/commandes/${encodeURIComponent(orderRef)}?type=1` : '/compte/commandes'}
                className="btn-primary"
              >
                Voir ma commande
              </Link>
              <Link href="/catalogue" className="btn-outline">
                Continuer mes achats
              </Link>
            </>
          ) : (
            <Link href="/panier" className="btn-primary">
              Retour au panier
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}