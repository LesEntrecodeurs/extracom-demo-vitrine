import Link from 'next/link';
import {
  Truck,
  ShieldCheck,
  MessageCircle,
  UserPlus,
  BadgeEuro,
  ClipboardCheck,
  Search,
  ArrowRight
} from 'lucide-react';
import {
  getArticlesAction,
  getContextAction,
  meAction
} from '@extracom/site-kit/server';
import type { Article, ShopContext, User } from '@extracom/site-kit';
import { ArticleCard } from '@/components/site/ArticleCard';
import { FeaturedCarousel } from '@/components/site/FeaturedCarousel';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let featured: Article[] = [];
  let context: ShopContext | null = null;
  try {
    featured = (await getArticlesAction({ limit: 8 })).data;
  } catch {
    featured = [];
  }
  try {
    context = await getContextAction();
  } catch {
    context = null;
  }
  // État connecté → on adapte l'onboarding (un client connecté n'a pas besoin
  // du « comment ça marche » ni du CTA inscription).
  let user: User | null = null;
  try {
    user = await meAction();
  } catch {
    user = null;
  }
  const isAnonymous = !user;
  const registrationOpen = context?.capabilities?.registrationOpen ?? false;

  const bagueArgen = featured.find((article) =>
    article.label?.toLowerCase().includes('bague argen')
  );

  return (
    <div className="space-y-16">
      <section className="hero-mesh grain relative overflow-hidden rounded-3xl border border-[var(--brand)]/15">
        <div className="relative z-10 flex flex-col items-center px-6 py-14 sm:px-10 md:px-14 md:py-20 text-center">
          {bagueArgen && (
            <div className="mb-8 w-full max-w-md">
              <ArticleCard article={bagueArgen} />
            </div>
          )}
          <h1 className="reveal reveal-2 mt-4 w-full text-4xl leading-[1.05] font-semibold text-neutral-900 md:text-6xl">
            Bienvenue sur notre boutique
          </h1>
          <p className="reveal reveal-3 mt-5 mx-auto max-w-xl text-base text-neutral-700 md:text-lg">
            Découvrez nos créations, à commencer par notre bague "Bague Argen".
          </p>
        </div>
      </section>
    </div>
  );
}

// Signaux de confiance affichés dans la hero (personnalisables).
const trust = [
  { value: '24–48h', label: 'Livraison' },
  { value: '100%', label: 'Tarifs négociés' },
  { value: 'Devis', label: 'En 1 clic' }
];

// Étapes d'onboarding du parcours B2B (accueil, visiteur anonyme).
const steps = [
  {
    title: 'Créez votre compte',
    text: 'Inscription professionnelle en quelques minutes, validée par un commercial.',
    icon: <UserPlus className="size-6" />
  },
  {
    title: 'Vos tarifs s’affichent',
    text: 'Une fois connecté : prix négociés, remises et centrale d’achat appliqués.',
    icon: <BadgeEuro className="size-6" />
  },
  {
    title: 'Commandez ou devisez',
    text: 'Ajoutez au panier puis passez commande, ou demandez un devis selon vos droits.',
    icon: <ClipboardCheck className="size-6" />
  }
];

const valueProps = [
  {
    title: 'Livraison rapide',
    text: 'Expédition sous 24–48h',
    icon: <Truck className="size-6" />
  },
  {
    title: 'Paiement sécurisé',
    text: 'Transactions protégées',
    icon: <ShieldCheck className="size-6" />
  },
  {
    title: 'Support dédié',
    text: 'Une équipe à votre écoute',
    icon: <MessageCircle className="size-6" />
  }
];
