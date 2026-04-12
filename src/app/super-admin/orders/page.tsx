"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { getSuperAdminOrders, type SuperAdminOrder } from "@/lib/api/super-admin";
import { Skeleton } from "@/components/ui/skeleton";
import { PaginationControls } from "@/components/ui/pagination-controls";

export default function SuperAdminOrdersPage() {
  const [orders, setOrders] = useState<SuperAdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const loadOrders = async (silent = false) => {
    if (!silent) setLoading(true);

    try {
      const data = await getSuperAdminOrders();
      setOrders(data || []);
    } catch (error) {
      console.error("Failed to load orders:", error);
      if (!silent) toast.error("Failed to load orders");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();

    const intervalId = setInterval(() => {
      loadOrders(true);
    }, 15000);

    return () => clearInterval(intervalId);
  }, []);

  const getOrderTotal = (order: SuperAdminOrder) => Number(order.totalAmount ?? 0);

  const totalPages = Math.max(1, Math.ceil(orders.length / pageSize));
  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * pageSize;
    return orders.slice(start, start + pageSize);
  }, [orders, page]);

  useEffect(() => {
    setPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  if (loading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 dark:bg-slate-950 md:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">All Orders (Super Admin)</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">Platform-wide order visibility and monitoring.</p>
      </div>

      <div className="mb-4 font-semibold text-slate-800 dark:text-slate-200">Total Orders: {orders.length}</div>

      {orders.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-gray-500 dark:border-slate-700 dark:text-slate-400">No orders found.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-700 dark:bg-slate-800 dark:text-slate-200">
              <tr>
                <th className="px-4 py-3 text-left">Order</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Total</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {paginatedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/60 dark:hover:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium">#{order.id.slice(0, 8)}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{order.customer?.name || "N/A"}</p>
                    {order.customer?.email ? (
                      <p className="text-xs text-gray-500 dark:text-slate-400">{order.customer.email}</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 font-semibold">৳{getOrderTotal(order).toFixed(2)}</td>
                  <td className="px-4 py-3">{order.status}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-slate-400">{new Date(order.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <PaginationControls
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        itemLabel={`${orders.length} orders`}
      />
    </div>
  );
}
