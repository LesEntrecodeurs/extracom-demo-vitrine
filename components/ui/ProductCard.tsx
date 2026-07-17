import Link from "next/link";
import { Badge } from "./Badge";
import { cn } from "@/lib/utils";
import { formatPrice } from "@extracom/site-kit";

interface ProductCardProps {
  reference: string;
  name: string;
  category?: string;
  price?: number | null;
  imageUrl?: string;
  badge?: { label: string; variant?: "default" | "secondary" | "success" } | null;
  className?: string;
}

export function ProductCard({
  reference,
  name,
  category,
  price,
  imageUrl,
  badge,
  className,
}: ProductCardProps) {
  return (
    <Link
      href={`/produit/${reference}`}
      className={cn(
        "group block rounded-lg border border-border/40 bg-white transition-all duration-200 hover:border-border/70 hover:shadow-xs",
        className
      )}
    >
      <div className="relative aspect-square bg-surface-secondary/20 flex items-center justify-center overflow-hidden rounded-t-lg">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="object-contain p-5 w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-text-secondary/20">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {badge && (
          <div className="absolute top-2.5 left-2.5">
            <Badge variant={badge.variant || "secondary"}>{badge.label}</Badge>
          </div>
        )}
      </div>

      <div className="p-3.5 space-y-1">
        <p className="text-[10px] font-mono text-text-secondary/40 tracking-wider uppercase">
          {reference}
        </p>
        <h3 className="font-medium text-text text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {name}
        </h3>
        {category && (
          <p className="text-xs text-text-secondary/50">{category}</p>
        )}
        {price !== null && price !== undefined ? (
          <p className="font-semibold text-text text-sm pt-0.5">
            {formatPrice(price)}
          </p>
        ) : (
          <p className="text-xs text-text-secondary/40 pt-0.5">Connectez-vous pour voir le tarif</p>
        )}
      </div>
    </Link>
  );
}
