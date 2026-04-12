
import Link from "next/link";
import AIOrderSummary from "../../AIorder summary/Aiordersummary";

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Monitor platform activity and manage order-to-delivery assignment.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <Link
            href="/admin/orders"
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Orders</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">Assign Delivery</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">View all customer orders and assign delivery man.</p>
          </Link>

          <Link
            href="/admin/users"
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Users</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">Manage Accounts</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Update roles and ban or unban suspicious users.</p>
          </Link>

          <Link
            href="/admin/medicines"
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Catalog</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">Medicine Control</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Inspect and moderate products across sellers.</p>
          </Link>

          <Link
            href="/admin/categories"
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Taxonomy</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">Category Setup</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Create and update medicine categories cleanly.</p>
          </Link>

          <Link
            href="/admin/delivery-applications"
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Hiring</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">Delivery Man Applications</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Approve or reject delivery man applications.</p>
          </Link>
        </div>

        <AIOrderSummary role="ADMIN" />
      </div>
    </div>
  );
}