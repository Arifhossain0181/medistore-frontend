"use client";

import { useEffect, useState } from "react";
import { getMyCompletedDeliveryOrders, type DeliveryAssignment } from "@/lib/api/delivery";
import { toast } from "sonner";

export default function DeliveryCompletedPage() {
  const [orders, setOrders] = useState<DeliveryAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        setOrders(await getMyCompletedDeliveryOrders());
      } catch (_error) {
        toast.error("Failed to load completed deliveries");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Completed Deliveries</h2>
      {loading ? <p>Loading...</p> : null}
      {!loading && orders.length === 0 ? <p className="text-sm text-slate-500">No completed deliveries yet.</p> : null}
      <div className="space-y-3">
        {orders.map((assignment) => (
          <div key={assignment.id} className="rounded-lg border bg-white p-4">
            <p className="font-semibold">Order #{(assignment.order?.id || assignment.orderId || "").slice(0, 10)}</p>
            <p className="text-sm text-slate-600">Status: {assignment.status}</p>
            <p className="text-xs text-slate-500">Assigned: {new Date(assignment.assignedAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
