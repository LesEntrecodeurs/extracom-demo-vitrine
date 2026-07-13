import Link from 'next/link';
import { LayoutGrid, List } from 'lucide-react';
import { cn } from '@/lib/utils';

export type CatalogueView = 'grid' | 'list';

const VIEWS: { id: CatalogueView; label: string; icon: typeof LayoutGrid }[] =
  [
    { id: 'grid', label: 'Grille', icon: LayoutGrid },
    { id: 'list', label: 'Liste', icon: List }
  ];

/**
 * Bascule grille / liste pour la page catalogue. Les deux options sont des
 * liens qui modifient uniquement le paramètre `view` de l'URL (et reviennent
 * en page 1 quand on change de vue) — donc partageable, et le rendu reste
 * côté serveur (pas de « use client »).
 */
export function ViewToggle({
  currentView,
  searchParams
}: {
  currentView: CatalogueView;
  searchParams: Record<string, string | undefined>;
}) {
  return (
    <div
      role="group"
      aria-label="Affichage des articles"
      className="inline-flex rounded-md border border-neutral-200 bg-white p-0.5"
    >
      {VIEWS.map((v) => {
        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(searchParams)) {
          if (value == null || value === '') continue;
          // On retire `view` (géré par le bouton cliqué) et `page`
          // (on revient en page 1 quand on change de vue).
          if (key === 'view' || key === 'page') continue;
          params.set(key, value);
        }
        if (v.id !== 'grid') params.set('view', v.id);
        const qs = params.toString();
        const href = qs ? `/catalogue?${qs}` : '/catalogue';
        const isActive = currentView === v.id;
        const Icon = v.icon;
        return (
          <Link
            key={v.id}
            href={href}
            aria-label={`Affichage en ${v.label.toLowerCase()}`}
            aria-current={isActive ? 'true' : undefined}
            className={cn(
              'inline-flex items-center justify-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-medium transition-colors',
              isActive
                ? 'bg-[var(--brand)] text-white shadow-sm'
                : 'text-neutral-500 hover:text-[var(--brand-dark)]'
            )}
          >
            <Icon className="size-4" />
            <span>{v.label}</span>
          </Link>
        );
      })}
    </div>
  );
}