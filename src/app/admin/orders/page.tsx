"use client";

import { fetchOrders } from "@/lib/api/order";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { PaginationControls } from "@/components/ui/pagination-controls";

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
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const loadPageData = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const ordersResult = await fetchOrders.getOrders();

            const incomingOrders = ordersResult?.data?.data || ordersResult?.data || [];
            setOrders(Array.isArray(incomingOrders) ? incomingOrders : []);
        } catch (error) {
            if (!silent) toast.error("Failed to load orders");
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

    const getOrderTotal = (order: Order) => {
        return Number(order.totalAmount ?? order.total ?? 0);
    };

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
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-64 w-full rounded-xl" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-4 dark:bg-slate-950 md:p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Order Management</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                    Monitor order progress and delivery updates from one place.
                </p>
            </div>

            <div className="mb-4 font-semibold text-slate-800 dark:text-slate-200">Total Orders: {orders.length}</div>

            {orders.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-gray-500 dark:border-slate-700 dark:text-slate-400">
                    No orders found.
        </div>
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
                                <th className="px-4 py-3 text-left">Delivery Overview</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {paginatedOrders.map((order) => {
                                const orderId = order.id;
                                const customerName = order.customer?.name || order.user?.name || "N/A";
                                const customerEmail = order.customer?.email || order.user?.email || "";

                                return (
                                    <tr key={orderId} className="hover:bg-gray-50/60 dark:hover:bg-slate-800/50">
                                        <td className="px-4 py-3 font-medium">#{orderId.slice(0, 8)}</td>
                                        <td className="px-4 py-3">
                                            <p className="font-medium">{customerName}</p>
                                            {customerEmail ? <p className="text-xs text-gray-500 dark:text-slate-400">{customerEmail}</p> : null}
                                        </td>
                                        <td className="px-4 py-3 font-semibold">৳{getOrderTotal(order).toFixed(2)}</td>
                                        <td className="px-4 py-3">{order.status}</td>
                                        <td className="px-4 py-3 text-gray-500 dark:text-slate-400">{new Date(order.createdAt).toLocaleString()}</td>
                                        <td className="px-4 py-3">
                                            <div className="space-y-1 text-xs text-gray-600 dark:text-slate-300">
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

            <PaginationControls
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                itemLabel={`${orders.length} orders`}
            />
        </div>
    );
}