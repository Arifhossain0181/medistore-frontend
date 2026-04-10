"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getSuperAdminOrders, type SuperAdminOrder } from "@/lib/api/super-admin";

export default function SuperAdminOrdersPage() {
  const [orders, setOrders] = useState<SuperAdminOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getSuperAdminOrders();
        setOrders(data || []);
      } catch (error) {
        console.error("Failed to load orders:", error);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const getOrderTotal = (order: SuperAdminOrder) => Number(order.totalAmount ?? 0);

  if (loading) {
    return <div className="p-6">Loading orders...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">All Orders (Super Admin)</h1>
        <p className="text-sm text-gray-500 mt-1">Platform-wide order visibility and monitoring.</p>
      </div>

      <div className="mb-4 font-semibold">Total Orders: {orders.length}</div>

      {orders.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-gray-500">No orders found.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Order</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Total</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/60">
                  <td className="px-4 py-3 font-medium">#{order.id.slice(0, 8)}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{order.customer?.name || "N/A"}</p>
                    {order.customer?.email ? (
                      <p className="text-xs text-gray-500">{order.customer.email}</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 font-semibold">৳{getOrderTotal(order).toFixed(2)}</td>
                  <td className="px-4 py-3">{order.status}</td>
                  <td className="px-4 py-3 text-gray-500">{new Date(order.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
