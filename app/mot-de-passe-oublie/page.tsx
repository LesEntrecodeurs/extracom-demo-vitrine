"use client";

import { useState } from "react";
import { useAccount } from "@extracom/site-kit/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Container } from "@/components/ui/Container";
import { toast } from "sonner";
import Link from "next/link";

export default function MotDePasseOubliePage() {
  const { requestPasswordReset, verifyResetCode, changePassword } = useAccount();
  const [step, setStep] = useState<"email" | "code" | "newPassword">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await requestPasswordReset(email);
      toast.success("Un code de réinitialisation vous a été envoyé par email.");
      setStep("code");
    } catch {
      toast.error("Erreur lors de l'envoi du code. Vérifiez votre email.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await verifyResetCode(email, code);
      toast.success("Code vérifié.");
      setStep("newPassword");
    } catch {
      toast.error("Code incorrect ou expiré.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await changePassword({ email, code, newPassword: password });
      toast.success("Mot de passe réinitialisé. Vous pouvez vous connecter.");
      window.location.href = "/connexion";
    } catch {
      toast.error("Erreur lors de la réinitialisation.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="py-16">
      <div className="mx-auto max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold font-heading">Mot de passe oublié</h1>
          <p className="mt-3 text-text-secondary">
            {step === "email" && "Saisissez votre email pour recevoir un code de réinitialisation."}
            {step === "code" && "Saisissez le code reçu par email."}
            {step === "newPassword" && "Choisissez un nouveau mot de passe."}
          </p>
        </div>

        {step === "email" && (
          <form onSubmit={handleRequestCode} className="space-y-5">
            <Input
              label="Email professionnel"
              type="email"
              placeholder="vous@entreprise.fr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
              Envoyer le code
            </Button>
          </form>
        )}

        {step === "code" && (
          <form onSubmit={handleVerifyCode} className="space-y-5">
            <Input
              label="Code de vérification"
              placeholder="Code reçu par email"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
              Vérifier le code
            </Button>
          </form>
        )}

        {step === "newPassword" && (
          <form onSubmit={handleChangePassword} className="space-y-5">
            <Input
              label="Nouveau mot de passe"
              type="password"
              placeholder="Minimum 8 caractères"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
              Réinitialiser le mot de passe
            </Button>
          </form>
        )}

        <p className="mt-8 text-center text-sm text-text-secondary">
          <Link href="/connexion" className="font-medium text-primary hover:underline">
            Retour à la connexion
          </Link>
        </p>
      </div>
    </Container>
  );
}
