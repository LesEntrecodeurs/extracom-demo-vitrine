'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAuth, useSupport } from '@extracom/site-kit/react';

/**
 * Formulaire de contact → ticket support. Ouvert aux visiteurs **anonymes** (on
 * leur demande simplement un email de réponse) comme aux clients connectés
 * (l'email est alors pré-rempli avec celui du compte). L'appel passe toujours
 * par `useSupport().createTicket` — ne pas le remplacer par un `fetch` direct.
 */
export function ContactForm() {
  const { user } = useAuth();
  const { createTicket, isLoading } = useSupport();
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (user) setEmail((e) => e || user.email);
  }, [user]);

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
