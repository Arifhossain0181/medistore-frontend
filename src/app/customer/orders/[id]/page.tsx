"use client";

import React, { useEffect, useState, use } from "react";
import { getSingleOrder } from "@/lib/api/order";
import { useRouter } from "next/navigation";
import { Button } from "@/nextjs/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  medicine: {
    id: string;
    name: string;
    manufacturer: string;
    imageUrl?: string;
  };
}

interface OrderDetails {
  id: string;
  total?: number;
  totalAmount?: number;
  status: string;
  createdAt: string;
  shippingAddress?: string;
  phone?: string;
  items: OrderItem[];
}

export default function CustomerOrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadOrderDetails();
    }
  }, [id]);

  const loadOrderDetails = async () => {
    try {
      const data = await getSingleOrder(id);
      console.log("Order details:", data);
      setOrder(data);
    } catch (error) {
      console.error("Error loading order:", error);
      toast.error("Failed to load order details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl bg-white dark:bg-gray-900 min-h-screen">
        <Skeleton className="h-10 w-32 mb-6" />
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="border-b border-gray-200 dark:border-gray-600 pb-4 mb-6">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6 bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white">
        <p className="text-red-500 dark:text-red-400">Order not found</p>
        <Button onClick={() => router.back()} className="mt-4 bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white">
      <div className="mb-6">
        <Button onClick={() => router.back()} variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
          ← Back to Orders
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="border-b border-gray-200 dark:border-gray-600 pb-4 mb-6">
          <h1 className="text-2xl font-bold mb-2">Order Details</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Order ID: {order.id}</p>
        </div>

        {/* Order Info */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Order Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Date:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium
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
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total:</span>
                <span className="font-bold text-lg text-gray-900 dark:text-white">
                  ${Number(order.total ?? order.totalAmount ?? 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Shipping Information</h3>
            <div className="text-sm space-y-1">
              {order.shippingAddress && (
                <p className="text-gray-600 dark:text-gray-400">{order.shippingAddress}</p>
              )}
              {order.phone && (
                <p className="text-gray-600 dark:text-gray-400">Phone: {order.phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div>
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Order Items</h3>
          <div className="space-y-4">
            {order.items && order.items.length > 0 ? (
              order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {item.medicine?.imageUrl && (
                    <img
                      src={item.medicine.imageUrl}
                      alt={item.medicine.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">{item.medicine?.name || 'Unknown Medicine'}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {item.medicine?.manufacturer}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      ${item.price ? item.price.toFixed(2) : '0.00'} × {item.quantity || 0}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No items in this order</p>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900 dark:text-white">Order Total:</span>
            <span className="text-2xl font-bold text-green-600 dark:text-green-400">
              ${Number(order.total ?? order.totalAmount ?? 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
