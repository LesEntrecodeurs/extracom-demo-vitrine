import Link from 'next/link';
import { getDocumentsAction } from '@extracom/site-kit/server';

export const dynamic = 'force-dynamic';

export default async function RetourPaiementPage({
  searchParams
}: {
  searchParams: Promise<{ paymentStatus?: string }>;
}) {
  const { paymentStatus } = await searchParams;
  const success = paymentStatus === 'success';

  // Le prestataire ne transmet pas la référence de commande au retour : on
  // récupère la dernière commande du client (type Sage 1 = commande) pour
  // pouvoir afficher son numéro de pièce.
  let orderReference: string | null = null;
  if (success) {
    try {
      const { data } = await getDocumentsAction({ type: 1, limit: 1 });
      orderReference = data[0]?.reference ?? null;
    } catch {
      orderReference = null;
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="card p-10 text-center">
        <div
          className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full text-2xl ${
            success
              ? 'bg-[var(--brand-light)] text-[var(--brand-dark)]'
              : 'bg-red-50 text-red-600'
          }`}
          aria-hidden
        >
          {success ? '✓' : '×'}
        </div>
        <h1 className="text-xl font-semibold">
          {success ? 'Paiement réussi' : 'Paiement non abouti'}
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          {success
            ? orderReference
              ? `Votre commande n° ${orderReference} a bien été enregistrée. Vous la retrouvez dans votre historique.`
              : 'Votre commande a bien été enregistrée. Vous la retrouvez dans votre historique.'
            : 'Le paiement a échoué ou a été annulé. Vous pouvez réessayer depuis votre panier.'}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {success ? (
            <>
              <Link href="/compte/commandes" className="btn-primary">
                Voir mes commandes
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
