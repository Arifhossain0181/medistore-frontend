"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getSuperAdminReports, type SuperAdminReportSummary } from "@/lib/api/super-admin";
import { Skeleton } from "@/components/ui/skeleton";

export default function SuperAdminReportsPage() {
  const [summary, setSummary] = useState<SuperAdminReportSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const data = await getSuperAdminReports();
        setSummary(data);
      } catch (error) {
        console.error("Failed to load reports:", error);
        toast.error("Failed to load reports");
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-10 w-52" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!summary) {
    return <div className="p-6 text-gray-500 dark:text-slate-400">No report data found</div>;
  }

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 dark:bg-slate-950 md:p-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Reports Summary</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">Key business KPIs for platform health.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">Users</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{summary.users}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">Medicines</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{summary.medicines}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">Orders</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{summary.orders}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">Delivered</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{summary.deliveredOrders}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">Revenue (Delivered)</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">৳{Number(summary.deliveredRevenue || 0).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
