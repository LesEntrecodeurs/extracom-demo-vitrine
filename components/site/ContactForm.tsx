'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAuth, useSupport } from '@extracom/site-kit/react';

interface ContactFormProps {
  supportEmail?: string;
}

/**
 * Le kit attache les tickets au compte de session, donc `createTicket` n'est
 * utilisable que par un visiteur connecté. Pour les anonymes, on ouvre un
 * `mailto` pré-rempli vers l'adresse du shop : contournement sans toucher au
 * kit ni ajouter d'API.
 */
export function ContactForm({
  supportEmail = 'contact@exemple.fr'
}: ContactFormProps) {
  const { user, isLoading: loadingUser } = useAuth();
  const { createTicket, isLoading } = useSupport();
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (user) setEmail((e) => e || user.email);
  }, [user]);

  if (loadingUser) return null;

  const isAnonymous = !user;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isAnonymous) {
      const body = `Email de réponse : ${email.trim()}\n\n${description.trim()}`;
      const href = `mailto:${supportEmail}?subject=${encodeURIComponent(
        subject.trim()
      )}&body=${encodeURIComponent(body)}`;
      window.location.href = href;
      return;
    }
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
  }

  return (
    <form className="card mt-8 space-y-4 p-5" onSubmit={handleSubmit}>
      <div>
        <p className="font-medium">Envoyer un message</p>
        {isAnonymous && (
          <p className="mt-1 text-xs text-neutral-500">
            Vous n'êtes pas connecté·e — l'envoi passera par votre messagerie
            et nous vous répondrons par email.
          </p>
        )}
      </div>
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
      <button
        type="submit"
        disabled={!isAnonymous && isLoading}
        className="btn-primary"
      >
        {isAnonymous
          ? 'Envoyer via ma messagerie'
          : isLoading
            ? 'Envoi…'
            : 'Envoyer'}
      </button>
    </form>
  );
}
