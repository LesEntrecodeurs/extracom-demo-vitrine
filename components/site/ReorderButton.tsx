'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RotateCcw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@extracom/site-kit/react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'outline';
type Size = 'sm' | 'md';

type Props = {
  orderReference: string;
  variant?: Variant;
  size?: Size;
  redirectToCart?: boolean;
  label?: string;
  className?: string;
};

/**
 * Bouton « Recommander en un clic » depuis une ancienne commande.
 * Réutilise le panier courant via `useCart().reorder(orderReference)`
 * (ajoute les lignes de la commande passée au panier actif).
 *
 * Feedback : toast `sonner` succès / erreur. Si `redirectToCart` est vrai
 * (utile depuis la page de détail), redirige vers /panier après succès.
 */
export function ReorderButton({
  orderReference,
  variant = 'primary',
  size = 'md',
  redirectToCart = false,
  label = 'Recommander',
  className
}: Props) {
  const { reorder } = useCart();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const handleClick = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await reorder(orderReference);
      toast.success('Commande ajoutée à votre panier.');
      if (redirectToCart) router.push('/panier');
    } catch {
      toast.error("Impossible de recommander cette commande.");
    } finally {
      setBusy(false);
    }
  };

  const base =
    'inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60';
  const sizes: Record<Size, string> = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm'
  };
  const variants: Record<Variant, string> = {
    primary: 'btn-primary',
    outline: 'btn-outline'
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      aria-busy={busy}
      className={cn(base, sizes[size], variants[variant], className)}
    >
      {busy ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
      ) : (
        <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
      )}
      <span>{busy ? 'Ajout…' : label}</span>
    </button>
  );
}