'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useAuth, useSupport } from '@extracom/site-kit/react';

/**
 * Formulaire de contact → ticket support. **Réservé au connecté** (le kit attache
 * le ticket au compte de la session). Pour un visiteur anonyme, on invite à se
 * connecter plutôt que d'afficher un champ qui échouerait. L'agent peut restyler
 * librement ; ne pas remplacer l'appel `createTicket` par un `fetch` direct.
 */
export function ContactForm() {
  const { user, isLoading: loadingUser } = useAuth();
  const { createTicket, isLoading } = useSupport();
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');

  // Pré-remplit l'email de réponse avec celui du compte (modifiable).
  useEffect(() => {
    if (user) setEmail((e) => e || user.email);
  }, [user]);

  if (loadingUser) return null;

  if (!user) {
    return (
      <div className="card mt-8 p-5 text-sm text-neutral-600">
        <p className="font-medium text-neutral-800">Vous préférez nous écrire ?</p>
        <p className="mt-1">
          Pour qu'on prenne soin de votre demande et qu'on la retrouve facilement
          si vous revenez vers nous, le mieux est de passer par votre espace
          personnel.{' '}
          <Link
            href="/connexion?redirect=/contact"
            className="text-[var(--brand-dark)] underline"
          >
            Connectez-vous
          </Link>{' '}
          ou{' '}
          <Link
            href="/inscription?redirect=/contact"
            className="text-[var(--brand-dark)] underline"
          >
            créez un compte
          </Link>{' '}
          — c'est rapide, et on pourra vous répondre au bon endroit.
        </p>
      </div>
    );
  }

  return (
    <form
      className="card mt-8 space-y-4 p-5"
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          await createTicket({
            subject: subject.trim(),
            description: description.trim(),
            email: email.trim()
          });
          setSubject('');
          setDescription('');
          toast.success('Message envoyé — nous revenons vers vous rapidement.');
        } catch {
          toast.error("L'envoi du message a échoué. Réessayez.");
        }
      }}
    >
      <p className="font-medium">Envoyer un message</p>
      <label className="block space-y-1">
        <span className="text-xs font-medium text-neutral-500">Objet</span>
        <input
          type="text"
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="field"
          placeholder="Ex. Question sur ma commande"
        />
      </label>
      <label className="block space-y-1">
        <span className="text-xs font-medium text-neutral-500">
          Email de réponse
        </span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="field"
        />
      </label>
      <label className="block space-y-1">
        <span className="text-xs font-medium text-neutral-500">Message</span>
        <textarea
          required
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="field resize-y"
          placeholder="Décrivez votre demande…"
        />
      </label>
      <button type="submit" disabled={isLoading} className="btn-primary">
        {isLoading ? 'Envoi…' : 'Envoyer'}
      </button>
    </form>
  );
}
