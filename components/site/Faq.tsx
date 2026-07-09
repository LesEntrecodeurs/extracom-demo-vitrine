"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

export type FaqItem = {
  q: string;
  a: string;
  link?: { label: string; href: string };
};

export function Faq({
  title = "Questions fréquentes",
  subtitle,
  items
}: {
  title?: string;
  subtitle?: string;
  items: FaqItem[];
}) {
  return (
    <section>
      <h2 className="text-2xl font-semibold">{title}</h2>
      {subtitle ? (
        <p className="mt-1 mb-6 text-sm text-neutral-500">{subtitle}</p>
      ) : (
        <div className="mb-6" />
      )}
      <div className="rounded-2xl border border-neutral-200 bg-white px-6">
        <Accordion type="single" collapsible className="w-full">
          {items.map((item, i) => (
            <AccordionItem key={item.q} value={`faq-${i}`}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>
                <p className="text-neutral-700">{item.a}</p>
                {item.link && (
                  <a
                    href={item.link.href}
                    className="mt-3 inline-block text-sm font-medium text-[var(--brand-dark)] hover:underline"
                  >
                    {item.link.label} →
                  </a>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
