"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

export type FaqItem = {
  question: string;
  answer: string;
};

export function FaqSection({
  title,
  intro,
  items
}: {
  title: string;
  intro?: string;
  items: FaqItem[];
}) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-6 md:p-10">
      <div className="mb-6 max-w-2xl">
        <h2 className="text-2xl font-semibold md:text-3xl">{title}</h2>
        {intro && <p className="mt-2 text-neutral-600">{intro}</p>}
      </div>
      <Accordion type="multiple" className="w-full">
        {items.map((item, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger className="text-base font-medium text-neutral-900 md:text-lg">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-neutral-600">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}