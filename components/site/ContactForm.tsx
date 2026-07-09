'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useAuth, useSupport } from '@extracom/site-kit/react';

export function ContactForm() {
  const { user, isLoading: loadingUser } = useAuth();
  const { createTicket, isLoading } = useSupport();
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (user) setEmail((current) => current || user.email);
  }, [user]);

  if (loadingUser) {
    return (
      <div className="card flex min-h-[360px] items-center justify-center p-6 text-sm text-neutral-500 md:p-8">
        Chargement du formulaire…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="card flex min-h-[360px] flex-col justify-center p-6 md:p-8">
        <p className="text-xs font-semibold tracking-[0.2em] text-[var(--brand-dark)] uppercase">
          Formulaire
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-neutral-900">
          Connectez-vous pour nous écrire
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600">
          Le formulaire de contact est réservé aux comptes professionnels
          connectés. Cela permet de rattacher votre message à votre société et de
          retrouver plus vite vos commandes ou vos tarifs.
        </p>
        <Link
          href="/connexion?redirect=/contact"
          className="btn-primary mt-6 inline-flex w-fit"
        >
          Se connecter
        </Link>
      </div>
    );
  }

  return (
    <form
      className="card space-y-5 p-6 md:p-8"
      onSubmit={async (event) => {
        event.preventDefault();
        const cleanSubject = subject.trim();
        const cleanDescription = description.trim();
        const cleanEmail = email.trim();

        if (!cleanSubject || !cleanDescription || !cleanEmail) {
          toast.error('Complétez tous les champs avant d’envoyer.');
          return;
        }

        try {
          await createTicket({
            subject: cleanSubject,
            description: cleanDescription,
            email: cleanEmail
          });
          setSubject('');
          setDescription('');
          toast.success('Message envoyé — nous revenons vers vous rapidement.');
        } catch {
          toast.error("L'envoi du message a échoué. Réessayez.");
        }
      }}
    >
      <div>
        <p className="text-xs font-semibold tracking-[0.2em] text-[var(--brand-dark)] uppercase">
          Formulaire
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-neutral-900">
          Envoyer un message
        </h2>
        <p className="mt-2 text-sm text-neutral-600">
          Décrivez votre demande : nous la transmettons à l’équipe support.
        </p>
      </div>

      <label className="block space-y-1.5">
        <span className="text-xs font-medium text-neutral-500">Objet</span>
        <input
          type="text"
          required
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          className="field"
          placeholder="Ex. Question sur ma commande"
        />
      </label>

      <label className="block space-y-1.5">
        <span className="text-xs font-medium text-neutral-500">
          Email de réponse
        </span>
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="field"
          placeholder="vous@entreprise.fr"
        />
      </label>

      <label className="block space-y-1.5">
        <span className="text-xs font-medium text-neutral-500">Message</span>
        <textarea
          required
          rows={6}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="field resize-y"
          placeholder="Décrivez votre demande…"
        />
      </label>

      <button type="submit" disabled={isLoading} className="btn-primary">
        {isLoading ? 'Envoi…' : 'Envoyer le message'}
      </button>
    </form>
  );
}
