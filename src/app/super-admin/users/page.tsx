"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  getSuperAdminUsers,
  toggleSuperAdminUserBan,
  updateSuperAdminUserRole,
  type SuperAdminRole,
  type SuperAdminUser,
} from "@/lib/api/super-admin";
import { Button } from "@/nextjs/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PaginationControls } from "@/components/ui/pagination-controls";

const roleOptions: SuperAdminRole[] = [
  "CUSTOMER",
  "SELLER",
  "DELIVERY_MAN",
  "ADMIN",
  "SUPER_ADMIN",
];

export default function SuperAdminUsersPage() {
  const [users, setUsers] = useState<SuperAdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingBan, setUpdatingBan] = useState<string | null>(null);
  const [changingRole, setChangingRole] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 9;

  const loadUsers = async () => {
    try {
      const data = await getSuperAdminUsers();
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
    setUpdatingBan(userId);
    try {
      await toggleSuperAdminUserBan(userId, !currentBanStatus);
      toast.success(currentBanStatus ? "User unbanned" : "User banned");
      await loadUsers();
    } catch (error) {
      const errorMsg =
        (error as { response?: { data?: { message?: string } } }).response?.data?.message ||
        (error as Error).message ||
        "Failed to update ban status";
      toast.error(errorMsg);
    } finally {
      setUpdatingBan(null);
    }
  };

  const handleRoleChange = async (userId: string, role: SuperAdminRole) => {
    setChangingRole(userId);
    try {
      await updateSuperAdminUserRole(userId, role);
      toast.success(`Role updated to ${role}`);
      await loadUsers();
    } catch (error) {
      const errorMsg =
        (error as { response?: { data?: { message?: string } } }).response?.data?.message ||
        (error as Error).message ||
        "Failed to update role";
      toast.error(errorMsg);
    } finally {
      setChangingRole(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(users.length / pageSize));
  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return users.slice(start, start + pageSize);
  }, [users, page]);

  useEffect(() => {
    setPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 dark:bg-slate-950 md:p-6">
      <h1 className="mb-6 text-3xl font-bold text-slate-900 dark:text-slate-100">All Users (Super Admin)</h1>
      <div className="mb-4 font-semibold text-slate-800 dark:text-slate-200">Total Users: {users.length}</div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-52 w-full rounded-lg" />
          <Skeleton className="h-52 w-full rounded-lg" />
          <Skeleton className="h-52 w-full rounded-lg" />
        </div>
      ) : users.length === 0 ? (
        <div className="p-6 text-gray-500 dark:text-slate-400">No users found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedUsers.map((user) => (
            <div key={user.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow dark:border-slate-700 dark:bg-slate-900">
              <div className="mb-2 text-lg font-bold text-slate-900 dark:text-slate-100">{user.name}</div>
              <div className="mb-1 text-sm text-gray-600 dark:text-slate-400">{user.email}</div>

              <div className="mb-3">
                <label className="mb-1 block text-xs text-gray-500 dark:text-slate-400">Role:</label>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value as SuperAdminRole)}
                  disabled={changingRole === user.id}
                  className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-sm font-semibold text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                >
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-sm mb-3">
                Status:{" "}
                <span className={user.isBanned ? "text-red-600 font-semibold" : "text-green-600 font-semibold"}>
                  {user.isBanned ? "Banned" : "Active"}
                </span>
              </div>

              <Button
                onClick={() => handleToggleBan(user.id, user.isBanned)}
                className={`w-full ${user.isBanned ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
                disabled={updatingBan === user.id || changingRole === user.id}
              >
                {updatingBan === user.id ? "Updating..." : user.isBanned ? "Unban User" : "Ban User"}
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
