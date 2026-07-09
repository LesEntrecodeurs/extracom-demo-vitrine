'use client';

import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

/**
 * Barre de recherche produits (nom ou référence).
 *
 * - Desktop : champ inline dans le header.
 * - Mobile : icône loupe qui ouvre un panneau plein écran avec un grand champ
 *   et un bouton « Rechercher » → meilleure accessibilité tactile.
 *
 * Soumission : `<form action="/catalogue" method="get">` natif → redirige vers
 * `/catalogue?q=…`. Pas de JS de routage, le navigateur gère.
 */
export function SearchBox() {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Focus automatique à l'ouverture de l'overlay + Échap pour fermer.
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    // Bloque le scroll du body quand l'overlay est ouvert.
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      {/* Desktop : champ inline (md+). */}
      <form
        action="/catalogue"
        method="get"
        role="search"
        className="hidden flex-1 md:block"
      >
        <div className="relative max-w-md">
          <SearchIcon className="pointer-events-none absolute top-2.5 left-3 h-4 w-4 text-neutral-400" />
          <input
            name="q"
            type="search"
            placeholder="Rechercher un article ou une référence…"
            aria-label="Rechercher un article ou une référence"
            autoComplete="off"
            className="field pl-9"
          />
        </div>
      </form>

      {/* Mobile : icône loupe (sous md). */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Ouvrir la recherche"
        className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-700 transition hover:bg-neutral-100 hover:text-neutral-900 md:hidden"
      >
        <SearchIcon className="h-5 w-5" />
      </button>

      {/* Overlay plein écran (mobile). */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Rechercher dans le catalogue"
          className="fixed inset-0 z-50 md:hidden"
        >
          {/* Backdrop cliquable pour fermer. */}
          <button
            type="button"
            aria-label="Fermer la recherche"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40"
          />

          <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col bg-white">
            {/* Barre haute : champ + fermeture. */}
            <div className="flex items-center gap-2 border-b border-neutral-200 px-4 py-3">
              <form
                action="/catalogue"
                method="get"
                role="search"
                className="relative flex-1"
                onSubmit={() => setOpen(false)}
              >
                <SearchIcon className="pointer-events-none absolute top-2.5 left-3 h-4 w-4 text-neutral-400" />
                <input
                  ref={inputRef}
                  name="q"
                  type="search"
                  enterKeyHint="search"
                  inputMode="search"
                  placeholder="Rechercher un article ou une référence…"
                  aria-label="Rechercher un article ou une référence"
                  autoComplete="off"
                  className="field pl-9"
                />
              </form>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fermer"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-neutral-700 hover:bg-neutral-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Astuce en bas pour orienter le visiteur. */}
            <div className="px-4 pt-4 text-sm text-neutral-500">
              Tapez le nom d'un produit ou sa référence, puis appuyez sur la
              touche « Recherche » de votre clavier.
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" strokeLinecap="round" />
    </svg>
  );
}