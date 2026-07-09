'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@extracom/site-kit/react';

/** Lien panier avec compteur d'articles (somme des quantités). Connecté seul. */
export function CartLink() {
  const { cart } = useCart();
  const count =
    cart?.lines?.reduce((n, l) => n + (l.quantity ?? 0), 0) ?? 0;

  return (
    <Link
      href="/panier"
      className="relative flex items-center gap-1.5 text-neutral-700 hover:text-neutral-900"
    >
      <span className="relative">
        <ShoppingCart className="size-5" />
        {count > 0 && (
          <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--brand)] px-1 text-[10px] font-semibold text-white">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </span>
      <span className="hidden sm:inline">Panier</span>
    </Link>
  );
}
