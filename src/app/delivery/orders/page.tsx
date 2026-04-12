"use client";

import { useEffect, useState } from "react";
import { useMemo } from "react";
import {
  getMyDeliveryOrders,
  type DeliveryAssignment,
  updateDeliveryOrderStatus,
} from "@/lib/api/delivery";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { PaginationControls } from "@/components/ui/pagination-controls";

export default function DeliveryOrdersPage() {
  const [orders, setOrders] = useState<DeliveryAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const load = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      setOrders(await getMyDeliveryOrders());
    } catch (_error) {
      if (!silent) toast.error("Failed to load delivery orders");
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

  const getOrderId = (assignment: DeliveryAssignment) => assignment.order?.id || assignment.orderId || "";

  const totalPages = Math.max(1, Math.ceil(orders.length / pageSize));
  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * pageSize;
    return orders.slice(start, start + pageSize);
  }, [orders, page]);

  useEffect(() => {
    setPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  const handleCancelled = async (assignment: DeliveryAssignment) => {
    const orderId = getOrderId(assignment);
    if (!orderId) {
      toast.error("Order id missing");
      return;
    }

    setUpdatingOrderId(orderId);
    try {
      await updateDeliveryOrderStatus(orderId, "FAILED");
      setOrders((prev) =>
        prev.map((item) =>
          getOrderId(item) === orderId
            ? {
                ...item,
                status: "FAILED",
                order: item.order ? { ...item.order, status: "CANCELLED" } : item.order,
              }
            : item,
        ),
      );
      toast.success("Order cancelled");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to cancel order");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <div className="min-h-screen space-y-4 bg-slate-50 p-4 dark:bg-slate-950 md:p-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">All Assigned Orders</h2>
      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      ) : null}
      {!loading && orders.length === 0 ? <p className="text-sm text-slate-500 dark:text-slate-400">No assigned orders found.</p> : null}
      <div className="space-y-3">
        {paginatedOrders.map((assignment) => (
          <div key={assignment.id} className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <p className="font-semibold text-slate-900 dark:text-slate-100">Order #{(assignment.order?.id || assignment.orderId || "").slice(0, 10)}</p>
            <p className="text-sm text-slate-600 dark:text-slate-300">Status: {assignment.status}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Assigned: {new Date(assignment.assignedAt).toLocaleString()}</p>
            {(assignment.status === "ASSIGNED" || assignment.status === "IN_TRANSIT") ? (
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => handleCancelled(assignment)}
                  disabled={updatingOrderId === getOrderId(assignment)}
                  className="rounded bg-red-600 px-3 py-1 text-sm text-white disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  {updatingOrderId === getOrderId(assignment) ? "Updating..." : "Cancelled"}
                </button>
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <PaginationControls
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        itemLabel={`${orders.length} delivery orders`}
      />
    </div>
  );
}
