'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@extracom/site-kit/react';
import { formatPrice } from '@extracom/site-kit';
import { AuthGate } from '@/components/site/AuthGate';
import { CartSkeleton } from '@/components/site/Loader';
import { EmptyState } from '@/components/site/EmptyState';

export default function PanierPage() {
  return (
    <AuthGate message="Connectez-vous pour accéder à votre panier.">
      <PanierContent />
    </AuthGate>
  );
}

function PanierContent() {
  const { cart, isLoading, error, updateLine, removeItem, setComment } =
    useCart();

  // État local du commentaire (textarea). Synchronisé avec le panier dès qu'il
  // arrive / change, puis renvoyé au serveur avec un léger debounce pour ne
  // pas déclencher un appel API à chaque frappe.
  const [comment, setLocalComment] = useState('');
  const lastSyncedRef = useRef<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Quand le panier arrive / change (rechargement), on récupère la note
  // distante — sans écraser ce que l'utilisateur est en train de taper.
  useEffect(() => {
    const remote = cart?.note ?? '';
    if (remote !== lastSyncedRef.current && document.activeElement?.tagName !== 'TEXTAREA') {
      setLocalComment(remote);
      lastSyncedRef.current = remote;
    }
  }, [cart?.note]);

  // À chaque frappe : mise à jour locale immédiate + sauvegarde distante
  // différée de 400 ms (le plan demande « dès que ça change » ; ce debounce
  // évite un appel API par caractère sans introduire de bouton Enregistrer).
  const handleCommentChange = (value: string) => {
    setLocalComment(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (value === lastSyncedRef.current) return;
      try {
        await setComment(value);
        lastSyncedRef.current = value;
      } catch {
        // On laisse la valeur locale ; l'utilisateur pourra réessayer.
      }
    }, 400);
  };

  if (isLoading) return <CartSkeleton />;
  if (error)
    return (
      <p role="alert" className="text-red-600">
        Impossible de charger le panier.
      </p>
    );
  if (!cart || cart.lines.length === 0)
    return (
      <EmptyState
        icon={<ShoppingCart className="size-8" />}
        title="Votre panier est vide"
        description="Parcourez le catalogue pour ajouter des articles."
        action={{ label: 'Voir le catalogue', href: '/catalogue' }}
      />
    );

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
      <div>
        <h1 className="mb-6 text-xl font-semibold">Votre panier</h1>
        <ul className="card divide-y divide-neutral-100">
          {cart.lines.map((line) => {
            // Une remise est en place quand le kit expose un prix de base
            // strictement supérieur au prix unitaire réellement appliqué.
            const hasDiscount =
              typeof line.unitBasePrice === 'number' &&
              line.unitBasePrice > line.unitPrice;
            return (
              <li key={line.id} className="flex items-center gap-4 p-4">
                <div className="flex-1">
                  <p className="font-medium">{line.label ?? line.reference}</p>
                  {line.variantLabel && (
                    <p className="text-xs text-neutral-500">
                      Déclinaison : {line.variantLabel}
                    </p>
                  )}
                  <p className="text-sm text-neutral-500">
                    {hasDiscount && (
                      <span className="mr-1.5 text-neutral-400 line-through">
                        {formatPrice(line.unitBasePrice)}
                      </span>
                    )}
                    <span>{formatPrice(line.unitPrice)}</span>
                    <span className="ml-1"> / {line.unit ?? 'unité'}</span>
                  </p>
                </div>
                <input
                  type="number"
                  min={1}
                  defaultValue={line.quantity}
                  onBlur={(e) =>
                    updateLine(line.id, { quantity: Number(e.target.value) })
                  }
                  className="field w-16 text-center"
                />
                <div className="w-24 text-right font-medium">
                  {formatPrice(
                    line.lineTotalInclVat ?? line.unitPrice * line.quantity
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(line.id)}
                  aria-label={`Retirer ${line.label ?? line.reference} du panier`}
                  className="text-sm text-neutral-400 hover:text-red-600"
                >
                  <span aria-hidden="true">✕</span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Code promo / note pour la préparation.
            Sauvegardé automatiquement dans le commentaire du panier. */}
        <div className="mt-5">
          <label
            htmlFor="cart-note"
            className="mb-1.5 block text-sm font-medium text-neutral-700"
          >
            Code promo ou note pour la préparation
          </label>
          <textarea
            id="cart-note"
            value={comment}
            onChange={(e) => handleCommentChange(e.target.value)}
            rows={3}
            placeholder="Indiquez ici un code promo ou toute information utile pour la préparation de votre commande."
            className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-2.5 text-sm transition outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand-light)]"
          />
          <p className="mt-1 text-xs text-neutral-500">
            Les codes promo seront appliqués manuellement à la préparation de
            votre commande.
          </p>
        </div>
      </div>

      <aside className="card h-fit p-5">
        <h2 className="text-sm font-medium text-neutral-500">Récapitulatif</h2>
        <div className="mt-3 flex justify-between text-sm">
          <span>Sous-total HT</span>
          <span>{formatPrice(cart.totals?.totalExclVat ?? null)}</span>
        </div>
        <div className="mt-1 flex justify-between text-sm">
          <span>TVA</span>
          <span>{formatPrice(cart.totals?.totalVat ?? null)}</span>
        </div>
        <div className="mt-3 flex justify-between border-t border-neutral-100 pt-3 text-lg font-semibold">
          <span>Total TTC</span>
          <span>{formatPrice(cart.totals?.totalInclVat ?? null)}</span>
        </div>
        <Link href="/commande" className="btn-primary mt-5 w-full">
          Commander
        </Link>
      </aside>
    </div>
  );
}