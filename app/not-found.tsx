"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Container className="py-20">
      <div className="max-w-md mx-auto text-center">
        <p className="text-8xl font-bold font-heading text-primary/20">404</p>
        <h1 className="text-3xl font-bold font-heading mt-6">Page introuvable</h1>
        <p className="mt-4 text-text-secondary">
          Désolé, cette page n&apos;existe pas ou a été déplacée.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/">
            <Button size="lg">Retour à l&apos;accueil</Button>
          </Link>
          <Link href="/contact">
            <Button size="lg" variant="secondary">
              Nous contacter
            </Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}
