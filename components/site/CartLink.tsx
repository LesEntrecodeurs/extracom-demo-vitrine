'use client';

import Link from 'next/link';
import { useCart, useCompany } from '@extracom/site-kit/react';

/**
 * Lien panier avec compteur d'articles. Affiche, sous le libellé "Panier",
 * la société à laquelle le panier est rattaché : la panier suit toujours la
 * société active (re-scellement de session par le kit), donc cette mention
 * confirme d'un coup d'œil que le panier est bien pour la bonne société.
 */
export function CartLink() {
  const { cart } = useCart();
  const { companies, activeId } = useCompany();

  const count =
    cart?.lines?.reduce((n, l) => n + (l.quantity ?? 0), 0) ?? 0;

  const activeCompany = companies.find((c) => c.customerId === activeId);
  const companyName = activeCompany?.companyName?.trim() || null;

  const cartLabel =
    count > 1 ? `Panier (${count} articles)` : `Panier (${count} article)`;
  const fullLabel = companyName
    ? `${cartLabel} pour ${companyName}`
    : cartLabel;

  return (
    <Link
      href="/panier"
      aria-label={fullLabel}
      className="group flex items-center gap-2 text-neutral-700 hover:text-neutral-900"
    >
      <span className="relative">
        <CartIcon className="h-5 w-5" />
        {count > 0 && (
          <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--brand)] px-1 text-[10px] font-semibold text-white">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </span>
      <span className="hidden flex-col leading-tight sm:flex">
        <span className="text-sm font-medium">Panier</span>
        {companyName && (
          <span className="text-[11px] text-neutral-500 group-hover:text-neutral-700">
            pour {companyName}
          </span>
        )}
      </span>
    </Link>
  );
}

function CartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
      <path d="M2 3h3l2.4 12.4a1 1 0 0 0 1 .8h8.7a1 1 0 0 0 1-.8L21 7H6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}