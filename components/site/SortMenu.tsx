'use client';

import { useRouter } from 'next/navigation';
import { ArrowUpDown } from 'lucide-react';
import type { ArticleSort } from '@extracom/site-kit';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

export interface SortCurrent {
  q?: string;
  family?: string;
  catalog?: string;
  clevel?: string;
  pmin?: string;
  pmax?: string;
  sort?: string;
}

export const SORTS: { value: ArticleSort; label: string }[] = [
  { value: 'name_asc', label: 'Nom (A → Z)' },
  { value: 'name_desc', label: 'Nom (Z → A)' },
  { value: 'ref_asc', label: 'Référence (A → Z)' },
  { value: 'ref_desc', label: 'Référence (Z → A)' }
];

export function SortMenu({ current }: { current: SortCurrent }) {
  const router = useRouter();

  const apply = (sort: string) => {
    const p = new URLSearchParams();
    if (current.q) p.set('q', current.q);
    if (current.family) p.set('family', current.family);
    if (current.catalog) {
      p.set('catalog', current.catalog);
      if (current.clevel) p.set('clevel', current.clevel);
    }
    if (current.pmin) p.set('pmin', current.pmin);
    if (current.pmax) p.set('pmax', current.pmax);
    if (sort) p.set('sort', sort);
    const qs = p.toString();
    router.push(qs ? `/catalogue?${qs}` : '/catalogue');
  };

  return (
    <Select
      value={current.sort ?? 'name_asc'}
      onValueChange={(v) => apply(v)}
    >
      <SelectTrigger className="w-[210px] border-neutral-300 bg-white shadow-sm">
        <ArrowUpDown className="size-4 text-neutral-500" />
        <SelectValue placeholder="Trier par" />
      </SelectTrigger>
      <SelectContent>
        {SORTS.map((s) => (
          <SelectItem key={s.value} value={s.value}>
            {s.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}