"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAccount, useAuth } from "@extracom/site-kit/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Container } from "@/components/ui/Container";
import { toast } from "sonner";

export default function InscriptionPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { register, isLoading: isRegistering } = useAccount();
  const [form, setForm] = useState({
    email: "",
    password: "",
    lastName: "",
    firstName: "",
    companyName: "",
    phoneNumber: "",
    acceptTerms: false,
  });

  if (user) {
    router.push("/compte/commandes");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.acceptTerms) {
      toast.error("Vous devez accepter les CGV");
      return;
    }
    try {
      await register({
        email: form.email,
        password: form.password,
        lastName: form.lastName,
        firstName: form.firstName,
        companyName: form.companyName,
        phoneNumber: form.phoneNumber,
        address: "",
        zipCode: "",
        city: "",
        siret: "",
        taxId: "",
        acceptTerms: form.acceptTerms,
      });
      toast.success("Compte créé avec succès ! Vous pouvez maintenant vous connecter.");
      router.push("/connexion");
    } catch (err) {
      toast.error("Une erreur est survenue lors de l'inscription.");
    }
  };

  return (
    <Container className="py-16">
      <div className="mx-auto max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold font-heading">Créer un compte</h1>
          <p className="mt-3 text-text-secondary">
            Accédez à vos tarifs personnalisés et commandez en ligne.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Prénom"
              placeholder="Votre prénom"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              required
            />
            <Input
              label="Nom"
              placeholder="Votre nom"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              required
            />
          </div>

          <Input
            label="Société"
            placeholder="Nom de votre entreprise"
            value={form.companyName}
            onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            required
          />

          <Input
            label="Email professionnel"
            type="email"
            placeholder="vous@entreprise.fr"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <Input
            label="Téléphone"
            type="tel"
            placeholder="Votre numéro"
            value={form.phoneNumber}
            onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
          />

          <Input
            label="Mot de passe"
            type="password"
            placeholder="Minimum 8 caractères"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            minLength={8}
          />

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.acceptTerms}
              onChange={(e) => setForm({ ...form, acceptTerms: e.target.checked })}
              className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-sm text-text-secondary">
              J&apos;accepte les{" "}
              <Link href="/cgv" className="text-primary hover:underline">conditions générales de vente</Link>{" "}
              et la politique de confidentialité.
            </span>
          </label>

          <Button type="submit" className="w-full" size="lg" isLoading={isRegistering}>
            Créer mon compte
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-text-secondary">
          Déjà un compte ?{" "}
          <Link href="/connexion" className="font-medium text-primary hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </Container>
  );
}
