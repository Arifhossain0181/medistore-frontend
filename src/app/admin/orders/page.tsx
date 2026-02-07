"use client";
import { fetchOrders } from "@/lib/api/order";
import { useEffect, useState } from "react";

type Order = {
    id: string;
    status: string;
    totalAmount: number;
    createdAt: string;
    userId?: string;
    shippingAddress?: string;
};

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadOrders = async () => {
            const result = await fetchOrders.getOrders();
            console.log("Admin Orders:", result);
            if (result.data && Array.isArray(result.data)) {
                setOrders(result.data);
            } else if (result.data && result.data.data) {
                setOrders(result.data.data);
            }
            setLoading(false);
        };
        loadOrders();
    }, []);

    if (loading) return <div className="p-6">Loading orders...</div>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">All Orders</h1>
            <div className="mb-4 font-semibold">Total Orders: {orders.length}</div>
            <div className="space-y-4">
                {orders.map((order: Order) => (
                    <div key={order.id} className="border rounded-lg p-4 bg-white shadow">
                        <div className="font-bold text-lg">Order #{order.id}</div>
                        <div className="text-sm text-gray-600">Status: {order.status}</div>
                        <div className="text-sm">Total: ৳{order.totalAmount}</div>
                        <div className="text-xs text-gray-400">Date: {new Date(order.createdAt).toLocaleString()}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}