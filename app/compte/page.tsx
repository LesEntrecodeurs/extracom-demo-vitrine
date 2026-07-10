'use client';

import Link from 'next/link';
import { useAuth, useCompany, useShopContext } from '@extracom/site-kit/react';

export default function ComptePage() {
  const { user } = useAuth();
  const { activeId } = useCompany();
  const { data: context } = useShopContext();

  // Capacité métier du client sur la société active : dérivée de son rôle
  // côté serveur (l'API revérifie de toute façon).
  const activeMembership = user?.memberships.find(
    (m) =>
      m.customerId === activeId &&
      (!context?.shopName || m.shopName === context.shopName)
  );
  const caps = activeMembership?.capabilities;
  const shopPaymentEnabled = context?.capabilities?.paymentEnabled ?? false;

  // Paiement en ligne activé pour CE client = il doit passer par la page de
  // paiement en finalisant sa commande (ni commande directe, ni exemption).
  const paymentActiveForClient =
    !!caps?.canOrder && !caps.canCheckoutWithoutPayment && shopPaymentEnabled;

  return (
    <div>
      <h1 className="text-xl font-semibold">
        Bonjour {user?.name ?? ''}
      </h1>
      <p className="mt-1 text-neutral-500">{user?.email}</p>

      {activeMembership && (
        <div
          role="status"
          className={`mt-5 flex items-start gap-3 rounded-lg border p-4 text-sm ${
            paymentActiveForClient
              ? 'border-green-200 bg-green-50 text-green-900'
              : 'border-amber-200 bg-amber-50 text-amber-900'
          }`}
        >
          <span
            aria-hidden="true"
            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
              paymentActiveForClient
                ? 'bg-green-600 text-white'
                : 'bg-amber-600 text-white'
            }`}
          >
            {paymentActiveForClient ? '✓' : 'i'}
          </span>
          <div className="space-y-0.5">
            <p className="font-medium">
              {paymentActiveForClient
                ? 'Paiement en ligne activé pour votre compte'
                : 'Paiement en ligne non activé pour votre compte'}
            </p>
            <p className="text-xs opacity-90">
              {paymentActiveForClient
                ? `Vous paierez directement en ligne lors de la validation de vos commandes${
                    activeMembership.companyName
                      ? ` (${activeMembership.companyName})`
                      : ''
                  }.`
                : `Vos commandes${
                    activeMembership.companyName
                      ? ` (${activeMembership.companyName})`
                      : ''
                  } sont soumises à validation par notre équipe avant traitement. Contactez votre commercial pour finaliser.`}
            </p>
          </div>
        </div>
      )}

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