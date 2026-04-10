"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getSuperAdminReports, type SuperAdminReportSummary } from "@/lib/api/super-admin";

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
    return <div className="p-6">Loading reports...</div>;
  }

  if (!summary) {
    return <div className="p-6 text-gray-500">No report data found</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports Summary</h1>
        <p className="text-sm text-gray-500 mt-1">Key business KPIs for platform health.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-gray-500">Users</p>
          <p className="mt-2 text-2xl font-semibold">{summary.users}</p>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-gray-500">Medicines</p>
          <p className="mt-2 text-2xl font-semibold">{summary.medicines}</p>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-gray-500">Orders</p>
          <p className="mt-2 text-2xl font-semibold">{summary.orders}</p>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-gray-500">Delivered</p>
          <p className="mt-2 text-2xl font-semibold">{summary.deliveredOrders}</p>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-gray-500">Revenue (Delivered)</p>
          <p className="mt-2 text-2xl font-semibold">৳{Number(summary.deliveredRevenue || 0).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
