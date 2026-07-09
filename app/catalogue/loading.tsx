import {
  ProductGridSkeleton,
  Skeleton,
  Spinner
} from '@/components/site/Loader';

export default function Loading() {
  return (
    <div>
      {/* Bandeau de statut : rassure le visiteur pendant le re-fetch
          (filtres, tri, recherche…). Le squelette en dessous reprend la
          forme du contenu pour limiter la perception de « blanc ». */}
      <div
        role="status"
        aria-live="polite"
        className="mb-6 flex items-center gap-3 text-sm text-neutral-500"
      >
        <Spinner className="h-4 w-4 text-[var(--brand)]" />
        <span>Chargement du catalogue…</span>
      </div>

      <Skeleton className="mb-4 h-10 w-full max-w-md" />
      <div className="mb-6 flex gap-3">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-9 w-40" />
      </div>
      <ProductGridSkeleton count={8} />
    </div>
  );
}
