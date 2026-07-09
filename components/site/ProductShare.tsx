'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  Check,
  Copy,
  Facebook,
  Link2,
  Linkedin,
  Mail,
  Share2,
  Twitter
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type Network = 'facebook' | 'twitter' | 'linkedin' | 'mail';

export function ProductShare({ title }: { title: string }) {
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks: Record<Network, string> = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    mail: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`
  };

  const handleCopy = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Lien copié dans le presse-papier');
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error('Impossible de copier le lien');
    }
  };

  return (
    <div className="mt-6 rounded-lg border border-neutral-200 bg-white p-4">
      <div className="flex items-center gap-2 text-sm font-medium text-neutral-700">
        <Share2 className="size-4" aria-hidden />
        <span>Partager ce produit</span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Partager sur Facebook"
          className="inline-flex size-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition hover:border-[#1877F2] hover:text-[#1877F2]"
        >
          <Facebook className="size-4" aria-hidden />
        </a>
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Partager sur X (Twitter)"
          className="inline-flex size-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition hover:border-neutral-900 hover:text-neutral-900"
        >
          <Twitter className="size-4" aria-hidden />
        </a>
        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Partager sur LinkedIn"
          className="inline-flex size-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition hover:border-[#0A66C2] hover:text-[#0A66C2]"
        >
          <Linkedin className="size-4" aria-hidden />
        </a>
        <a
          href={shareLinks.mail}
          aria-label="Partager par e-mail"
          className="inline-flex size-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition hover:border-[var(--brand-dark)] hover:text-[var(--brand-dark)]"
        >
          <Mail className="size-4" aria-hidden />
        </a>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCopy}
          disabled={!url}
          className="ml-auto"
        >
          {copied ? (
            <Check className="size-4" aria-hidden />
          ) : (
            <Copy className="size-4" aria-hidden />
          )}
          {copied ? 'Copié' : 'Copier le lien'}
        </Button>
      </div>

      <p className="mt-3 flex items-center gap-1.5 break-all text-xs text-neutral-400">
        <Link2 className="size-3 shrink-0" aria-hidden />
        <span className="truncate">{url || '…'}</span>
      </p>
    </div>
  );
}