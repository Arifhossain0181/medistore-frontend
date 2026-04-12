"use client";

import React, { useEffect, useState } from "react";
import { getMyOrders } from "@/lib/api/order";
import { useRouter } from "next/navigation";
import { Button } from "@/nextjs/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface Order {
  id: string;
  total?: number;
  totalAmount?: number;
  status: string;
  createdAt: string;
  paymentSummary?: {
    status: "PAID" | "PARTIALLY_PAID" | "PENDING";
    totalPaidAmount: number;
    paidItems: number;
    totalItems: number;
  };
  items?: Array<{
    id: string;
    quantity: number;
    medicine?: {
      id: string;
      name: string;
    };
  }>;
}

export default function CustomerOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();

    const intervalId = setInterval(() => {
      loadOrders(true);
    }, 15000);

    return () => clearInterval(intervalId);
  }, []);

  const loadOrders = async (silent = false) => {
    if (!silent) setLoading(true);

    try {
      const data = await getMyOrders();
      console.log("My orders raw data:", data);
      console.log("Sample order:", data[0]);
      const ordersArray = Array.isArray(data) ? data : [];
      console.log("Orders array:", ordersArray.length, "orders");
      setOrders(ordersArray);
    } catch (error) {
      console.error("Error loading orders:", error);
      const message = error instanceof Error ? error.message.toLowerCase() : "";

      if (message.includes("unauthorized") || message.includes("failed to fetch orders: 401")) {
        if (!silent) {
          toast.error("Please login to view your orders.");
        }
        router.push("/auth/login?redirect=/customer/orders");
        return;
      }

      if (!silent) {
        toast.error("Failed to load orders. Please try again.");
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No orders yet</p>
          <Button onClick={() => router.push("/shop")} className="bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white">
            Start Shopping
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-md dark:hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/customer/orders/${order.id}`)}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Order ID</p>
                  <p className="font-mono text-sm text-gray-900 dark:text-white">{order.id.slice(0, 8)}...</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
                  <p className="font-bold text-lg text-gray-900 dark:text-white">
                    ${Number(order.total ?? order.totalAmount ?? 0).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium
                      ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : ''}
                      ${order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : ''}
                      ${order.status === 'SHIPPED' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' : ''}
                      ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}
                      ${order.status === 'CANCELLED' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : ''}
                    `}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <span className={`px-3 py-1 rounded-full font-medium ${
                  order.paymentSummary?.status === 'PAID'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : order.paymentSummary?.status === 'PARTIALLY_PAID'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                  Payment: {order.paymentSummary?.status || 'PENDING'}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  Paid items {order.paymentSummary?.paidItems || 0}/{order.paymentSummary?.totalItems || 0}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  Paid ${Number(order.paymentSummary?.totalPaidAmount || 0).toFixed(2)}
                </span>
              </div>

              {order.items && order.items.length > 0 ? (
                <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                  <p>{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                  <p className="truncate">
                    {order.items
                      .map((item) => item.medicine?.name)
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
