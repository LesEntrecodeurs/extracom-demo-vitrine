import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink
} from '@/components/ui/pagination';

type PageItem = number | 'start-ellipsis' | 'end-ellipsis';

interface CataloguePaginationProps {
  currentPage: number;
  totalPages: number;
  getPageHref: (page: number) => string;
}

export function CataloguePagination({
  currentPage,
  totalPages,
  getPageHref
}: CataloguePaginationProps) {
  if (totalPages <= 1) return null;

  const visiblePages = buildVisiblePages(currentPage, totalPages);

  return (
    <div className="mt-8 space-y-3">
      <p className="text-center text-sm text-neutral-500">
        Page {currentPage} sur {totalPages}
      </p>
      <Pagination aria-label="Pagination du catalogue">
        <PaginationContent className="flex-wrap justify-center">
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationLink
                href={getPageHref(currentPage - 1)}
                size="default"
                aria-label="Aller à la page précédente"
                className="gap-1 px-2.5"
              >
                <ChevronLeft className="size-4" />
                <span className="hidden sm:inline">Précédent</span>
              </PaginationLink>
            </PaginationItem>
          )}

          {visiblePages.map((item) =>
            typeof item === 'number' ? (
              <PaginationItem key={item}>
                <PaginationLink
                  href={getPageHref(item)}
                  isActive={item === currentPage}
                  aria-label={
                    item === currentPage
                      ? `Page ${item}, page actuelle`
                      : `Aller à la page ${item}`
                  }
                >
                  {item}
                </PaginationLink>
              </PaginationItem>
            ) : (
              <PaginationItem key={item}>
                <PaginationEllipsis />
              </PaginationItem>
            )
          )}

          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationLink
                href={getPageHref(currentPage + 1)}
                size="default"
                aria-label="Aller à la page suivante"
                className="gap-1 px-2.5"
              >
                <span className="hidden sm:inline">Suivant</span>
                <ChevronRight className="size-4" />
              </PaginationLink>
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}

function buildVisiblePages(currentPage: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages: PageItem[] = [1];
  let start = Math.max(2, currentPage - 1);
  let end = Math.min(totalPages - 1, currentPage + 1);

  if (currentPage <= 4) {
    start = 2;
    end = 5;
  } else if (currentPage >= totalPages - 3) {
    start = totalPages - 4;
    end = totalPages - 1;
  }

  if (start > 2) pages.push('start-ellipsis');

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (end < totalPages - 1) pages.push('end-ellipsis');

  pages.push(totalPages);
  return pages;
}
