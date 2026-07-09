'use client';

import type { Article } from '@extracom/site-kit';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { ArticleCard } from './ArticleCard';

/**
 * Carrousel d'articles (embla via shadcn). Construit ses propres cartes : la
 * première reçoit `priority` pour que son image démarre tout de suite (c'est
 * l'image au-dessus de la ligne de flottaison, qui détermine le LCP perçu).
 */
export function FeaturedCarousel({ articles }: { articles: Article[] }) {
  return (
    <Carousel opts={{ align: 'start', loop: false }} className="w-full">
      <CarouselContent className="-ml-4">
        {articles.map((a, i) => (
          <CarouselItem
            key={a.reference}
            className="basis-3/4 pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
          >
            <ArticleCard article={a} priority={i === 0} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  );
}
