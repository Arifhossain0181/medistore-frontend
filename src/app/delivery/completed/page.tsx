"use client";

import { useEffect, useMemo, useState } from "react";
import { getMyCompletedDeliveryOrders, type DeliveryAssignment } from "@/lib/api/delivery";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { PaginationControls } from "@/components/ui/pagination-controls";

export default function DeliveryCompletedPage() {
  const [orders, setOrders] = useState<DeliveryAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const load = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      setOrders(await getMyCompletedDeliveryOrders());
    } catch (_error) {
      if (!silent) toast.error("Failed to load completed deliveries");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    load();

    const intervalId = setInterval(() => {
      load(true);
    }, 15000);

    return () => clearInterval(intervalId);
  }, []);

  const totalPages = Math.max(1, Math.ceil(orders.length / pageSize));
  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * pageSize;
    return orders.slice(start, start + pageSize);
  }, [orders, page]);

  useEffect(() => {
    setPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  return (
    <div className="min-h-screen space-y-4 bg-slate-50 p-4 dark:bg-slate-950 md:p-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Completed Deliveries</h2>
      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      ) : null}
      {!loading && orders.length === 0 ? <p className="text-sm text-slate-500 dark:text-slate-400">No completed deliveries yet.</p> : null}
      <div className="space-y-3">
        {paginatedOrders.map((assignment) => (
          <div key={assignment.id} className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <p className="font-semibold text-slate-900 dark:text-slate-100">Order #{(assignment.order?.id || assignment.orderId || "").slice(0, 10)}</p>
            <p className="text-sm text-slate-600 dark:text-slate-300">Status: {assignment.status}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Assigned: {new Date(assignment.assignedAt).toLocaleString()}</p>
          </div>
        ))}
      </div>

      <PaginationControls
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        itemLabel={`${orders.length} completed deliveries`}
      />
    </div>
  );
}
