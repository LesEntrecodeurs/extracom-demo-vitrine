import type { Metadata } from 'next';
import Link from 'next/link';
import { ClipboardList, LockKeyhole, MessageCircle, PackageSearch } from 'lucide-react';
import { getContextAction } from '@extracom/site-kit/server';
import { ContactForm } from '@/components/site/ContactForm';
import { JsonLd } from '@/components/site/JsonLd';
import { absoluteUrl, breadcrumbLd, faqLd, webPageLd } from '@/lib/seo';

export const dynamic = 'force-dynamic';

const description =
  'Contactez notre équipe pour une question catalogue, commande, devis ou compte professionnel.';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Contact et support professionnel',
    description,
    alternates: { canonical: '/contact' },
    openGraph: {
      title: 'Contact et support professionnel',
      description,
      type: 'website',
      url: '/contact'
    }
  };
}

export default async function ContactPage() {
  const shopName = await getShopName();
  const faq = contactFaq(shopName);
  const contactPageLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: `Contacter ${shopName}`,
    url: absoluteUrl('/contact'),
    description,
    mainEntity: {
      '@type': 'Organization',
      name: shopName,
      url: absoluteUrl('/'),
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        availableLanguage: 'fr'
      }
    }
  };

  return (
    <div className="space-y-12">
      <JsonLd data={webPageLd(`Contacter ${shopName}`, '/contact', description)} />
      <JsonLd
        data={breadcrumbLd([
          { name: 'Accueil', path: '/' },
          { name: 'Contact', path: '/contact' }
        ])}
      />
      <JsonLd data={contactPageLd} />
      <JsonLd data={faqLd(faq)} />

      <section className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-stretch">
        <div className="hero-mesh grain rounded-3xl border border-[var(--brand)]/15 p-6 md:p-8">
          <p className="text-xs font-semibold tracking-[0.2em] text-[var(--brand-dark)] uppercase">
            Contact
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl leading-tight font-semibold text-neutral-900 md:text-5xl">
            Contacter {shopName}
          </h1>
          <p className="mt-4 max-w-xl text-base text-neutral-700 md:text-lg">
            Une question sur le catalogue, une commande, un devis ou votre compte
            professionnel ? Envoyez-nous un message depuis votre espace client :
            votre demande sera rattachée à votre société pour un suivi plus
            rapide.
          </p>
          <div className="mt-8 grid gap-3">
            {contactHighlights.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/70 bg-white/75 p-4 shadow-sm backdrop-blur"
              >
                <div className="flex items-start gap-3">
                  <span className="text-[var(--brand)]">{item.icon}</span>
                  <div>
                    <h2 className="text-sm font-semibold text-neutral-900">
                      {item.title}
                    </h2>
                    <p className="mt-1 text-sm text-neutral-600">{item.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <ContactForm />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {requestTips.map((tip) => (
          <div key={tip.title} className="card p-5">
            <span className="text-[var(--brand)]">{tip.icon}</span>
            <h2 className="mt-3 text-base font-semibold">{tip.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              {tip.text}
            </p>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-neutral-200 bg-white p-6 md:p-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-[var(--brand-dark)] uppercase">
            Aide
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-neutral-900">
            Questions fréquentes
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            Les réponses essentielles avant de nous envoyer votre message.
          </p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {faq.map((item) => (
            <article key={item.question} className="rounded-2xl bg-neutral-50 p-5">
              <h3 className="text-sm font-semibold text-neutral-900">
                {item.question}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                {item.answer}
              </p>
            </article>
          ))}
        </div>
        <div className="mt-6 rounded-2xl bg-[var(--brand-light)] p-5 text-sm text-neutral-700">
          Vous souhaitez consulter vos commandes avant d’écrire ? Rendez-vous dans{' '}
          <Link href="/compte" className="font-medium text-[var(--brand-dark)] underline">
            votre espace client
          </Link>{' '}
          ou parcourez le{' '}
          <Link href="/catalogue" className="font-medium text-[var(--brand-dark)] underline">
            catalogue
          </Link>
          .
        </div>
      </section>
    </div>
  );
}

async function getShopName() {
  try {
    const context = await getContextAction();
    return context.branding?.name ?? context.shopName ?? 'Boutique';
  } catch {
    return 'Boutique';
  }
}

const contactHighlights = [
  {
    title: 'Formulaire sécurisé',
    text: 'Le message part depuis un compte connecté afin de mieux identifier votre société.',
    icon: <LockKeyhole className="size-5" />
  },
  {
    title: 'Suivi plus simple',
    text: 'Votre demande conserve le contexte utile : compte, commande ou besoin commercial.',
    icon: <ClipboardList className="size-5" />
  },
  {
    title: 'Réponse ciblée',
    text: 'Ajoutez l’objet, l’email de réponse et le détail de votre demande.',
    icon: <MessageCircle className="size-5" />
  }
];

const requestTips = [
  {
    title: 'Question catalogue',
    text: 'Indiquez la référence de l’article, la quantité souhaitée et l’usage prévu pour faciliter la réponse.',
    icon: <PackageSearch className="size-6" />
  },
  {
    title: 'Commande ou devis',
    text: 'Ajoutez la référence de commande ou les articles concernés pour que l’équipe retrouve rapidement le dossier.',
    icon: <ClipboardList className="size-6" />
  },
  {
    title: 'Compte professionnel',
    text: 'Décrivez le blocage rencontré : connexion, accès aux tarifs, société rattachée ou information à mettre à jour.',
    icon: <LockKeyhole className="size-6" />
  }
];

function contactFaq(shopName: string) {
  return [
    {
      question: `Comment contacter ${shopName} ?`,
      answer: `${shopName} reçoit les demandes depuis le formulaire de cette page. Connectez-vous à votre compte professionnel, indiquez l’objet, votre email de réponse et votre message. Nous rattachons ainsi la demande à votre société pour un suivi plus précis.`
    },
    {
      question: `Pourquoi ${shopName} demande-t-elle une connexion pour le formulaire ?`,
      answer: `${shopName} réserve le formulaire aux comptes connectés afin d’identifier la société, les commandes et les tarifs associés. Nous évitons ainsi les demandes anonymes incomplètes et pouvons répondre avec le bon contexte commercial.`
    },
    {
      question: `Que faut-il indiquer dans un message envoyé à ${shopName} ?`,
      answer: `${shopName} répond plus vite quand la demande est précise. Ajoutez la référence de commande ou d’article, le besoin attendu, les quantités utiles et l’email où vous souhaitez recevoir la réponse.`
    }
  ];
}
