"use client";

import Link from "next/link";
import { useAuth, useCart } from "@extracom/site-kit/react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { toast } from "sonner";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, ShoppingCart } from "lucide-react";
import { formatPrice } from "@extracom/site-kit";

function PanierContent() {
  const { user, isLoading: authLoading } = useAuth();
  const { cart, isLoading, removeItem, updateLine } = useCart();

  if (authLoading || isLoading) {
    return (
      <Container className="py-16">
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 bg-surface-secondary rounded-lg" />
          ))}
        </div>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="py-16">
        <div className="mx-auto max-w-md text-center">
          <ShoppingCart className="mx-auto h-12 w-12 text-text-secondary mb-4" />
          <h1 className="text-2xl font-bold font-heading mb-3">Connectez-vous</h1>
          <p className="text-text-secondary">Pour voir votre panier et passer commande, connectez-vous à votre compte.</p>
          <Link href="/connexion">
            <Button className="mt-6" size="lg">Se connecter</Button>
          </Link>
        </div>
      </Container>
    );
  }

  const lines = cart?.lines || [];

  if (lines.length === 0) {
    return (
      <Container className="py-16">
        <div className="mx-auto max-w-md text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-text-secondary mb-4" />
          <h1 className="text-2xl font-bold font-heading mb-3">Votre panier est vide</h1>
          <p className="text-text-secondary">Découvrez notre catalogue et ajoutez vos premiers produits.</p>
          <Link href="/catalogue">
            <Button className="mt-6" size="lg">Voir le catalogue</Button>
          </Link>
        </div>
      </Container>
    );
  }

  const total = cart?.totals?.totalInclVat || 0;

  const handleRemove = async (lineId: string) => {
    try {
      await removeItem(lineId);
      toast.success("Produit retiré du panier");
    } catch {
      toast.error("Erreur lors du retrait");
    }
  };

  const handleQtyChange = async (lineId: string, newQty: number) => {
    if (newQty < 1) return;
    try {
      await updateLine(lineId, { quantity: newQty });
    } catch {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  return (
    <Container className="py-12">
      <h1 className="text-3xl font-bold font-heading mb-8">Mon panier</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-3">
          {lines.map((line) => (
            <div key={line.id} className="flex gap-4 rounded-lg border border-border p-4">
              <div className="w-20 h-20 bg-surface-secondary rounded-md shrink-0 flex items-center justify-center">
                {line.imageUrl ? (
                  <img src={line.imageUrl} alt={line.label || line.reference} className="object-contain p-2 w-full h-full" />
                ) : (
                  <div className="text-xs text-text-secondary">Photo</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/produit/${line.reference}`} className="font-medium hover:text-primary transition-colors line-clamp-1">
                  {line.label || line.reference}
                </Link>
                <p className="text-sm text-text-secondary mt-1">
                  {formatPrice(line.unitPrice)} / unité
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center border border-border rounded-md">
                    <button
                      onClick={() => handleQtyChange(line.id, line.quantity - 1)}
                      className="p-1.5 hover:bg-surface-secondary transition-colors"
                      disabled={line.quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="px-3 text-sm font-medium">{line.quantity}</span>
                    <button
                      onClick={() => handleQtyChange(line.id, line.quantity + 1)}
                      className="p-1.5 hover:bg-surface-secondary transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemove(line.id)}
                    className="p-1.5 text-text-secondary hover:text-danger transition-colors"
                    aria-label="Retirer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-semibold">{formatPrice(line.unitPrice * line.quantity)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-lg border border-border p-6 sticky top-24">
            <h2 className="font-semibold text-lg mb-4">Récapitulatif</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Sous-total</span>
                <span className="font-medium">{formatPrice(total)}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border flex justify-between">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-lg">{formatPrice(total)}</span>
            </div>
            <Link href="/commande">
              <Button className="w-full mt-6" size="lg">
                Commander <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/catalogue">
              <Button variant="ghost" className="w-full mt-2">
                Continuer mes achats
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default function PanierPage() {
  return <PanierContent />;
}
