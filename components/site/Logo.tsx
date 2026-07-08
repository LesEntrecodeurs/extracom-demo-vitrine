import type { SVGProps } from 'react';

type LogoProps = {
  className?: string;
  title?: string;
} & Omit<SVGProps<SVGSVGElement>, 'className' | 'children'>;

/**
 * Sigle de la marque — marmite stylisée + vapeur, en bleu.
 * Suit la couleur via `currentColor` (Tailwind : text-[var(--brand)] …).
 */
export function Logo({ className, title = 'Logo', ...rest }: LogoProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      className={className}
      fill="none"
      {...rest}
    >
      <circle cx="32" cy="32" r="30" fill="currentColor" opacity="0.1" />
      <g
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 30h36c0 1.1-.9 2-2 2H16c-1.1 0-2-.9-2-2Z" opacity="0.35" />
        <rect x="16" y="32" width="32" height="18" rx="3" />
        <path d="M14 36h-2a3 3 0 0 0 0 6h2" />
        <path d="M50 36h2a3 3 0 0 1 0 6h-2" />
        <rect x="20" y="26" width="24" height="6" rx="1.5" />
        <path d="M24 22c0-2 1.6-2 1.6-4" />
        <path d="M32 22c0-2 1.6-2 1.6-4" />
        <path d="M40 22c0-2 1.6-2 1.6-4" />
      </g>
    </svg>
  );
}
