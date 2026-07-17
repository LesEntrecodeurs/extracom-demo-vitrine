"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@extracom/site-kit/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Container } from "@/components/ui/Container";
import { toast } from "sonner";

export default function ConnexionPage() {
  const router = useRouter();
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Rediriger si déjà connecté
  if (user) {
    router.push("/compte/commandes");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login({ email, password });
      toast.success("Connexion réussie");
      router.push("/compte/commandes");
    } catch (err) {
      toast.error("Email ou mot de passe incorrect");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="py-16">
      <div className="mx-auto max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold font-heading">Connexion</h1>
          <p className="mt-3 text-text-secondary">
            Accédez à vos tarifs personnalisés et à votre espace client.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email professionnel"
            type="email"
            placeholder="vous@entreprise.fr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div>
            <Input
              label="Mot de passe"
              type="password"
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="mt-2 text-right">
              <Link href="/mot-de-passe-oublie" className="text-sm text-primary hover:underline">
                Mot de passe oublié ?
              </Link>
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
            Se connecter
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-text-secondary">
          Vous n&apos;avez pas encore de compte ?{" "}
          <Link href="/inscription" className="font-medium text-primary hover:underline">
            Créer un compte
          </Link>
        </p>
      </div>
    </Container>
  );
}
