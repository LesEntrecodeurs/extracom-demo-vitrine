'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
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
  const [note, setNote] = useState('');
  const [hydrated, setHydrated] = useState(false);

  // Au premier chargement du panier, on remplit le champ avec la note
  // éventuellement déjà enregistrée côté serveur.
  useEffect(() => {
    if (cart && !hydrated) {
      setNote(cart.note ?? '');
      setHydrated(true);
    }
  }, [cart, hydrated]);

  // Sauvegarde la remarque sur le panier. On ne déclenche l'appel que si la
  // valeur a réellement changé, pour ne pas spammer l'API à chaque focus/blur.
  const saveNote = async () => {
    if (!cart) return;
    const trimmed = note.trim();
    if (trimmed === (cart.note ?? '')) return;
    try {
      await setComment(trimmed);
    } catch {
      toast.error("La remarque n'a pas pu être enregistrée.");
    }
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

        <div className="card mt-6 p-5">
          <label
            htmlFor="panier-note"
            className="text-sm font-medium text-neutral-700"
          >
            Remarque pour votre commande
          </label>
          <p className="mt-1 text-xs text-neutral-500">
            Note transmise avant validation (69 caractères max).
          </p>
          <textarea
            id="panier-note"
            value={note}
            onChange={(e) => setNote(e.target.value.slice(0, 69))}
            onBlur={saveNote}
            placeholder="Ex. : livrer après 14h, référence interne à reporter…"
            rows={2}
            className="field mt-3 resize-none"
          />
          <p className="mt-1 text-right text-xs text-neutral-400">
            {note.length}/69
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
