"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";

export default function CgvPage() {
  return (
    <Container className="py-12">
      <nav className="flex items-center gap-2 text-sm text-text-secondary mb-8">
        <Link href="/" className="hover:text-primary">Accueil</Link>
        <span>/</span>
        <span className="text-text font-medium">Conditions générales de vente</span>
      </nav>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold font-heading mb-4">Conditions générales de vente</h1>
        <p className="text-text-secondary mb-10">
          Dernière mise à jour : janvier 2025
        </p>

        <div className="space-y-8 text-text-secondary leading-relaxed">
          <section>
            <h2 className="text-xl font-bold font-heading text-text mb-4">1. Objet</h2>
            <p>
              Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles
              entre la société Wédis et tout client professionnel ou particulier souhaitant acquérir
              des produits ou services proposés sur le site wedis.fr.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-heading text-text mb-4">2. Produits et services</h2>
            <p>
              Wédis propose à la vente du matériel de nettoyage professionnel (autolaveuses,
              aspirateurs, monobrosses, balayeuses, robots de nettoyage, chariots, produits d&apos;entretien…)
              ainsi que des prestations de service (SAV, location, formation).
            </p>
            <p className="mt-3">
              Les caractéristiques essentielles des produits sont décrites sur les fiches produits.
              Les photographies et descriptions sont fournies à titre indicatif et ne sont pas
              contractuelles.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-heading text-text mb-4">3. Prix</h2>
            <p>
              Les prix sont indiqués en euros, hors taxes (HT) et toutes taxes comprises (TTC)
              selon le statut du client. Les frais de livraison sont calculés au cas par cas et
              communiqués avant validation de la commande.
            </p>
            <p className="mt-3">
              Wédis se réserve le droit de modifier ses prix à tout moment. Les produits sont
              facturés sur la base des tarifs en vigueur au moment de la validation de la commande.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-heading text-text mb-4">4. Commandes</h2>
            <p>
              La commande est validée après confirmation du paiement ou acceptation du devis.
              Wédis confirme la disponibilité des produits et le délai de livraison sous 48 heures
              ouvrées.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-heading text-text mb-4">5. Livraison</h2>
            <p>
              Wédis intervient dans toute la région Grand Est (Meurthe-et-Moselle, Meuse, Moselle,
              Vosges, Ardennes, Marne, Haute-Marne, Aube). La livraison est effectuée par nos
              équipes ou par transporteur.
            </p>
            <p className="mt-3">
              Les délais de livraison sont donnés à titre indicatif. En cas de retard,
              Wédis informera le client dans les meilleurs délais.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-heading text-text mb-4">6. Paiement</h2>
            <p>
              Les modes de paiement acceptés sont : carte bancaire, virement bancaire, chèque
              (sous réserve d&apos;acceptation). Le paiement est exigible à la commande, sauf
              conditions particulières convenues par écrit.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-heading text-text mb-4">7. Garantie et SAV</h2>
            <p>
              Tous les produits vendus par Wédis bénéficient de la garantie légale de conformité
              et de la garantie des vices cachés. Les garanties constructeur s&apos;appliquent selon
              les conditions propres à chaque marque (Kärcher, Nilfisk, Numatic…).
            </p>
            <p className="mt-3">
              Le SAV Wédis assure la maintenance et les réparations de tout le matériel vendu,
              dans nos ateliers à Neuves-Maisons ou sur site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-heading text-text mb-4">8. Droit de rétractation</h2>
            <p>
              Conformément à la législation en vigueur, le client professionnel dispose d&apos;un
              délai de 14 jours pour exercer son droit de rétractation, sauf pour les produits
              confectionnés selon les spécifications du client ou les produits d&apos;entretien.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-heading text-text mb-4">9. Litiges</h2>
            <p>
              Les présentes CGV sont soumises au droit français. En cas de litige, le client
              s&apos;adressera par priorité à Wédis pour trouver une solution amiable. À défaut,
              les tribunaux compétents sont ceux du ressort de Nancy.
            </p>
          </section>
        </div>
      </div>
    </Container>
  );
}
