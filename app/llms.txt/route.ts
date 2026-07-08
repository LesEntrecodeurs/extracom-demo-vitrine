import { getContextAction } from '@extracom/site-kit/server';
import { siteUrl } from '@/lib/seo';
import { shopInfo } from '@/data/shop';

// GEO (Generative Engine Optimization) : fichier `llms.txt` lu par les
// assistants/moteurs génératifs pour comprendre le site. Décrit la boutique,
// ses coordonnées, son secteur, ses forces — sans donnée sensible (pas de
// prix ni de stock).
export const dynamic = 'force-dynamic';

export async function GET() {
  let name = 'Boutique';
  let categories: string[] = [];
  try {
    const c = await getContextAction();
    name = c.branding?.name ?? c.shopName ?? name;
    categories = (c.catalogTree ?? []).slice(0, 20).map((n) => n.label);
  } catch {
    /* dégrade proprement */
  }

  const body = `# ${name}

> ${shopInfo.shortDescription}

## Présentation
- Slogan : ${shopInfo.tagline}
- Activité : fournisseur de pièces détachées automobiles pour garagistes professionnels et particuliers.
- Spécialisation : ${shopInfo.specialty.join(', ')}.
- Année de fondation : ${shopInfo.foundingDate} (plus de 40 ans d'expérience).

## Coordonnées
- Adresse : ${shopInfo.address.street}, ${shopInfo.address.postalCode} ${shopInfo.address.city}
- Téléphone : ${shopInfo.phone}
- Email : ${shopInfo.email}
- Horaires : du lundi au samedi, de 8h à 18h.

## Livraison
- Zone desservie : ${shopInfo.serviceArea} (région Auvergne-Rhône-Alpes).
- Délai standard : ${shopInfo.deliveryPromise}.

## Site
- Site : ${siteUrl()}
- Catalogue : ${siteUrl()}/catalogue
- Contact : ${siteUrl()}/contact
- À propos : ${siteUrl()}/a-propos
${categories.length ? `\n## Catégories du catalogue\n${categories.map((c) => `- ${c}`).join('\n')}\n` : ''}
## Notes
- Les prix par client et le stock peuvent nécessiter une connexion.
- Pour commander : créer un compte puis se connecter.
`;
  return new Response(body, {
    headers: { 'content-type': 'text/plain; charset=utf-8' }
  });
}
