'use client';

import type { ReactNode } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

/**
 * Bloc FAQ : questions / réponses en accordéon. Réutilisable sur toute page
 * `editorial` qui expose des questions contextuelles. À associer au JSON-LD
 * `FAQPage` (helper `faqLd(...)` de `lib/seo.ts`) injecté via `<JsonLd />`
 * dans la page qui l'utilise.
 *
 * `items[].answer` accepte du JSX pour permettre les liens internes
 * (maillage vers catalogue, inscription, contact…).
 */
export function FaqAccordion({
  items,
  className
}: {
  items: { question: string; answer: ReactNode }[];
  className?: string;
}) {
  return (
    <Accordion
      type="single"
      collapsible
      className={className ?? 'w-full'}
    >
      {items.map((it, i) => (
        <AccordionItem key={i} value={`q-${i}`}>
          <AccordionTrigger>{it.question}</AccordionTrigger>
          <AccordionContent>
            <div className="text-sm leading-relaxed text-neutral-600">
              {it.answer}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
