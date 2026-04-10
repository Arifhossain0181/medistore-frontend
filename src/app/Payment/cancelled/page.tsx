import Link from "next/link";

export default function PaymentCancelledPage() {
  return (
    <div className="mx-auto mt-20 max-w-xl rounded-xl border bg-white p-8 text-center shadow-sm">
      <div className="mb-4 text-5xl">×</div>
      <h1 className="mb-2 text-2xl font-semibold text-slate-900">Payment Cancelled</h1>
      <p className="text-sm text-slate-600">
        Your payment was not completed. You can retry payment anytime from the medicine page.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/shop" className="rounded-md border px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          Back to Shop
        </Link>
      </div>
    </div>
  );
}
