'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authstore';
import { useCartStore } from '@/store/cartstore';
import { getSingleMedicine } from '@/lib/api/medicine';

export default function CheckoutPage() {
  const router = useRouter();
  const params = useSearchParams();
  const medicineId = params.get('medicineId') || '';
  const user = useAuthStore((s) => s.user);
  const addToCart = useCartStore((s) => s.addToCart);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      router.replace('/login');
      return;
    }

    if (user.role !== 'CUSTOMER') {
      setError('Only customers can make medicine payments.');
      return;
    }

    if (!medicineId) {
      setError('Missing medicineId in URL.');
      return;
    }

    const beginCheckout = async () => {
      setLoading(true);
      setError('');
      try {
        const medicine = await getSingleMedicine(medicineId);
        addToCart({
          id: medicine.id,
          name: medicine.name,
          price: medicine.price,
          manufacturer: medicine.manufacturer,
          imageUrl: medicine.imageUrl,
        });

        router.replace('/checkout');
      } catch (err: any) {
        setError(err?.message || 'Unable to prepare checkout. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    beginCheckout();
  }, [medicineId, router, user]);

  return (
    <div className="mx-auto mt-16 max-w-lg rounded-xl border bg-white p-8 text-center shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Secure Payment</h1>
      <p className="mt-2 text-sm text-slate-600">
        We are preparing your order checkout with shipping and payment details.
      </p>

      <div className="mt-8 flex items-center justify-center gap-2 text-slate-700">
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
        <span>{loading ? 'Preparing order checkout...' : 'Checkout status ready'}</span>
      </div>

      {error ? (
        <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="mt-8 flex justify-center gap-3">
        <Link href="/shop" className="rounded-md border px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          Back to Shop
        </Link>
        {medicineId ? (
          <Link
            href={`/shop/${medicineId}`}
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Medicine Details
          </Link>
        ) : null}
      </div>
    </div>
  );
}