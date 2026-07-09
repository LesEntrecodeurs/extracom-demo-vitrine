'use client';

import Link from 'next/link';
import type { CatalogNode } from '@extracom/site-kit';
import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

/** Lien catalogue d'un nœud (porte l'id + le niveau → colonne CL_No<niveau>). */
function catHref(node: CatalogNode): string {
  return `/catalogue?catalog=${node.id}&clevel=${node.level}`;
}

/** Branche pliable (sous-catégories imbriquées) via <details>, sans
 *  état : tap pour ouvrir / refermer. Robuste et accessible. */
function MobileBranch({ node }: { node: CatalogNode }) {
  const children = node.children ?? [];
  const hasChildren = children.length > 0;

  if (!hasChildren) {
    return (
      <Link
        href={catHref(node)}
        className="block py-2 pl-2 text-sm text-neutral-700 hover:text-[var(--brand-dark)]"
      >
        {node.label}
      </Link>
    );
  }

  return (
    <details className="group/branch">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 rounded py-2 pl-2 pr-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-[var(--brand-dark)]">
        <Link
          href={catHref(node)}
          className="flex-1 truncate"
          onClick={(e) => e.stopPropagation()}
        >
          {node.label}
        </Link>
        <Chevron className="h-3.5 w-3.5 text-neutral-400 transition-transform group-open/branch:rotate-90" />
      </summary>
      <div className="ml-3 border-l border-neutral-200 pl-2">
        <Link
          href={catHref(node)}
          className="block py-2 pl-2 text-xs font-medium text-[var(--brand-dark)] hover:underline"
        >
          Tout « {node.label} »
        </Link>
        {children.map((sub) => (
          <MobileBranch key={sub.id} node={sub} />
        ))}
      </div>
    </details>
  );
}

/**
 * Bouton « Menu » + tiroir latéral listant les catégories. Visible uniquement
 * sur mobile (le CategoryMenu horizontal reste affiché à partir de md).
 */
export function MobileMenu({ categories }: { categories: CatalogNode[] }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Ouvrir le menu des catégories"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 text-neutral-700 transition hover:bg-neutral-100 active:scale-[0.97] md:hidden"
        >
          <MenuIcon className="h-5 w-5" />
        </button>
      </SheetTrigger>

      <SheetContent side="left" className="w-[88vw] max-w-sm p-0">
        <SheetHeader className="border-b border-neutral-200 px-4 py-4">
          <SheetTitle className="text-base">Catégories</SheetTitle>
        </SheetHeader>

        <div className="overflow-y-auto px-2 py-3">
          <Link
            href="/catalogue"
            onClick={() => setOpen(false)}
            className="block rounded px-3 py-2.5 text-sm font-medium text-[var(--brand-dark)] hover:bg-[var(--brand-light)]"
          >
            Tout le catalogue
          </Link>

          {categories.length === 0 ? (
            <p className="px-3 py-4 text-sm text-neutral-500">
              Aucune catégorie pour le moment.
            </p>
          ) : (
            <Accordion type="multiple" className="w-full">
              {categories.map((cat) => {
                const children = cat.children ?? [];
                const hasChildren = children.length > 0;

                if (!hasChildren) {
                  return (
                    <Link
                      key={cat.id}
                      href={catHref(cat)}
                      onClick={() => setOpen(false)}
                      className="block rounded px-3 py-2.5 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-[var(--brand-dark)]"
                    >
                      {cat.label}
                    </Link>
                  );
                }

                return (
                  <AccordionItem key={cat.id} value={cat.id} className="border-0">
                    <AccordionTrigger className="rounded px-3 py-2.5 text-sm font-medium hover:bg-neutral-100 hover:no-underline">
                      {cat.label}
                    </AccordionTrigger>
                    <AccordionContent className="pb-2">
                      <Link
                        href={catHref(cat)}
                        onClick={() => setOpen(false)}
                        className="block rounded px-3 py-2 text-xs font-medium text-[var(--brand-dark)] hover:bg-[var(--brand-light)]"
                      >
                        Tout « {cat.label} »
                      </Link>
                      <div className="ml-2 border-l border-neutral-200 pl-2">
                        {children.map((sub) => (
                          <MobileBranch key={sub.id} node={sub} />
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
    </svg>
  );
}

function Chevron({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}