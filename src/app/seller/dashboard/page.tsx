import Link from "next/link";

export default function SellerDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Seller Dashboard</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Track your orders and assign delivery man quickly for customer delivery.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Link
            href="/seller/orders"
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Orders</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">Assign Delivery</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Set order status and assign delivery man in one screen.</p>
          </Link>

          <Link
            href="/seller/medicines"
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Products</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">Manage Medicines</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Edit inventory, pricing, and medicine details.</p>
          </Link>

          <Link
            href="/seller/add"
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Catalog</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">Add New Medicine</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Publish new medicines to your store catalog.</p>
          </Link>

          <Link
            href="/shop"
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Storefront</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">Preview Shop</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">See how your medicines look to customers.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
