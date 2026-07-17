"use client";

import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { ShoppingCart, Check, ChevronRight, Minus, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { useAuth, useArticle, useAddToCart, useArticles } from "@extracom/site-kit/react";
import { useState } from "react";
import { toast } from "sonner";
import { ProductCard } from "@/components/ui/ProductCard";
import { formatPrice } from "@extracom/site-kit";

function ProductPageContent({ reference }: { reference: string }) {
  const { user } = useAuth();
  const { data: article, isLoading, error: articleError } = useArticle(reference);
  const { addItem, isLoading: isAdding } = useAddToCart();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const { data: relatedData } = useArticles(
    article?.family?.code
      ? { familyCode: article.family.code, limit: 4 }
      : undefined
  );
  const relatedProducts = relatedData?.data?.filter(
    (p) => p.reference !== reference
  ) || [];

  if (isLoading) {
    return (
      <Container className="py-16">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-text-secondary">Chargement du produit…</span>
        </div>
      </Container>
    );
  }

  if (articleError || !article) {
    notFound();
  }

  const handleAddToCart = async () => {
    try {
      await addItem({
        reference: article.reference,
        quantity,
      });
      setAddedToCart(true);
      toast.success("Ajouté au panier");
      setTimeout(() => setAddedToCart(false), 3000);
    } catch (err) {
      toast.error("Erreur lors de l'ajout au panier");
    }
  };

  return (
    <>
      <Container className="py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-secondary mb-8">
          <Link href="/" className="hover:text-primary">Accueil</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/catalogue" className="hover:text-primary">Catalogue</Link>
          {article.family && (
            <>
              <ChevronRight className="h-3 w-3" />
              <Link
                href={`/catalogue?famille=${article.family.code}`}
                className="hover:text-primary"
              >
                {article.family.label}
              </Link>
            </>
          )}
          <ChevronRight className="h-3 w-3" />
          <span className="text-text font-medium truncate">{article.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <div className="aspect-square bg-surface-secondary rounded-lg flex items-center justify-center overflow-hidden">
            {article.imageUrl ? (
              <img
                src={article.imageUrl}
                alt={article.title}
                className="object-contain p-8 w-full h-full"
              />
            ) : (
              <div className="text-text-secondary flex flex-col items-center gap-2">
                <ShoppingCart className="h-8 w-8 text-text-secondary/40" />
                <span className="text-sm">Image non disponible</span>
              </div>
            )}
          </div>

          {/* BuyBox */}
          <div className="space-y-6">
            <p className="text-xs font-medium text-text-secondary uppercase tracking-wider">
              Réf. {article.reference}
            </p>

            <h1 className="text-3xl md:text-4xl font-bold font-heading leading-tight">
              {article.title}
            </h1>

            {article.description && (
              <p className="text-text-secondary leading-relaxed">
                {article.description}
              </p>
            )}

            {/* Prix */}
            <div className="py-4 border-y border-border">
              {article.price !== null && article.price !== undefined ? (
                <div>
                  <p className="text-3xl font-bold font-heading">
                    {formatPrice(article.price)}
                  </p>
                  <p className="text-xs text-text-secondary mt-1">
                    {article.unit === "pce" || article.unit === "pièce" ? "À l'unité" : `Par ${article.unit}`}
                  </p>
                  {article.stockQuantity !== undefined && (
                    <p className="text-xs text-text-secondary mt-1">
                      Stock : {article.stockQuantity}
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <p className="text-text-secondary">
                    {user
                      ? "Connectez-vous pour voir le tarif"
                      : <Link href="/connexion" className="text-primary font-medium hover:underline">Connectez-vous</Link>
                    } pour voir le tarif
                  </p>
                </div>
              )}
            </div>

            {/* Quantité + Add to cart */}
            {user && (
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2.5 hover:bg-surface-secondary transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2.5 text-sm font-medium min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2.5 hover:bg-surface-secondary transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  isLoading={isAdding}
                  disabled={addedToCart}
                  className="flex-1"
                >
                  {addedToCart ? (
                    <>
                      <Check className="mr-2 h-5 w-5" /> Ajouté
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-5 w-5" /> Ajouter au panier
                    </>
                  )}
                </Button>
              </div>
            )}

            {!user && (
              <div className="rounded-lg bg-surface-secondary p-4 text-sm text-text-secondary">
                <Link href="/connexion" className="font-medium text-primary hover:underline">Connectez-vous</Link>{" "}
                pour ajouter ce produit au panier et bénéficier de vos tarifs personnalisés.
              </div>
            )}

            {/* Fiches techniques */}
            {article.documents && article.documents.length > 0 && (
              <div className="pt-4">
                <h3 className="font-medium text-sm mb-2">Fiches techniques</h3>
                <div className="space-y-1">
                  {article.documents.map((doc, i) => (
                    <a
                      key={i}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-primary hover:underline"
                    >
                      {doc.name || "Fiche technique"}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Produits liés */}
        {relatedProducts.length > 0 && (
          <Section>
            <h2 className="text-2xl font-bold font-heading mb-6">Produits associés</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((product) => (
                <ProductCard
                  key={product.reference}
                  reference={product.reference}
                  name={product.title}
                  category={product.family?.label || ""}
                  price={product.price}
                  imageUrl={product.imageUrl}
                />
              ))}
            </div>
          </Section>
        )}
      </Container>
    </>
  );
}

export default function ProductPage({
  params,
}: {
  params: { reference: string };
}) {
  return <ProductPageContent reference={params.reference} />;
}
