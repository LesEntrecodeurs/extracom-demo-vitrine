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

  // Paiement réussi → on récupère la commande la plus récente (créée par le
  // prestataire) pour afficher sa référence. Si on n'y arrive pas (visiteur
  // non connecté, latence API…), on retombe sur le message générique.
  let orderRef: string | null = null;
  if (success) {
    try {
      const { data } = await getDocumentsAction({ type: 1, limit: 1 });
      orderRef = data[0]?.reference ?? null;
    } catch {
      orderRef = null;
    }
  }

  return (
    <div className="py-16 text-center">
      <h1 className="text-2xl font-bold">
        {success ? 'Paiement réussi ✓' : 'Paiement non abouti'}
      </h1>
      <p className="mt-4 text-neutral-600">
        {success ? (
          orderRef ? (
            <>
              Votre commande{' '}
              <span className="font-semibold">n° {orderRef}</span> a bien été
              enregistrée. Merci !
            </>
          ) : (
            'Votre commande a été enregistrée. Merci !'
          )
        ) : (
          'Le paiement a échoué ou a été annulé.'
        )}
      </p>
      <Link
        href={success ? '/compte/commandes' : '/panier'}
        className="mt-8 inline-block rounded bg-[var(--brand)] px-6 py-3 text-white"
      >
        {success ? 'Voir mes commandes' : 'Retour au panier'}
      </Link>
    </div>
  );
}
