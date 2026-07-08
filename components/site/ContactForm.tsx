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
      <div className="card mt-8 space-y-2 p-5 text-sm text-neutral-600">
        <p className="font-medium text-neutral-800">Vous n’êtes pas encore client ?</p>
        <p>
          Pour nous écrire, vous pouvez{' '}
          <Link
            href="/inscription?redirect=/contact"
            className="text-[var(--brand-dark)] underline"
          >
            créer un compte
          </Link>{' '}
          afin d’utiliser le formulaire ci-dessous : votre demande sera rattachée à votre compte pour un suivi plus rapide. Sinon, vous pouvez aussi{' '}
          <a
            href="mailto:contact@exemple.fr"
            className="text-[var(--brand-dark)] underline"
          >
            nous envoyer un email
          </a>{' '}
          directement, à l’adresse affichée plus haut sur cette page.
        </p>
        <p>
          Vous avez déjà un compte ?{' '}
          <Link
            href="/connexion?redirect=/contact"
            className="text-[var(--brand-dark)] underline"
          >
            Connectez-vous
          </Link>
          .
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
