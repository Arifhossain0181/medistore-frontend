"use client";

import { fetchOrders } from "@/lib/api/order";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Order = {
    id: string;
    status: string;
    totalAmount?: number;
    total?: number;
    createdAt: string;
    shippingAddress?: string;
    fulfillmentType?: "OWN_DELIVERY" | "COURIER";
    courierPartner?: string | null;
    trackingNumber?: string | null;
    customer?: {
        name?: string;
        email?: string;
    };
    user?: {
        name?: string;
        email?: string;
    };
};

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const loadPageData = async () => {
        setLoading(true);
        try {
            const ordersResult = await fetchOrders.getOrders();

            const incomingOrders = ordersResult?.data?.data || ordersResult?.data || [];
            setOrders(Array.isArray(incomingOrders) ? incomingOrders : []);
        } catch (error) {
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPageData();
    }, []);

    const getOrderTotal = (order: Order) => {
        return Number(order.totalAmount ?? order.total ?? 0);
    };

    if (loading) {
        return <div className="p-6">Loading orders...</div>;
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Order Management</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Monitor order progress and delivery updates from one place.
                </p>
            </div>

            <div className="mb-4 font-semibold">Total Orders: {orders.length}</div>

            {orders.length === 0 ? (
                <div className="rounded-lg border border-dashed p-8 text-center text-gray-500">
                    No orders found.
        </div>
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
                                <th className="px-4 py-3 text-left">Delivery Overview</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {orders.map((order) => {
                                const orderId = order.id;
                                const customerName = order.customer?.name || order.user?.name || "N/A";
                                const customerEmail = order.customer?.email || order.user?.email || "";

                                return (
                                    <tr key={orderId} className="hover:bg-gray-50/60">
                                        <td className="px-4 py-3 font-medium">#{orderId.slice(0, 8)}</td>
                                        <td className="px-4 py-3">
                                            <p className="font-medium">{customerName}</p>
                                            {customerEmail ? <p className="text-xs text-gray-500">{customerEmail}</p> : null}
                                        </td>
                                        <td className="px-4 py-3 font-semibold">৳{getOrderTotal(order).toFixed(2)}</td>
                                        <td className="px-4 py-3">{order.status}</td>
                                        <td className="px-4 py-3 text-gray-500">{new Date(order.createdAt).toLocaleString()}</td>
                                        <td className="px-4 py-3">
                                            <div className="space-y-1 text-xs text-gray-600">
                                                <p>
                                                    Mode: {order.fulfillmentType === "COURIER" ? "Courier" : "Own Delivery"}
                                                </p>
                                                {order.courierPartner ? <p>Courier: {order.courierPartner}</p> : null}
                                                {order.trackingNumber ? <p>Tracking: {order.trackingNumber}</p> : null}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}