import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

export type FaqItem = {
  question: string;
  /** Réponse answer-first affichée à l'écran. Peut contenir du JSX (liens internes, emphase). */
  answer: React.ReactNode;
  /** Réponse en texte brut, utilisée pour le JSON-LD `FAQPage`. */
  textAnswer: string;
};

export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <Accordion type="multiple" className="w-full">
      {items.map((it, i) => (
        <AccordionItem
          key={it.question}
          value={`q-${i}`}
          className="border-neutral-200"
        >
          <AccordionTrigger className="text-base font-medium text-neutral-900 hover:no-underline">
            {it.question}
          </AccordionTrigger>
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

export { Link };
