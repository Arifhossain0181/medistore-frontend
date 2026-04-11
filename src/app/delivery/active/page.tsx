"use client";

import { useEffect, useState } from "react";
import {
  getMyActiveDeliveryOrders,
  type DeliveryAssignment,
  updateDeliveryOrderStatus,
} from "@/lib/api/delivery";
import { toast } from "sonner";

export default function DeliveryActivePage() {
  const [orders, setOrders] = useState<DeliveryAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const load = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      setOrders(await getMyActiveDeliveryOrders());
    } catch {
      if (!silent) toast.error("Failed to load active deliveries");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    load();

    const intervalId = setInterval(() => {
      load(true);
    }, 15000);

    return () => clearInterval(intervalId);
  }, []);

  const getOrderId = (assignment: DeliveryAssignment) => assignment.order?.id || assignment.orderId || "";

  const handleDelivered = async (assignment: DeliveryAssignment) => {
    const orderId = getOrderId(assignment);
    if (!orderId) {
      toast.error("Order id missing");
      return;
    }

    setUpdatingOrderId(orderId);
    try {
      await updateDeliveryOrderStatus(orderId, "DELIVERED");
      setOrders((prev) => prev.filter((item) => getOrderId(item) !== orderId));
      toast.success("Order marked as delivered");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to update status");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleCancelled = async (assignment: DeliveryAssignment) => {
    const orderId = getOrderId(assignment);
    if (!orderId) {
      toast.error("Order id missing");
      return;
    }

    setUpdatingOrderId(orderId);
    try {
      await updateDeliveryOrderStatus(orderId, "FAILED");
      setOrders((prev) => prev.filter((item) => getOrderId(item) !== orderId));
      toast.success("Order cancelled");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to cancel order");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Active Deliveries</h2>
      {loading ? <p>Loading...</p> : null}
      {!loading && orders.length === 0 ? <p className="text-sm text-slate-500">No active deliveries.</p> : null}
      <div className="space-y-3">
        {orders.map((assignment) => (
          <div key={assignment.id} className="rounded-lg border bg-white p-4">
            <p className="font-semibold">Order #{(assignment.order?.id || assignment.orderId || "").slice(0, 10)}</p>
            <p className="text-sm text-slate-600">Status: {assignment.status}</p>
            <p className="text-xs text-slate-500">Assigned: {new Date(assignment.assignedAt).toLocaleString()}</p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => handleDelivered(assignment)}
                disabled={updatingOrderId === getOrderId(assignment)}
                className="rounded bg-green-600 px-3 py-1 text-sm text-white disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {updatingOrderId === getOrderId(assignment) ? "Updating..." : "Mark as Delivered"}
              </button>
              <button
                type="button"
                onClick={() => handleCancelled(assignment)}
                disabled={updatingOrderId === getOrderId(assignment)}
                className="rounded bg-red-600 px-3 py-1 text-sm text-white disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {updatingOrderId === getOrderId(assignment) ? "Updating..." : "Cancelled"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
