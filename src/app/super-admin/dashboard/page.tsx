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
    <div className="min-h-screen bg-slate-50 p-6 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Super Admin Dashboard</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Govern platform-wide operations, roles, and business visibility.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Users</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
              {loading ? "..." : summary?.users ?? 0}
            </h2>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Medicines</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
              {loading ? "..." : summary?.medicines ?? 0}
            </h2>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Orders</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
              {loading ? "..." : summary?.orders ?? 0}
            </h2>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Delivered</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
              {loading ? "..." : summary?.deliveredOrders ?? 0}
            </h2>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Revenue</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
              ৳{loading ? "..." : Number(summary?.deliveredRevenue ?? 0).toFixed(2)}
            </h2>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Link
            href="/super-admin/orders"
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Operations</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">Platform Orders</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Monitor all order activity.</p>
          </Link>

          <Link
            href="/super-admin/users"
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Access</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">Role Governance</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Control users, admins, sellers, and delivery roles.</p>
          </Link>

          <Link
            href="/super-admin/reports"
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Insights</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">Reports</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">View platform health and revenue KPIs.</p>
          </Link>
        </div>

        <AIOrderSummary role="SUPER_ADMIN" />
      </div>
    </div>
  );
}
