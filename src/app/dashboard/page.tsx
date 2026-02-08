"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authstore";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    // Redirect to login if no user (after client-side hydration)
    if (!user) {
      router.push("/login?redirect=/dashboard");
    }
  }, [user, router]);

  // Show nothing during hydration or when user is not present
  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Welcome Section */}
      <div className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 p-6 md:p-8 text-white">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          Welcome back, {user.name}!
        </h2>
        <p className="text-sm md:text-base opacity-90">
          Heres your dashboard overview
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Role</p>
              <h3 className="text-2xl md:text-3xl font-bold mt-2 capitalize">
                {user.role.toLowerCase()}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center"></div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Active
              </p>
              <h3 className="text-2xl md:text-3xl font-bold mt-2">Yes</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center"></div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <h3 className="text-sm font-bold mt-2 truncate">{user.email}</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center"></div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {user.role === "CUSTOMER" && (
            <>
              <Link
                href="/shop"
                className="rounded-lg border bg-muted/50 p-4 hover:bg-accent transition-colors"
              >
                <h4 className="font-semibold mb-2">Browse Medicines</h4>
                <p className="text-sm text-muted-foreground">
                  Explore our products
                </p>
              </Link>
             
              <Link
                href="/customer/orders"
                className="rounded-lg border bg-muted/50 p-4 hover:bg-accent transition-colors"
              >
                <h4 className="font-semibold mb-2">My Orders</h4>
                <p className="text-sm text-muted-foreground">
                  Track your orders
                </p>
              </Link>
            </>
          )}

          {user.role === "SELLER" && (
            <>
              <Link
                href="/seller/add"
                className="rounded-lg border bg-muted/50 p-4 hover:bg-accent transition-colors"
              >
                <h4 className="font-semibold mb-2">Add Product</h4>
                <p className="text-sm text-muted-foreground">
                  Add new medicine
                </p>
              </Link>
              <Link
                href="/seller/orders"
                className="rounded-lg border bg-muted/50 p-4 hover:bg-accent transition-colors"
              >
                <h4 className="font-semibold mb-2">Orders</h4>
                <p className="text-sm text-muted-foreground">Manage orders</p>
              </Link>
            </>
          )}

          {user.role === "ADMIN" && (
            <>
              <Link
                href="/admin/medicines"
                className="rounded-lg border bg-muted/50 p-4 hover:bg-accent transition-colors"
              >
                <h4 className="font-semibold mb-2">Medicines</h4>
                <p className="text-sm text-muted-foreground">
                  Manage all medicines
                </p>
              </Link>
              <Link
                href="/admin/users"
                className="rounded-lg border bg-muted/50 p-4 hover:bg-accent transition-colors"
              >
                <h4 className="font-semibold mb-2">Users</h4>
                <p className="text-sm text-muted-foreground">Manage users</p>
              </Link>
              <Link
                href="/admin/orders"
                className="rounded-lg border bg-muted/50 p-4 hover:bg-accent transition-colors"
              >
                <h4 className="font-semibold mb-2">All Orders</h4>
                <p className="text-sm text-muted-foreground">View all orders</p>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Info Card */}
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-lg font-semibold mb-3"> Getting Started</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Use the sidebar menu to navigate through different sections. You can
          access all features based on your role.
        </p>
        <div className="flex gap-2">
          <Link href="/" className="text-sm text-primary hover:underline">
            Go to Home
          </Link>
          <span className="text-muted-foreground">•</span>
          <Link href="/shop" className="text-sm text-primary hover:underline">
            Browse Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
