"use client";

import { fetchOrders } from "@/lib/api/order";
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
  items?: string[];
}

export default function SellerOrdersPage() {

const [orders, setOrders] = useState<Order[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const getOrders = async () => {
    const { data, error } = await fetchOrders.getSellerOrders();
    if(error){
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders. Please try again.");
      setLoading(false);
    }
    else{
      // Backend returns { data: orders[] } format
      const ordersData = data?.data || data || [];
      console.log("Seller orders:", ordersData);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setLoading(false);
    }
  }
  getOrders();
}, [])

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Seller Orders ({orders.length})</h1>
      
      {loading ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left"><Skeleton className="h-4 w-20" /></th>
                <th className="px-6 py-3 text-left"><Skeleton className="h-4 w-24" /></th>
                <th className="px-6 py-3 text-left"><Skeleton className="h-4 w-16" /></th>
                <th className="px-6 py-3 text-left"><Skeleton className="h-4 w-16" /></th>
                <th className="px-6 py-3 text-left"><Skeleton className="h-4 w-20" /></th>
                <th className="px-6 py-3 text-left"><Skeleton className="h-4 w-20" /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-6 w-20" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-8 w-16" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">No orders found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{order.id.slice(0, 8)}...</td>
                  <td className="px-6 py-4 text-sm">
                    {order.user?.name || order.user?.email || order.userId}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold">${order.total.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' : ''}
                      ${order.status === 'SHIPPED' ? 'bg-purple-100 text-purple-800' : ''}
                      ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : ''}
                      ${order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button className="text-blue-600 hover:underline mr-3">
                      View Details
                    </button>
                    <button className="text-green-600 hover:underline">
                      Update Status
                    </button>
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
