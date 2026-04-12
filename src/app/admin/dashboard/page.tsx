
import Link from "next/link";
import AIOrderSummary from "../../AIorder summary/Aiordersummary";

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-slate-600">
            Monitor platform activity and manage order-to-delivery assignment.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <Link
            href="/admin/orders"
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Orders</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Assign Delivery</h2>
            <p className="mt-2 text-sm text-slate-600">View all customer orders and assign delivery man.</p>
          </Link>

          <Link
            href="/admin/users"
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Users</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Manage Accounts</h2>
            <p className="mt-2 text-sm text-slate-600">Update roles and ban or unban suspicious users.</p>
          </Link>

          <Link
            href="/admin/medicines"
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Catalog</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Medicine Control</h2>
            <p className="mt-2 text-sm text-slate-600">Inspect and moderate products across sellers.</p>
          </Link>

          <Link
            href="/admin/categories"
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Taxonomy</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Category Setup</h2>
            <p className="mt-2 text-sm text-slate-600">Create and update medicine categories cleanly.</p>
          </Link>

          <Link
            href="/admin/delivery-applications"
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Hiring</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Delivery Man Applications</h2>
            <p className="mt-2 text-sm text-slate-600">Approve or reject delivery man applications.</p>
          </Link>
        </div>

        <AIOrderSummary role="ADMIN" />
      </div>
    </div>
  );
}