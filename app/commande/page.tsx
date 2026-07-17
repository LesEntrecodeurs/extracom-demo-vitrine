"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useAuth,
  useCart,
  useDelivery,
  useCheckout,
  usePayment,
  useShopContext,
} from "@extracom/site-kit/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Container } from "@/components/ui/Container";
import { toast } from "sonner";
import Link from "next/link";
import { ChevronRight, Check } from "lucide-react";

function CommandeContent() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { cart, isLoading: cartLoading } = useCart();
  const { options: deliveryOptions } = useDelivery();
  const { createOrder, validateWithoutPayment, isLoading: isChecking } = useCheckout();
  const { start: startPayment, isLoading: isPaying } = usePayment();
  const { data: shop } = useShopContext();

  const [step, setStep] = useState<"recap" | "validation">("recap");
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [comment, setComment] = useState("");

  if (authLoading || cartLoading) {
    return (
      <Container className="py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-surface-secondary rounded w-48" />
          <div className="h-40 bg-surface-secondary rounded-lg" />
        </div>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="py-16 text-center">
        <p className="text-lg font-medium">Connectez-vous pour passer commande</p>
        <Link href="/connexion"><Button className="mt-4">Se connecter</Button></Link>
      </Container>
    );
  }

  const lines = cart?.lines || [];

  if (lines.length === 0) {
    return (
      <Container className="py-16 text-center">
        <p className="text-lg font-medium">Votre panier est vide</p>
        <Link href="/catalogue"><Button className="mt-4">Voir le catalogue</Button></Link>
      </Container>
    );
  }

  const total = cart?.totals?.totalInclVat || lines.reduce((acc: number, l: any) => acc + (l.unitPrice || 0) * l.quantity, 0);
  const addresses = deliveryOptions?.addresses || [];
  const canPay = shop?.capabilities?.paymentEnabled !== false;

  const handleOrder = async () => {
    setStep("validation");
    try {
      if (canPay) {
        // Avec paiement : créer la commande puis rediriger vers le paiement
        const order = await createOrder();
        const payment = await startPayment();
        if (payment?.redirectUrl) {
          window.location.href = payment.redirectUrl;
        } else {
          toast.success("Commande créée avec succès !");
          router.push("/compte/commandes");
        }
      } else {
        // Sans paiement : commande directe
        await validateWithoutPayment();
        toast.success("Commande validée !");
        router.push("/compte/commandes");
      }
    } catch (err) {
      toast.error("Erreur lors de la commande. Veuillez réessayer.");
      setStep("recap");
    }
  };

  return (
    <Container className="py-12">
      <nav className="flex items-center gap-2 text-sm text-text-secondary mb-8">
        <Link href="/panier" className="hover:text-primary">Panier</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-text font-medium">Commande</span>
      </nav>

      <h1 className="text-3xl font-bold font-heading mb-8">Finaliser ma commande</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Adresse de livraison */}
          {addresses.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-4">Adresse de livraison</h2>
              <div className="space-y-2">
                {addresses.map((addr: any, i: number) => (
                  <label
                    key={i}
                    className={`flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-colors ${
                      selectedAddress === addr.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      value={addr.id}
                      checked={selectedAddress === addr.id}
                      onChange={() => setSelectedAddress(addr.id)}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium">{addr.label}</p>
                      <p className="text-sm text-text-secondary">{addr.line1}</p>
                      <p className="text-sm text-text-secondary">{addr.postalCode} {addr.city}</p>
                    </div>
                  </label>
                ))}
              </div>
            </section>
          )}

          {/* Commentaire */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Ajouter un commentaire</h2>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Instructions particulières pour la commande…"
              rows={3}
              className="input-field resize-none"
            />
          </section>

          {/* Récapitulatif des produits */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Produits commandés</h2>
            <div className="space-y-3">
              {lines.map((line: any) => (
                <div key={line.id} className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-surface-secondary rounded-md shrink-0" />
                    <div>
                      <p className="font-medium text-sm">{line.label}</p>
                      <p className="text-xs text-text-secondary">x{line.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium">{(line.unitPrice || 0).toFixed(2)} €</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Résumé + bouton */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-border p-6 sticky top-24">
            <h2 className="font-semibold text-lg mb-4">Récapitulatif</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Sous-total</span>
                <span className="font-medium">{total.toFixed(2)} €</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border flex justify-between">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-xl">{total.toFixed(2)} €</span>
            </div>

            {step === "recap" ? (
              <Button
                className="w-full mt-6"
                size="lg"
                onClick={handleOrder}
                disabled={isChecking || isPaying}
              >
                {canPay ? "Procéder au paiement" : "Confirmer la commande"}
              </Button>
            ) : (
              <Button className="w-full mt-6" size="lg" isLoading disabled>
                Traitement en cours…
              </Button>
            )}

            <p className="mt-4 text-xs text-text-secondary text-center">
              En commandant, vous acceptez nos{" "}
              <Link href="/cgv" className="text-primary hover:underline">CGV</Link>.
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default function CommandePage() {
  return <CommandeContent />;
}
