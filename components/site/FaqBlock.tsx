import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

export type FaqItem = {
  question: string;
  answer: React.ReactNode;
};

export function FaqBlock({
  heading,
  description,
  items
}: {
  heading: string;
  description?: string;
  items: FaqItem[];
}) {
  return (
    <section>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">{heading}</h2>
        {description ? (
          <p className="mt-1 text-sm text-neutral-500">{description}</p>
        ) : null}
      </div>
      <Accordion
        type="single"
        collapsible
        className="card divide-y divide-neutral-200 px-4"
      >
        {items.map((item, i) => (
          <AccordionItem key={item.question} value={`item-${i}`}>
            <AccordionTrigger className="text-base font-medium hover:no-underline">
              {item.question}
            </AccordionTrigger>
            <AccordionContent>
              <div className="text-sm leading-relaxed text-neutral-600">
                {item.answer}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}