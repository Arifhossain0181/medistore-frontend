"use client";

import React, { useEffect, useState } from "react";
import { getMyOrders } from "@/lib/api/order";
import { useRouter } from "next/navigation";
import { Button } from "@/nextjs/ui/button";

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  items?: string[];
}

export default function CustomerOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getMyOrders();
      console.log("My orders raw data:", data);
      console.log("Sample order:", data[0]);
      const ordersArray = Array.isArray(data) ? data : [];
      console.log("Orders array:", ordersArray.length, "orders");
      setOrders(ordersArray);
    } catch (error) {
      console.error("Error loading orders:", error);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No orders yet</p>
          <Button onClick={() => router.push("/shop")}>
            Start Shopping
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(`/customer/orders/${order.id}`)}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-mono text-sm">{order.id.slice(0, 8)}...</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="font-bold text-lg">
                    ${order.total ? order.total.toFixed(2) : '0.00'}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="text-sm">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium
                      ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' : ''}
                      ${order.status === 'SHIPPED' ? 'bg-purple-100 text-purple-800' : ''}
                      ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : ''}
                      ${order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : ''}
                    `}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              {order.items && order.items.length > 0 && (
                <p className="text-sm text-gray-500 mt-3">
                  {order.items.length} item{order.items.length > 1 ? 's' : ''}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
