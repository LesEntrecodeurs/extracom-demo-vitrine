'use client';

import { useEffect, useState } from 'react';
import {
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Link2,
  Check
} from 'lucide-react';
import { toast } from 'sonner';

type Props = {
  /** Titre du produit — pré-rempli dans le message partagé. */
  title: string;
};

/**
 * Bloc « Partager ce produit » avec les principaux réseaux sociaux et un
 * bouton pour copier le lien. L'URL courante est lue côté navigateur pour
 * respecter les éventuels paramètres de requête.
 */
export function ShareLinks({ title }: Props) {
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const handleCopy = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Lien copié dans le presse-papiers');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Impossible de copier le lien');
    }
  };

  const share = (network: 'facebook' | 'twitter' | 'linkedin' | 'whatsapp') => {
    if (!url) return;
    const u = encodeURIComponent(url);
    const t = encodeURIComponent(title);
    const text = encodeURIComponent(`${title} — ${url}`);
    const href =
      network === 'facebook'
        ? `https://www.facebook.com/sharer/sharer.php?u=${u}`
        : network === 'twitter'
          ? `https://twitter.com/intent/tweet?url=${u}&text=${t}`
          : network === 'linkedin'
            ? `https://www.linkedin.com/sharing/share-offsite/?url=${u}`
            : `https://wa.me/?text=${text}`;
    window.open(href, '_blank', 'noopener,noreferrer,width=600,height=600');
  };

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1.5 text-sm text-neutral-500">
        <Share2 className="size-4" aria-hidden="true" />
        Partager ce produit :
      </span>
      <button
        type="button"
        onClick={() => share('facebook')}
        disabled={!url}
        aria-label="Partager sur Facebook"
        className="inline-flex size-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-700 transition hover:border-[var(--brand)] hover:text-[var(--brand)] disabled:opacity-50"
      >
        <Facebook className="size-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => share('twitter')}
        disabled={!url}
        aria-label="Partager sur X (Twitter)"
        className="inline-flex size-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-700 transition hover:border-[var(--brand)] hover:text-[var(--brand)] disabled:opacity-50"
      >
        <Twitter className="size-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => share('linkedin')}
        disabled={!url}
        aria-label="Partager sur LinkedIn"
        className="inline-flex size-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-700 transition hover:border-[var(--brand)] hover:text-[var(--brand)] disabled:opacity-50"
      >
        <Linkedin className="size-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => share('whatsapp')}
        disabled={!url}
        aria-label="Partager sur WhatsApp"
        className="inline-flex size-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-700 transition hover:border-[var(--brand)] hover:text-[var(--brand)] disabled:opacity-50"
      >
        <svg
          className="size-4"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M17.5 14.4c-.3-.1-1.7-.8-1.9-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-1 1.1-.2.2-.4.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.4.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4 0 1.4 1 2.8 1.2 3 .1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.2-.3-.2-.5-.3zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.4c1.4.8 3 1.2 4.8 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.3c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.2.8.9-3.1-.2-.3c-.9-1.4-1.4-3-1.4-4.6 0-4.6 3.7-8.3 8.3-8.3s8.3 3.7 8.3 8.3-3.7 8.6-8 8.6z" />
        </svg>
      </button>
      <button
        type="button"
        onClick={handleCopy}
        disabled={!url}
        aria-label={copied ? 'Lien copié' : 'Copier le lien du produit'}
        className="inline-flex size-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-700 transition hover:border-[var(--brand)] hover:text-[var(--brand)] disabled:opacity-50"
      >
        {copied ? (
          <Check className="size-4 text-green-600" aria-hidden="true" />
        ) : (
          <Link2 className="size-4" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}