"use client";

import { useState } from "react";
import { useAuth, useDelivery } from "@extracom/site-kit/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Container } from "@/components/ui/Container";
import Link from "next/link";
import { toast } from "sonner";
import { Plus, MapPin } from "lucide-react";

function AdressesContent() {
  const { user, isLoading: authLoading } = useAuth();
  const { options, isLoading, addAddress } = useDelivery();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    label: "",
    line1: "",
    line2: "",
    postalCode: "",
    city: "",
  });
  const [isAdding, setIsAdding] = useState(false);

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      await addAddress({
        label: form.label,
        line1: form.line1,
        line2: form.line2 || undefined,
        postalCode: form.postalCode,
        city: form.city,
        country: "France",
      });
      toast.success("Adresse ajoutée");
      setShowForm(false);
      setForm({ label: "", line1: "", line2: "", postalCode: "", city: "" });
    } catch {
      toast.error("Erreur lors de l'ajout de l'adresse");
    } finally {
      setIsAdding(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-28 bg-surface-secondary rounded-lg" />
        ))}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-lg font-medium">Connectez-vous pour gérer vos adresses</p>
        <Link href="/connexion"><Button className="mt-4">Se connecter</Button></Link>
      </div>
    );
  }

  const adresses = options?.addresses || [];

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold font-heading">Mes adresses</h2>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-1 h-4 w-4" /> Ajouter
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="mb-8 rounded-lg border border-border p-6 space-y-4 bg-surface-secondary">
          <h3 className="font-semibold">Nouvelle adresse</h3>
          <Input label="Libellé" placeholder="Ex: Siège social" value={form.label} onChange={(e) => update("label", e.target.value)} required />
          <Input label="Adresse" placeholder="Numéro et rue" value={form.line1} onChange={(e) => update("line1", e.target.value)} required />
          <Input label="Complément" placeholder="Bâtiment, étage…" value={form.line2} onChange={(e) => update("line2", e.target.value)} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Code postal" placeholder="54000" value={form.postalCode} onChange={(e) => update("postalCode", e.target.value)} required />
            <Input label="Ville" placeholder="Nancy" value={form.city} onChange={(e) => update("city", e.target.value)} required />
          </div>
          <div className="flex gap-3">
            <Button type="submit" isLoading={isAdding}>Ajouter</Button>
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Annuler</Button>
          </div>
        </form>
      )}

      {adresses.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-lg">
          <MapPin className="mx-auto h-12 w-12 text-text-secondary mb-4" />
          <p className="font-medium">Aucune adresse enregistrée</p>
          <p className="mt-2 text-sm text-text-secondary">Ajoutez une adresse de livraison.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {adresses.map((addr: any, i: number) => (
            <div key={i} className="rounded-lg border border-border p-4">
              <p className="font-medium">{addr.label}</p>
              <p className="text-sm text-text-secondary mt-1">
                {addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}
              </p>
              <p className="text-sm text-text-secondary">{addr.postalCode} {addr.city}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default function AdressesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold font-heading mb-8">Mon compte</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-56 shrink-0">
          <nav className="space-y-1">
            <Link href="/compte/commandes" className="block rounded-md px-3 py-2 text-sm font-medium text-text-secondary hover:bg-surface-secondary hover:text-text transition-colors">Mes commandes</Link>
            <Link href="/compte/adresses" className="block rounded-md px-3 py-2 text-sm font-medium text-primary bg-primary/5">Mes adresses</Link>
            <Link href="/compte/profil" className="block rounded-md px-3 py-2 text-sm font-medium text-text-secondary hover:bg-surface-secondary hover:text-text transition-colors">Mon profil</Link>
          </nav>
        </aside>
        <div className="flex-1 min-w-0"><AdressesContent /></div>
      </div>
    </div>
  );
}
