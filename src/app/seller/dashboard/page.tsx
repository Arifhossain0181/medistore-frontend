import Link from "next/link";

export default function SellerDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Seller Dashboard</h1>
          <p className="mt-2 text-sm text-slate-600">
            Track your orders and assign delivery man quickly for customer delivery.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Link
            href="/seller/orders"
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Orders</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Assign Delivery</h2>
            <p className="mt-2 text-sm text-slate-600">Set order status and assign delivery man in one screen.</p>
          </Link>

          <Link
            href="/seller/medicines"
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Products</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Manage Medicines</h2>
            <p className="mt-2 text-sm text-slate-600">Edit inventory, pricing, and medicine details.</p>
          </Link>

          <Link
            href="/seller/add"
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Catalog</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Add New Medicine</h2>
            <p className="mt-2 text-sm text-slate-600">Publish new medicines to your store catalog.</p>
          </Link>

          <Link
            href="/shop"
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Storefront</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Preview Shop</h2>
            <p className="mt-2 text-sm text-slate-600">See how your medicines look to customers.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
