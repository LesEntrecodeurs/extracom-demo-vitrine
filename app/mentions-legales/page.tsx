"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";

export default function MentionsLegalesPage() {
  return (
    <Container className="py-12">
      <nav className="flex items-center gap-2 text-sm text-text-secondary mb-8">
        <Link href="/" className="hover:text-primary">Accueil</Link>
        <span>/</span>
        <span className="text-text font-medium">Mentions légales</span>
      </nav>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold font-heading mb-10">Mentions légales</h1>

        <div className="space-y-8 text-text-secondary leading-relaxed">
          <section>
            <h2 className="text-xl font-bold font-heading text-text mb-4">Éditeur du site</h2>
            <p>
              <strong>Wédis</strong><br />
              Société par actions simplifiée (SAS)<br />
              678 avenue du Général Leclerc<br />
              54130 Neuves-Maisons<br />
              France
            </p>
            <p className="mt-3">
              Tél. : <a href="tel:0383472626" className="text-primary hover:underline">03 83 47 26 26</a><br />
              Email : <a href="mailto:contact@wedis.fr" className="text-primary hover:underline">contact@wedis.fr</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-heading text-text mb-4">Numéro d&apos;identification</h2>
            <p>
              SIRET : À compléter<br />
              TVA intracommunautaire : À compléter<br />
              Code APE : À compléter
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-heading text-text mb-4">Directeur de la publication</h2>
            <p>Le directeur de la publication est le représentant légal de la société Wédis.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-heading text-text mb-4">Hébergement</h2>
            <p>
              Le site est hébergé par Vercel Inc.<br />
              340 S Lemon Ave #4133<br />
              Walnut, CA 91789<br />
              États-Unis
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-heading text-text mb-4">Propriété intellectuelle</h2>
            <p>
              L&apos;ensemble du contenu du site (textes, images, logos, vidéos) est la propriété exclusive
              de Wédis, sauf mention contraire. Toute reproduction, distribution, modification ou
              utilisation de ces éléments sans autorisation écrite préalable est interdite.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-heading text-text mb-4">Protection des données</h2>
            <p>
              Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi
              Informatique et Libertés, vous disposez d&apos;un droit d&apos;accès, de rectification,
              d&apos;effacement et de portabilité de vos données personnelles.
            </p>
            <p className="mt-3">
              Pour exercer vos droits, contactez-nous à :{" "}
              <a href="mailto:contact@wedis.fr" className="text-primary hover:underline">contact@wedis.fr</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-heading text-text mb-4">Cookies</h2>
            <p>
              Ce site utilise des cookies strictement nécessaires à son fonctionnement. Aucun cookie
              publicitaire ou de traçage n&apos;est utilisé sans votre consentement explicite.
            </p>
          </section>
        </div>
      </div>
    </Container>
  );
}
