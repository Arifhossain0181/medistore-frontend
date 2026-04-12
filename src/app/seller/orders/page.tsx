"use client";

import { fetchOrders, updateOrderStatus } from "@/lib/api/order";
import { useEffect, useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { assignOrderToDeliveryMan, getDeliveryMen, type DeliveryMan } from "@/lib/api/delivery";
import { PaginationControls } from "@/components/ui/pagination-controls";

interface Order {
  id: string;
  userId: string;
  total: number;
  totalAmount?: number;
  status: string;
  createdAt: string;
  items?: string[];
  user?: {
    name?: string;
    email: string;
  };
}

const STATUSES = [
  "PROCESSING",
  "CANCELLED",
];

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [deliveryMen, setDeliveryMen] = useState<DeliveryMan[]>([]);
  const [selectedDeliveryMan, setSelectedDeliveryMan] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [assigningOrderId, setAssigningOrderId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const loadPageData = async (silent = false) => {
    if (!silent) setLoading(true);

    try {
      const { data, error } = await fetchOrders.getSellerOrders();

      if (error) {
          if (!silent) {
            const message = error instanceof Error ? error.message : "Failed to load orders";
            toast.error(message);
          }
      } else {
        const ordersData = data?.data || data || [];
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      }

      try {
        const deliveryMenData = await getDeliveryMen();
        setDeliveryMen(deliveryMenData);
      } catch {
        if (!silent) {
          toast.error("Failed to load delivery men list");
        }
      }
    } catch {
      if (!silent) toast.error("Failed to load dashboard data");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadPageData();

    const intervalId = setInterval(() => {
      loadPageData(true);
    }, 15000);

    return () => clearInterval(intervalId);
  }, []);

  const getOrderTotal = (order: Order) => Number(order.total ?? order.totalAmount ?? 0);

  const totalPages = Math.max(1, Math.ceil(orders.length / pageSize));
  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * pageSize;
    return orders.slice(start, start + pageSize);
  }, [orders, page]);

  useEffect(() => {
    setPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      await updateOrderStatus(orderId, status);

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status } : o
        )
      );

      toast.success("Order status updated");
    } catch {
      toast.error("Failed to update order status");
    }
  };

  const handleAssignDelivery = async (orderId: string) => {
    const deliveryManId = selectedDeliveryMan[orderId];
    if (!deliveryManId) {
      toast.error("Please choose delivery option");
      return;
    }

    if (deliveryManId === "COURIER") {
      toast.info("Courier selected. Complete courier booking from Admin Orders.");
      return;
    }

    setAssigningOrderId(orderId);
    try {
      await assignOrderToDeliveryMan(orderId, deliveryManId);
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: "SHIPPED" } : order,
        ),
      );
      toast.success("Delivery man assigned");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to assign delivery man");
    } finally {
      setAssigningOrderId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton className="h-10 w-40 mb-4" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 dark:bg-slate-950 md:p-6">
      <h1 className="mb-6 text-3xl font-bold text-slate-900 dark:text-slate-100">
        Seller Orders ({orders.length})
      </h1>

      {orders.length === 0 ? (
        <p className="text-slate-500 dark:text-slate-400">No orders found</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
          <table className="min-w-full">
            <thead className="bg-gray-100 dark:bg-slate-800">
              <tr>
                <th className="px-6 py-3 text-left">Order</th>
                <th className="px-6 py-3 text-left">Customer</th>
                <th className="px-6 py-3 text-left">Items</th>
                <th className="px-6 py-3 text-left">Total</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Delivery Assignment</th>
                <th className="px-6 py-3 text-left">Order Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {paginatedOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4">
                    {order.id.slice(0, 8)}...
                  </td>

                  <td className="px-6 py-4">
                    {order.user?.name || order.user?.email}
                  </td>

                  <td className="px-6 py-4 max-w-64">
                    <p className="truncate" title={order.items?.join(", ") || "No items"}>
                      {order.items?.length ? order.items.join(", ") : "No items"}
                    </p>
                  </td>

                  <td className="px-6 py-4 font-semibold">
                    ৳{getOrderTotal(order).toFixed(2)}
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-slate-800 dark:text-slate-200">
                      {order.status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <select
                        value={selectedDeliveryMan[order.id] || ""}
                        onChange={(e) =>
                          setSelectedDeliveryMan((prev) => ({
                            ...prev,
                            [order.id]: e.target.value,
                          }))
                        }
                        disabled={order.status === "DELIVERED" || order.status === "CANCELLED" || assigningOrderId === order.id}
                        className="min-w-48 rounded border border-slate-300 bg-white px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                      >
                        <option value="">Select delivery option</option>
                        <option value="COURIER">Courier</option>
                        {deliveryMen.map((man) => (
                          <option key={man.id} value={man.id}>
                            {man.name || man.email}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => handleAssignDelivery(order.id)}
                        disabled={order.status === "DELIVERED" || order.status === "CANCELLED" || assigningOrderId === order.id}
                        className="rounded border border-slate-700 bg-black px-3 py-1 text-sm text-white disabled:cursor-not-allowed disabled:bg-gray-300 dark:border-slate-500 dark:disabled:bg-slate-700"
                      >
                        {assigningOrderId === order.id ? "Assigning..." : "Assign"}
                      </button>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <select
                      value={STATUSES.includes(order.status) ? order.status : ""}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                      disabled={!STATUSES.includes(order.status)}
                      className="rounded border border-slate-300 bg-white px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                    >
                      <option value="" disabled>
                        {order.status}
                      </option>
                      {STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
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
