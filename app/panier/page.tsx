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
  const { cart, isLoading, error, updateLine, removeItem, setComment } = useCart();
  const [comment, setCommentValue] = useState('');
  const [savingComment, setSavingComment] = useState(false);

  // Synchronise le champ avec la note enregistrée dans le panier (par ex.
  // lorsque l'utilisateur revient sur la page après une modification).
  useEffect(() => {
    if (cart?.note !== undefined) setCommentValue(cart.note);
  }, [cart?.note]);

  const persistComment = async (next: string) => {
    if (next === (cart.note ?? '')) return;
    setSavingComment(true);
    try {
      await setComment(next);
    } catch {
      toast.error('Remarque non enregistrée, réessayez.');
    } finally {
      setSavingComment(false);
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

        <section className="mt-6 card p-5">
          <div className="flex items-baseline justify-between gap-2">
            <label
              htmlFor="panier-comment"
              className="block text-sm font-medium text-neutral-700"
            >
              Remarque à destination de nos équipes
            </label>
            <span className="text-xs text-neutral-400">
              {savingComment
                ? 'Enregistrement…'
                : comment === (cart.note ?? '')
                  ? 'Enregistré'
                  : 'Non enregistré'}
            </span>
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            Indiquez ici toute précision utile à la préparation de votre
            commande (optionnel).
          </p>
          <textarea
            id="panier-comment"
            value={comment}
            onChange={(e) => setCommentValue(e.target.value.slice(0, 69))}
            onBlur={(e) => persistComment(e.target.value)}
            placeholder="Précisions sur votre commande (optionnel)"
            rows={3}
            className="field mt-3 resize-none"
          />
          <p className="mt-1 text-right text-xs text-neutral-400">
            {comment.length}/69
          </p>
        </section>
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
