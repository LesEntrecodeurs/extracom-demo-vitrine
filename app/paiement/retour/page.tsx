import { PaymentReturnConfirmation } from '@/components/site/PaymentReturnConfirmation';

export const dynamic = 'force-dynamic';

export default async function RetourPaiementPage({
  searchParams
}: {
  searchParams: Promise<{ paymentStatus?: string }>;
}) {
  const { paymentStatus } = await searchParams;
  const success = paymentStatus === 'success';

  return <PaymentReturnConfirmation success={success} />;
}
