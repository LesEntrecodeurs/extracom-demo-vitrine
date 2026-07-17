import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  alt?: boolean;
  id?: string;
}

export function Section({ children, className, alt, id }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "py-12 md:py-16 lg:py-20",
        alt && "bg-[#F8F9FA]",
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}
