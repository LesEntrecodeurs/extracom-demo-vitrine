'use client';

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { LayoutGrid, Rows3 } from 'lucide-react';
import type { Article } from '@extracom/site-kit';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ArticleCard } from '@/components/site/ArticleCard';
import { ArticleListItem } from '@/components/site/ArticleListItem';

export type CatalogueView = 'grid' | 'list';

const VIEW_VALUES: readonly CatalogueView[] = ['grid', 'list'];

function isView(v: string | undefined): v is CatalogueView {
  return v === 'grid' || v === 'list';
}

export function CatalogueResults({
  initialView,
  articles
}: {
  initialView: CatalogueView;
  articles: Article[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [view, setView] = useState<CatalogueView>(initialView);

  const handleChange = (next: string) => {
    if (!next || !isView(next) || next === view) return;
    setView(next);
    const params = new URLSearchParams(searchParams.toString());
    if (next === 'grid') {
      params.delete('view');
    } else {
      params.set('view', next);
    }
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-end">
        <span id="catalogue-view-label" className="sr-only">
          Mode d'affichage
        </span>
        <ToggleGroup
          type="single"
          value={view}
          onValueChange={handleChange}
          variant="outline"
          size="sm"
          spacing={0}
          aria-label="Mode d'affichage"
        >
          <ToggleGroupItem value="grid" aria-label="Afficher en grille">
            <LayoutGrid className="size-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="Afficher en liste">
            <Rows3 className="size-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {articles.map((a) => (
            <ArticleCard key={a.reference} article={a} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {articles.map((a) => (
            <ArticleListItem key={a.reference} article={a} />
          ))}
        </div>
      )}
    </>
  );
}

export function parseCatalogueView(value: string | undefined): CatalogueView {
  return isView(value) ? value : 'grid';
}

export { VIEW_VALUES };