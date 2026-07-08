'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  useCart,
  useDelivery,
  usePayment,
  useCheckout,
  useAuth,
  useCompany,
  useShopContext
} from '@extracom/site-kit/react';
import { formatPrice } from '@extracom/site-kit';
import { AddressForm } from '@/components/site/AddressForm';
import { AuthGate } from '@/components/site/AuthGate';
import { CartSkeleton } from '@/components/site/Loader';

export default function CommandePage() {
  return (
    <AuthGate message="Connectez-vous pour passer commande.">
      <CommandeContent />
    </AuthGate>
  );
}

function CommandeContent() {
  const { cart, isLoading, setDelivery, setComment } = useCart();
  const { options, addAddress } = useDelivery();
  const { start, isLoading: paying, error: payError } = usePayment();
  const {
    createOrder,
    validateWithoutPayment,
    isLoading: ordering,
    error: orderError
  } = useCheckout();
  const { user } = useAuth();
  const { activeId } = useCompany();
  const { data: context } = useShopContext();
  const [showAdd, setShowAdd] = useState(false);
  const [confirmedRef, setConfirmedRef] = useState<string | null>(null);
  const [created, setCreated] = useState(false);
  const [isQuote, setIsQuote] = useState(false);
  const [reference, setReference] = useState('');
  const [comment, setCommentValue] = useState('');

  const persistComment = async