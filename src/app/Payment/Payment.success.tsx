/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { verifyPaymentSession } from '@/lib/api/payment';
import { createOrder } from '@/lib/api/order';
import { useCartStore } from '@/store/cartstore';

type VerifyState = 'idle' | 'loading' | 'success' | 'error';

type PendingOrderData = {
  items: Array<{ medicineId: string; quantity: number; price: number }>;
  total: number;
  shippingAddress: string;
  phone: string;
  division: string;
  district: string;
  thana: string;
};

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const router = useRouter();
  const clearCart = useCartStore((s) => s.clearCart);
  const [state, setState] = useState<VerifyState>(sessionId ? 'loading' : 'error');
  const [message, setMessage] = useState(
    sessionId
      ? 'Verifying your payment...'
      : 'Missing Stripe session id. Payment could not be verified.',
  );
  const [medicineId, setMedicineId] = useState('');

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    const verify = async () => {
      try {
        const result = await verifyPaymentSession(sessionId);
        const pendingRaw = sessionStorage.getItem('pendingOrderData');

        if (pendingRaw) {
          const pendingOrderData = JSON.parse(pendingRaw) as PendingOrderData;
          await createOrder(pendingOrderData);
          clearCart();
          sessionStorage.removeItem('pendingOrderData');
        }

        setState('success');
        setMessage('Payment successful and order placed. Redirecting to My Orders...');
        setMedicineId(result?.medicineId || '');

        setTimeout(() => {
          router.replace('/customer/orders');
        }, 900);
        
      } catch (err: any) {
        setState('error');
        setMessage(err?.message || 'Payment verification failed.');
      }
    };

    verify();
  }, [sessionId, clearCart, router]);

  const heading = state === 'success' ? 'Payment Successful' : state === 'error' ? 'Payment Verification Failed' : 'Finalizing Payment';

  return (
    <div className="mx-auto mt-20 max-w-xl rounded-xl border bg-white p-8 text-center shadow-sm">
      <div className="mb-4 text-5xl">
        {state === 'success' ? '✓' : state === 'error' ? '!' : <Loader2 className="mx-auto h-10 w-10 animate-spin" />}
      </div>
      <h2 className="mb-2 text-2xl font-semibold text-slate-900">{heading}</h2>
      <p className="text-sm text-slate-600">{message}</p>

      <div className="mt-8 flex justify-center gap-3">
        <Link href="/shop" className="rounded-md border px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          Continue Shopping
        </Link>
        {medicineId ? (
          <Link
            href={`/shop/${medicineId}`}
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            View Medicine
          </Link>
        ) : null}
      </div>
    </div>
  );
}