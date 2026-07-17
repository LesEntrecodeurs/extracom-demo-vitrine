"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

function PaiementRetourContent() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const reference = searchParams.get("reference");

  const isSuccess = success === "true";

  return (
    <Container className="py-20">
      <div className="mx-auto max-w-md text-center">
        {isSuccess ? (
          <>
            <CheckCircle className="mx-auto h-16 w-16 text-success mb-6" />
            <h1 className="text-3xl font-bold font-heading mb-3">Paiement réussi !</h1>
            <p className="text-text-secondary mb-2">
              Votre commande a été confirmée.
            </p>
            {reference && (
              <p className="text-sm text-text-secondary mb-6">
                Référence : <span className="font-medium text-text">{reference}</span>
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
              <Link href="/compte/commandes">
                <Button>Voir mes commandes</Button>
              </Link>
              <Link href="/catalogue">
                <Button variant="secondary">Continuer mes achats</Button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <XCircle className="mx-auto h-16 w-16 text-danger mb-6" />
            <h1 className="text-3xl font-bold font-heading mb-3">Paiement échoué</h1>
            <p className="text-text-secondary mb-8">
              Le paiement n&apos;a pas abouti. Vous pouvez réessayer ou nous contacter.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/panier">
                <Button>Réessayer le paiement</Button>
              </Link>
              <Link href="/contact">
                <Button variant="secondary">Nous contacter</Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </Container>
  );
}

export default function PaiementRetourPage() {
  return (
    <Suspense fallback={<Container className="py-20"><div className="text-center text-text-secondary">Chargement…</div></Container>}>
      <PaiementRetourContent />
    </Suspense>
  );
}
