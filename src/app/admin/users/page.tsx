"use client";
import { getAlluser, banUser, unbanUser, updateUserRole } from "@/lib/api/medicine";
import { Button } from "@/nextjs/ui/button";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { PaginationControls } from "@/components/ui/pagination-controls";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  isBanned?: boolean;
  status?: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [changingRole, setChangingRole] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 9;

  const loadUsers = async () => {
    try {
      const data = await getAlluser();
      setUsers(data || []);
    } catch (error) {
      console.error("Failed to load users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleBan = async (userId: string, currentBanStatus: boolean) => {
    setUpdating(userId);
    try {
      if (currentBanStatus) {
        await unbanUser(userId);
        toast.success("User unbanned successfully");
      } else {
        await banUser(userId);
        toast.success("User banned successfully");
      }
      await loadUsers();
    } catch (error) {
      const errorMsg = (error as {response?: {data?: {message?: string}}}).response?.data?.message || 
                       (error as Error).message || 
                       "Failed to update user status";
      toast.error(errorMsg);
    } finally {
      setUpdating(null);
    }
  };

  const handleRoleChange = async (
    userId: string,
    newRole: "CUSTOMER" | "SELLER" | "ADMIN" | "DELIVERY_MAN",
  ) => {
    setChangingRole(userId);
    try {
      await updateUserRole(userId, newRole);
      toast.success(` User role updated to ${newRole}!`, {
        description: " User MUST logout and login again to see new role",
        duration: 6000,
      });
      await loadUsers();
    } catch (error) {
      const errorMsg = (error as {response?: {data?: {message?: string}}}).response?.data?.message || 
                       (error as Error).message || 
                       "Failed to update user role";
      toast.error(errorMsg);
    } finally {
      setChangingRole(null);
    }
  };

  const pendingDeliveryManCount = users.filter(
    (user) => user.role === "DELIVERY_MAN" && user.status === "PENDING_APPROVAL",
  ).length;

  const totalPages = Math.max(1, Math.ceil(users.length / pageSize));
  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return users.slice(start, start + pageSize);
  }, [users, page]);

  useEffect(() => {
    setPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  const handleApproveDeliveryMan = async (userId: string) => {
    await handleRoleChange(userId, "DELIVERY_MAN");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 dark:bg-slate-950 md:p-6">
      <h1 className="mb-6 text-3xl font-bold text-slate-900 dark:text-slate-100">Manage Users</h1>
      <div className="mb-4 text-sm text-gray-600 dark:text-slate-300">
        <p className="font-semibold mb-2">Total Users: {users.length}</p>
        <p className="text-blue-600">💡 Only admins can change user roles. Delivery Man applications must be approved by admin.</p>
        {pendingDeliveryManCount > 0 ? (
          <p className="text-amber-600 font-semibold mt-2">
            🔔 Delivery Man Applications Pending: {pendingDeliveryManCount}
          </p>
        ) : null}
      </div>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-lg border border-slate-200 bg-white p-4 shadow dark:border-slate-700 dark:bg-slate-900">
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-48 mb-1" />
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-4 w-32 mb-3" />
              <Skeleton className="h-10 w-full mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="p-6 text-gray-500 dark:text-slate-400">No users found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedUsers.map((user) => (
            <div key={user.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow dark:border-slate-700 dark:bg-slate-900">
              <div className="font-bold text-lg mb-2">{user.name}</div>
              <div className="mb-1 text-sm text-gray-600 dark:text-slate-400">{user.email}</div>
              
              {/* Role Selector */}
              <div className="mb-3">
                <label className="mb-1 block text-xs text-gray-500 dark:text-slate-400">Role:</label>
                <select
                  value={user.role}
                  onChange={(e) =>
                    handleRoleChange(
                      user.id,
                      e.target.value as "CUSTOMER" | "SELLER" | "ADMIN" | "DELIVERY_MAN",
                    )
                  }
                  disabled={changingRole === user.id}
                  className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                >
                  <option value="CUSTOMER">Customer</option>
                  <option value="SELLER">Seller</option>
                  <option value="DELIVERY_MAN">Delivery Man</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              {user.role === "DELIVERY_MAN" && user.status === "PENDING_APPROVAL" ? (
                <div className="mb-3 rounded-md border border-amber-300 bg-amber-50 px-2 py-1 text-xs text-amber-700">
                  Delivery Man আবেদন pending approval.
                </div>
              ) : null}
              
              <div className="text-sm mb-3">
                Status: <span className={user.isBanned ? "text-red-600 font-semibold" : "text-green-600 font-semibold"}>
                  {user.isBanned ? "Banned" : "Active"}
                </span>
              </div>

              {user.role === "DELIVERY_MAN" && user.status === "PENDING_APPROVAL" ? (
                <Button
                  onClick={() => handleApproveDeliveryMan(user.id)}
                  className="w-full mb-2 bg-amber-600 hover:bg-amber-700"
                  disabled={changingRole === user.id || updating === user.id}
                >
                  Approve Delivery Man Application
                </Button>
              ) : null}
              
              <Button
                onClick={() => handleToggleBan(user.id, user.isBanned || false)}
                className={`w-full ${user.isBanned ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
                disabled={updating === user.id || changingRole === user.id}
              >
                {updating === user.id ? "Updating..." : (user.isBanned ? "Unban User" : "Ban User")}
              </Button>
            </div>
          ))}
        </div>
      )}

      <PaginationControls
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        itemLabel={`${users.length} users`}
      />
    </div>
  );
}
