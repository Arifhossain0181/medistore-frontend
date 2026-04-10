"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  getDeliveryProfile,
  getMyActiveDeliveryOrders,
  getMyCompletedDeliveryOrders,
  getMyDeliveryOrders,
  type DeliveryAssignment,
} from "@/lib/api/delivery";
import { toast } from "sonner";

export default function DeliveryDashboardPage() {
  const [orders, setOrders] = useState<DeliveryAssignment[]>([]);
  const [active, setActive] = useState<DeliveryAssignment[]>([]);
  const [completed, setCompleted] = useState<DeliveryAssignment[]>([]);
  const [profile, setProfile] = useState<{ name?: string; email?: string; role?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [allOrders, activeOrders, completedOrders, profileData] = await Promise.all([
          getMyDeliveryOrders(),
          getMyActiveDeliveryOrders(),
          getMyCompletedDeliveryOrders(),
          getDeliveryProfile(),
        ]);

        setOrders(allOrders);
        setActive(activeOrders);
        setCompleted(completedOrders);
        setProfile(profileData);
      } catch {
        toast.error("Failed to load delivery dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime())
      .slice(0, 5);
  }, [orders]);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Delivery Dashboard</h1>
          <p className="mt-2 text-sm text-slate-600">
            Manage assigned deliveries and update order delivery states.
          </p>
          {profile?.name ? (
            <p className="mt-2 text-sm text-slate-500">
              Signed in as {profile.name} ({profile.email})
            </p>
          ) : null}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Assigned</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">{loading ? "..." : orders.length}</h2>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Active</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">{loading ? "..." : active.length}</h2>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Completed</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">{loading ? "..." : completed.length}</h2>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Link
            href="/delivery/orders"
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Queue</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">All Assigned</h2>
            <p className="mt-2 text-sm text-slate-600">See every order currently assigned to you.</p>
          </Link>

          <Link
            href="/delivery/active"
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">In Progress</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Active Deliveries</h2>
            <p className="mt-2 text-sm text-slate-600">Track orders currently out for delivery.</p>
          </Link>

          <Link
            href="/delivery/completed"
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">History</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Completed Orders</h2>
            <p className="mt-2 text-sm text-slate-600">Review successful deliveries and timestamps.</p>
          </Link>

          <Link
            href="/delivery/profile"
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Account</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Delivery Profile</h2>
            <p className="mt-2 text-sm text-slate-600">Access your profile and account information.</p>
          </Link>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Recent Assigned Orders</h3>
          {loading ? (
            <p className="mt-3 text-sm text-slate-500">Loading recent deliveries...</p>
          ) : recentOrders.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">No assigned orders yet.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {recentOrders.map((assignment) => (
                <div key={assignment.id} className="rounded-lg border border-slate-200 p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-slate-900">Order #{(assignment.order?.id || assignment.orderId || "").slice(0, 8)}</p>
                    <span className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600">{assignment.status}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Assigned: {new Date(assignment.assignedAt).toLocaleString()}</p>
                  {assignment.order?.shippingAddress ? (
                    <p className="mt-1 text-sm text-slate-600">{assignment.order.shippingAddress}</p>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
