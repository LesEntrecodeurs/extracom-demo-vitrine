'use client';

import Link from 'next/link';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useAuth, useShopContext } from '@extracom/site-kit/react';

export default function ComptePage() {
  const { user } = useAuth();
  const { data: context } = useShopContext();
  const paymentEnabled = context?.capabilities?.paymentEnabled === true;

  return (
    <div>
      <h1 className="text-xl font-semibold">
        Bonjour {user?.name ?? ''}
      </h1>
      <p className="mt-1 text-neutral-500">{user?.email}</p>

      <div
        role="status"
        aria-live="polite"
        className={`mt-4 flex items-start gap-3 rounded-md border p-3 ${
          paymentEnabled
            ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
            : 'border-neutral-200 bg-neutral-50 text-neutral-700'
        }`}
      >
        {paymentEnabled ? (
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
        ) : (
          <XCircle className="mt-0.5 size-5 shrink-0 text-neutral-500" />
        )}
        <div className="text-sm">
          <p className="font-medium">
            Paiement en ligne&nbsp;:{' '}
            {paymentEnabled
              ? 'activé pour vos commandes'
              : 'non disponible'}
          </p>
          <p className="mt-0.5 text-xs opacity-80">
            {paymentEnabled
              ? 'À l’étape de finalisation, vous pourrez régler votre commande par carte via notre prestataire sécurisé.'
              : 'Vos commandes sont validées sans paiement en ligne ; le règlement est traité avec votre contact commercial.'}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Tile href="/compte/profil" title="Profil" desc="Vos informations" />
        <Tile href="/compte/adresses" title="Adresses" desc="Livraison & facturation" />
        <Tile href="/compte/commandes" title="Commandes" desc="Votre historique" />
      </div>
    </div>
  );
}

function Tile({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link href={href} className="card p-4">
      <p className="font-medium">{title}</p>
      <p className="text-sm text-neutral-500">{desc}</p>
    </Link>
  );
}
