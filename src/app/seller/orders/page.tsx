"use client";

import { fetchOrders, updateOrderStatus } from "@/lib/api/order";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface Order {
  id: string;
  userId: string;
  total: number;
  status: string;
  createdAt: string;
  user?: {
    name?: string;
    email: string;
  };
}

const STATUSES = [
  "PLACED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getOrders = async () => {
      const { data, error } = await fetchOrders.getSellerOrders();
      if (error) {
        toast.error("Failed to load orders");
        setLoading(false);
      } else {
        const ordersData = data?.data || data || [];
        setOrders(Array.isArray(ordersData) ? ordersData : []);
        setLoading(false);
      }
    };
    getOrders();
  }, []);

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      await updateOrderStatus(orderId, status);

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status } : o
        )
      );

      toast.success("Order status updated");
    } catch (err) {
      toast.error("Failed to update order status");
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton className="h-10 w-40 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Seller Orders ({orders.length})
      </h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">Order</th>
                <th className="px-6 py-3 text-left">Customer</th>
                <th className="px-6 py-3 text-left">Total</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4">
                    {order.id.slice(0, 8)}...
                  </td>

                  <td className="px-6 py-4">
                    {order.user?.name || order.user?.email}
                  </td>

                  <td className="px-6 py-4 font-semibold">
                    ${order.total.toFixed(2)}
                  </td>

                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded text-xs bg-gray-100">
                      {order.status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                      className="border rounded px-2 py-1 text-sm"
                    >
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
    </div>
  );
}
