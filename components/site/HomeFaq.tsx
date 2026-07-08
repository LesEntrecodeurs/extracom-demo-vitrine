'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import type { FaqItem } from '@/data/homeFaq';

export function HomeFaq({ items }: { items: FaqItem[] }) {
  if (!items.length) return null;
  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:items-start">
      <div className="max-w-md">
        <p className="text-xs font-semibold tracking-[0.2em] text-[var(--brand-dark)] uppercase">
          FAQ
        </p>
        <h2 className="mt-3 text-2xl font-semibold">Questions fréquentes</h2>
        <p className="mt-3 text-sm text-neutral-600">
          Les réponses aux questions que nos clients professionnels nous
          posent le plus souvent. Une interrogation particulière ?{' '}
          <a
            href="/contact"
            className="font-medium text-[var(--brand-dark)] underline"
          >
            Contactez-nous
          </a>
          .
        </p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white">
        <Accordion type="single" collapsible defaultValue="faq-0">
          {items.map((item, i) => (
            <AccordionItem key={item.question} value={`faq-${i}`}>
              <AccordionTrigger className="px-4 text-left text-base hover:no-underline sm:px-5">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="px-4 text-sm leading-relaxed text-neutral-600 sm:px-5">
                {item.rich}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}