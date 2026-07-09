import Link from 'next/link';
import type { ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem
} from '@/components/ui/pagination';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type PageItem = number | 'ellipsis-start' | 'ellipsis-end';

export function CataloguePagination({
  page,
  totalPages,
  total,
  pageSize,
  itemCount,
  getHref
}: {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  itemCount: number;
  getHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  const firstItem = (page - 1) * pageSize + 1;
  const lastItem = Math.min(firstItem + itemCount - 1, total);
  const pageItems = getPageItems(page, totalPages);

  return (
    <div className="mt-8 space-y-3">
      <p className="text-center text-sm text-neutral-500">
        Articles {firstItem} à {lastItem} sur {total}
      </p>
      <Pagination aria-label="Pagination du catalogue">
        <PaginationContent>
          <PaginationItem>
            {page > 1 ? (
              <PaginationButton
                href={getHref(page - 1)}
                ariaLabel="Aller à la page précédente"
                size="default"
                className="gap-1 px-2.5 sm:pl-2.5"
              >
                <ChevronLeft />
                <span className="hidden sm:block">Précédent</span>
              </PaginationButton>
            ) : (
              <DisabledPaginationButton className="gap-1 px-2.5 sm:pl-2.5">
                <ChevronLeft />
                <span className="hidden sm:block">Précédent</span>
              </DisabledPaginationButton>
            )}
          </PaginationItem>

          {pageItems.map((item) =>
            typeof item === 'number' ? (
              <PaginationItem key={item}>
                <PaginationButton
                  href={getHref(item)}
                  isActive={item === page}
                  ariaLabel={
                    item === page
                      ? `Page ${item}, page actuelle`
                      : `Aller à la page ${item}`
                  }
                >
                  {item}
                </PaginationButton>
              </PaginationItem>
            ) : (
              <PaginationItem key={item}>
                <span className="flex size-9 items-center justify-center text-neutral-400">
                  <span aria-hidden>…</span>
                  <span className="sr-only">Pages intermédiaires</span>
                </span>
              </PaginationItem>
            )
          )}

          <PaginationItem>
            {page < totalPages ? (
              <PaginationButton
                href={getHref(page + 1)}
                ariaLabel="Aller à la page suivante"
                size="default"
                className="gap-1 px-2.5 sm:pr-2.5"
              >
                <span className="hidden sm:block">Suivant</span>
                <ChevronRight />
              </PaginationButton>
            ) : (
              <DisabledPaginationButton className="gap-1 px-2.5 sm:pr-2.5">
                <span className="hidden sm:block">Suivant</span>
                <ChevronRight />
              </DisabledPaginationButton>
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

function PaginationButton({
  href,
  children,
  isActive,
  ariaLabel,
  size = 'icon',
  className
}: {
  href: string;
  children: ReactNode;
  isActive?: boolean;
  ariaLabel: string;
  size?: 'default' | 'icon';
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        buttonVariants({ variant: isActive ? 'outline' : 'ghost', size }),
        className
      )}
    >
      {children}
    </Link>
  );
}

function DisabledPaginationButton({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      aria-disabled="true"
      className={cn(
        buttonVariants({ variant: 'ghost', size: 'default' }),
        'pointer-events-none text-neutral-300',
        className
      )}
    >
      {children}
    </span>
  );
}

function getPageItems(page: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  let start = Math.max(2, page - 1);
  let end = Math.min(totalPages - 1, page + 1);

  if (page <= 3) {
    end = Math.min(4, totalPages - 1);
  }

  if (page >= totalPages - 2) {
    start = Math.max(2, totalPages - 3);
  }

  const items: PageItem[] = [1];

  if (start > 2) {
    items.push('ellipsis-start');
  } else {
    for (let p = 2; p < start; p += 1) items.push(p);
  }

  for (let p = start; p <= end; p += 1) items.push(p);

  if (end < totalPages - 1) {
    items.push('ellipsis-end');
  } else {
    for (let p = end + 1; p < totalPages; p += 1) items.push(p);
  }

  items.push(totalPages);
  return items;
}
