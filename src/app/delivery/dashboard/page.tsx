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
import { Skeleton } from "@/components/ui/skeleton";

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
    <div className="min-h-screen bg-slate-50 p-6 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Delivery Dashboard</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Manage assigned deliveries and update order delivery states.
          </p>
          {profile?.name ? (
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Signed in as {profile.name} ({profile.email})
            </p>
          ) : null}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Assigned</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">{loading ? "..." : orders.length}</h2>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Active</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">{loading ? "..." : active.length}</h2>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Completed</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">{loading ? "..." : completed.length}</h2>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Link
            href="/delivery/orders"
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Queue</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">All Assigned</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">See every order currently assigned to you.</p>
          </Link>

          <Link
            href="/delivery/active"
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">In Progress</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">Active Deliveries</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Track orders currently out for delivery.</p>
          </Link>

          <Link
            href="/delivery/completed"
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">History</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">Completed Orders</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Review successful deliveries and timestamps.</p>
          </Link>

          <Link
            href="/delivery/profile"
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Account</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">Delivery Profile</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Access your profile and account information.</p>
          </Link>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Recent Assigned Orders</h3>
          {loading ? (
            <div className="mt-3 space-y-3">
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
            </div>
          ) : recentOrders.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">No assigned orders yet.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {recentOrders.map((assignment) => (
                <div key={assignment.id} className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-slate-900 dark:text-slate-100">Order #{(assignment.order?.id || assignment.orderId || "").slice(0, 8)}</p>
                    <span className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">{assignment.status}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Assigned: {new Date(assignment.assignedAt).toLocaleString()}</p>
                  {assignment.order?.shippingAddress ? (
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{assignment.order.shippingAddress}</p>
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
