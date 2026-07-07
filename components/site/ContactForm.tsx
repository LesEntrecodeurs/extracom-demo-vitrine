'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useAuth, useSupport } from '@extracom/site-kit/react';

const CONTACT_EMAIL = 'contact@exemple.fr';

/**
 * Formulaire de contact → ticket support. **Connecté** : pièce jointe au compte
 * via `createTicket` (kit). **Visiteur anonyme** : le serveur du kit refuse la
 * création de ticket hors session, on propose alors un contournement : le
 * formulaire ouvre la messagerie locale de l'utilisateur avec un `mailto:`
 * pré-rempli (sujet, email de réponse, message). Zéro appel réseau, fonctionne
 * même sans compte. L'agent peut restyler librement ; ne pas remplacer l'appel
 * `createTicket` par un `fetch` direct.
 */
export function ContactForm() {
  const { user, isLoading: loadingUser } = useAuth();
  const { createTicket, isLoading } = useSupport();
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (user) setEmail((e) => e || user.email);
  }, [user]);

  const mailto = useMemo(() => {
    const body = `Email de réponse : ${email.trim()}\n\n${description.trim()}`;
    const params = new URLSearchParams({
      subject: subject.trim(),
      body
    });
    return `mailto:${CONTACT_EMAIL}?${params.toString()}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject, description, email]);

  if (loadingUser) return null;

  if (!user) {
    const canOpen =
      subject.trim().length > 0 &&
      description.trim().length > 0 &&
      /.+@.+\..+/.test(email.trim());

    return (
      <div className="card mt-8 space-y-4 p-5">
        <div>
          <p className="font-medium">Envoyer un message</p>
          <p className="mt-1 text-sm text-neutral-600">
            Vous n'avez pas de compte ? Remplissez ce formulaire : votre
            messagerie s'ouvrira avec le message prêt à être envoyé à notre
            équipe. Pour un suivi attaché à votre espace client,{' '}
            <Link
              href="/connexion?redirect=/contact"
              className="text-[var(--brand-dark)] underline"
            >
              connectez-vous
            </Link>
            .
          </p>
        </div>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!canOpen) return;
            window.location.href = mailto;
            setSubject('');
            setDescription('');
            toast.success(
              "Votre messagerie s'ouvre avec votre message pré-rempli."
            );
          }}
        >
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
              placeholder="vous@exemple.fr"
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
          <button
            type="submit"
            disabled={!canOpen}
            className="btn-primary"
          >
            Ouvrir ma messagerie
          </button>
        </form>
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
