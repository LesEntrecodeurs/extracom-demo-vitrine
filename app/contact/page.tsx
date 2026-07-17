"use client";

import { useState } from "react";
import { useAuth, useSupport } from "@extracom/site-kit/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import Link from "next/link";
import { toast } from "sonner";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

function ContactForm() {
  const { user } = useAuth();
  const { createTicket, isLoading } = useSupport();
  const [form, setForm] = useState({
    subject: "",
    description: "",
    email: "",
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Connectez-vous pour envoyer un message");
      return;
    }
    try {
      await createTicket({
        subject: form.subject,
        description: form.description,
        email: form.email,
      });
      setSent(true);
      toast.success("Message envoyé ! Nous vous répondrons rapidement.");
    } catch {
      toast.error("Erreur lors de l'envoi");
    }
  };

  if (sent) {
    return (
      <div className="rounded-lg border border-border bg-surface-secondary p-8 text-center">
        <p className="text-lg font-medium">Message envoyé ✓</p>
        <p className="mt-2 text-text-secondary">Notre équipe vous répondra dans les plus brefs délais.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Sujet"
        placeholder="Objet de votre demande"
        value={form.subject}
        onChange={(e) => setForm({ ...form, subject: e.target.value })}
        required
      />
      <Input
        label="Email"
        type="email"
        placeholder="votre@email.fr"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />
      <div>
        <label className="block text-sm font-medium text-text mb-1.5">Message</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={5}
          placeholder="Décrivez votre demande…"
          required
          className="input-field resize-none"
        />
      </div>
      {user ? (
        <Button type="submit" size="lg" isLoading={isLoading}>
          Envoyer le message
        </Button>
      ) : (
        <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 text-sm">
          <Link href="/connexion" className="font-medium text-primary hover:underline">Connectez-vous</Link>{" "}
          pour nous envoyer un message.
        </div>
      )}
    </form>
  );
}

export default function ContactPage() {
  return (
    <>
      <Container className="py-12">
        <nav className="flex items-center gap-2 text-sm text-text-secondary mb-8">
          <Link href="/" className="hover:text-primary">Accueil</Link>
          <span>/</span>
          <span className="text-text font-medium">Contact</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Coordonnées */}
          <div className="lg:col-span-2 space-y-8">
            <h1 className="text-4xl font-bold font-heading">Contactez-nous</h1>
            <p className="text-text-secondary">
              Une question, un devis, un besoin technique ? Notre équipe est à votre écoute.
            </p>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Wédis</p>
                  <p className="text-sm text-text-secondary">
                    678 avenue du Général Leclerc<br />
                    54130 Neuves-Maisons
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <a href="tel:0383472626" className="font-medium hover:text-primary transition-colors">
                    03 83 47 26 26
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <a href="mailto:contact@wedis.fr" className="font-medium hover:text-primary transition-colors">
                    contact@wedis.fr
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Horaires d&apos;ouverture</p>
                  <p className="text-sm text-text-secondary">
                    Du lundi au vendredi<br />
                    8h – 12h | 14h – 18h
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <div className="lg:col-span-3">
            <div className="rounded-lg border border-border p-6 lg:p-8">
              <h2 className="text-xl font-bold font-heading mb-6">Envoyez-nous un message</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
