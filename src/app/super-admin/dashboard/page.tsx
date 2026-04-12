"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getSuperAdminReports, type SuperAdminReportSummary } from "@/lib/api/super-admin";
import AIOrderSummary from "../../AIorder summary/Aiordersummary";

export default function SuperAdminDashboardPage() {
  const [summary, setSummary] = useState<SuperAdminReportSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const data = await getSuperAdminReports();
        setSummary(data);
      } catch (error) {
        console.error("Failed to load summary:", error);
        toast.error("Failed to load dashboard summary");
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Super Admin Dashboard</h1>
          <p className="mt-2 text-sm text-slate-600">
            Govern platform-wide operations, roles, and business visibility.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Users</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              {loading ? "..." : summary?.users ?? 0}
            </h2>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Medicines</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              {loading ? "..." : summary?.medicines ?? 0}
            </h2>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Orders</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              {loading ? "..." : summary?.orders ?? 0}
            </h2>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Delivered</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              {loading ? "..." : summary?.deliveredOrders ?? 0}
            </h2>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Revenue</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              ৳{loading ? "..." : Number(summary?.deliveredRevenue ?? 0).toFixed(2)}
            </h2>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Link
            href="/super-admin/orders"
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Operations</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Platform Orders</h2>
            <p className="mt-2 text-sm text-slate-600">Monitor all order activity.</p>
          </Link>

          <Link
            href="/super-admin/users"
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Access</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Role Governance</h2>
            <p className="mt-2 text-sm text-slate-600">Control users, admins, sellers, and delivery roles.</p>
          </Link>

          <Link
            href="/super-admin/reports"
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Insights</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Reports</h2>
            <p className="mt-2 text-sm text-slate-600">View platform health and revenue KPIs.</p>
          </Link>
        </div>

        <AIOrderSummary role="SUPER_ADMIN" />
      </div>
    </div>
  );
}
