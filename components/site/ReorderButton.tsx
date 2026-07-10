'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { RotateCcw, Loader2 } from 'lucide-react';
import { useCart } from '@extracom/site-kit/react';
import { Button } from '@/components/ui/button';

/**
 * Bouton « Tout recommander » — vide le panier et le remplit avec les lignes
 * de la commande passée en prop. Utilise l'action `reorder` du kit
 * (équivalent du « reorder » d'Amazon/SaaS B2B) puis renvoie vers /panier pour
 * valider la commande.
 */
export function ReorderButton({ orderReference }: { orderReference: string }) {
  const router = useRouter();
  const { reorder, isLoading } = useCart();

  return (
    <Button
      type="button"
      disabled={isLoading}
      onClick={async () => {
        try {
          await reorder(orderReference);
          toast.success('Panier rempli avec vos produits habituels');
          router.push('/panier');
        } catch {
          toast.error('Impossible de remplir le panier');
        }
      }}
    >
      {isLoading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <RotateCcw className="size-4" />
      )}
      Tout recommander
    </Button>
  );
}