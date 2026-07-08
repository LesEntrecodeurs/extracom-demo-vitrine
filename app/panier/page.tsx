'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import {
  useCart,
  useDelivery,
  useShopContext
} from '@extracom/site-kit/react';
import { formatPrice } from '@extracom/site-kit';
import { AuthGate } from '@/components/site/AuthGate';
import { CartSkeleton } from '@/components/site/Loader';
import { EmptyState } from '@/components/site/EmptyState';
import { AddressForm } from '@/components/site/AddressForm';

export default function PanierPage() {
  return (
    <AuthGate message="Connectez-vous pour accéder à votre panier.">
      <PanierContent />
    </AuthGate>
  );
}

function PanierContent() {
  const { cart, isLoading, error, updateLine, removeItem, setDelivery } =
    useCart();
  const { options, addAddress } = useDelivery();
  const { data: context } = useShopContext();
  const [showAdd, setShowAdd] = useState(false);
  const deliveryEnabled = context?.capabilities?.deliveryEnabled ?? true;

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

  const addresses = options?.addresses ?? [];
  const selectedAddress =
    addresses.find((a) => a.id === cart.deliveryAddressId) ?? null;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
      <div className="space-y-6">
        <h1 className="text-xl font-semibold">Votre panier</h1>
        <ul className="card divide-y divide-neutral-100">
          {cart.lines.map((line) => (
            <li key={line.id} className="flex items-center gap-4 p-4">
              <div className="flex-1">
                <p className="font-medium">{line.label ?? line.reference}</p>
                {line.variantLabel && (
                  <p className="text-xs text-neutral-500">
                    Déclinaison : {line.variantLabel}
                  </p>
                )}
                <p className="text-sm text-neutral-500">
                  {formatPrice(line.unitPrice)} / {line.unit ?? 'unité'}
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
          ))}
        </ul>

        {deliveryEnabled && (
          <section className="card p-5">
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-[var(--brand-dark)]" aria-hidden="true" />
              <h2 className="font-medium">Adresse de livraison</h2>
            </div>

            {selectedAddress ? (
              <div className="mt-3 flex items-start justify-between gap-3 rounded-lg border border-neutral-200 bg-[var(--brand-light)]/40 p-3 text-sm">
                <div>
                  <p className="font-medium">
                    {selectedAddress.label || 'Adresse de livraison'}
                  </p>
                  <p className="text-neutral-600">
                    {selectedAddress.line1}, {selectedAddress.postalCode}{' '}
                    {selectedAddress.city}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAdd(true)}
                  className="shrink-0 text-xs text-[var(--brand-dark)] hover:underline"
                >
                  Changer / ajouter
                </button>
              </div>
            ) : addresses.length > 0 ? (
              <div className="mt-3 space-y-2">
                <p className="text-sm text-neutral-500">
                  Choisissez une adresse enregistrée pour la livraison :
                </p>
                <ul className="space-y-2">
                  {addresses.map((a) => (
                    <li key={a.id}>
                      <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-neutral-200 p-3 text-sm hover:border-neutral-300">
                        <input
                          type="radio"
                          name="delivery"
                          checked={cart.deliveryAddressId === a.id}
                          onChange={() =>
                            setDelivery({ deliveryAddressId: a.id })
                          }
                        />
                        <span>
                          {a.label ? `${a.label} — ` : ''}
                          {a.line1}, {a.postalCode} {a.city}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => setShowAdd(true)}
                  className="text-sm text-[var(--brand-dark)] hover:underline"
                >
                  + Ajouter une autre adresse
                </button>
              </div>
            ) : null}

            {(showAdd || addresses.length === 0) && (
              <div className="mt-3 rounded-lg border border-neutral-200 bg-white p-4">
                <p className="mb-2 text-sm font-medium">
                  {addresses.length === 0
                    ? 'Ajoutez votre première adresse de livraison'
                    : 'Nouvelle adresse'}
                </p>
                <AddressForm
                  submitLabel="Enregistrer cette adresse"
                  onCancel={
                    addresses.length > 0
                      ? () => setShowAdd(false)
                      : undefined
                  }
                  onSubmit={async (addr) => {
                    try {
                      const created = await addAddress(addr);
                      await setDelivery({ deliveryAddressId: created.id });
                      setShowAdd(false);
                      toast.success('Adresse ajoutée à votre panier.');
                    } catch {
                      toast.error(
                        "L'adresse n'a pas pu être ajoutée. Réessayez."
                      );
                    }
                  }}
                />
              </div>
            )}

            {!showAdd && addresses.length === 0 && (
              <p className="mt-3 text-sm text-neutral-500">
                Vous n'avez pas encore d'adresse enregistrée.
              </p>
            )}
          </section>
        )}
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
