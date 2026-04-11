
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { getMyOrders } from "@/lib/api/order";
import { getCustomerDashboardStats, getUserProfile } from "@/lib/api/auth";

type DashboardStats = {
  totalOrders: number;
  totalSpent: number;
  accountStatus: string;
};

type UserProfile = {
  name?: string;
  role?: string;
};

type Order = {
  id: string;
  total?: number;
  totalAmount?: number;
  status: string;
  createdAt: string;
};

const formatMoney = (amount: number) => `$${amount.toFixed(2)}`;

export default function CustomerDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalSpent: 0,
    accountStatus: "ACTIVE",
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const [profileRes, statsRes, ordersRes] = await Promise.all([
          getUserProfile(),
          getCustomerDashboardStats(),
          getMyOrders(),
        ]);

        if (profileRes?.user) {
          setProfile(profileRes.user as UserProfile);
        }

        if (statsRes?.stats) {
          setStats({
            totalOrders: Number(statsRes.stats.totalOrders || 0),
            totalSpent: Number(statsRes.stats.totalSpent || 0),
            accountStatus: String(statsRes.stats.accountStatus || "ACTIVE"),
          });
        }

        const allOrders = Array.isArray(ordersRes) ? (ordersRes as Order[]) : [];
        const sorted = [...allOrders].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        setRecentOrders(sorted.slice(0, 5));
      } catch (error) {
        console.error("Failed to load customer dashboard:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    void loadDashboard();
  }, []);

  const deliveredCount = useMemo(
    () => recentOrders.filter((order) => order.status === "DELIVERED").length,
    [recentOrders],
  );

  if (loading) {
    return (
      <div className="p-6 bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white">
        <h1 className="text-3xl font-bold mb-4">Customer Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold">Customer Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back{profile?.name ? `, ${profile.name}` : ""}. Here is your live account summary.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-5 bg-gray-50 dark:bg-gray-800/60">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Orders</p>
          <p className="text-3xl font-semibold mt-2">{stats.totalOrders}</p>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-5 bg-gray-50 dark:bg-gray-800/60">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Spent</p>
          <p className="text-3xl font-semibold mt-2">{formatMoney(stats.totalSpent)}</p>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-5 bg-gray-50 dark:bg-gray-800/60">
          <p className="text-sm text-gray-500 dark:text-gray-400">Account Status</p>
          <p className="text-3xl font-semibold mt-2">{stats.accountStatus}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Orders</h2>
            <Link href="/customer/orders" className="text-sm text-blue-600 hover:underline">
              View all
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/customer/orders/${order.id}`}
                  className="block rounded-lg border border-gray-100 dark:border-gray-800 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium">#{order.id.slice(0, 8)}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatMoney(Number(order.total ?? order.totalAmount ?? 0))}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{order.status}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <h2 className="text-xl font-semibold mb-4">Quick Overview</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-gray-400">Delivered (recent)</span>
              <span className="font-medium">{deliveredCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-gray-400">Role</span>
              <span className="font-medium">{profile?.role || "CUSTOMER"}</span>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <Link href="/customer/profile" className="block text-sm text-blue-600 hover:underline">
              Manage profile
            </Link>
            <Link href="/shop" className="block text-sm text-blue-600 hover:underline">
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}