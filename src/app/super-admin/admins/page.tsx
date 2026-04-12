"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  getSuperAdminAdmins,
  toggleSuperAdminUserBan,
  updateSuperAdminUserRole,
  type SuperAdminUser,
} from "@/lib/api/super-admin";
import { Button } from "@/nextjs/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PaginationControls } from "@/components/ui/pagination-controls";

export default function SuperAdminAdminsPage() {
  const [admins, setAdmins] = useState<SuperAdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 9;

  const loadAdmins = async () => {
    try {
      const data = await getSuperAdminAdmins();
      setAdmins(data || []);
    } catch (error) {
      console.error("Failed to load admins:", error);
      toast.error("Failed to load admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const handleToggleBan = async (userId: string, isBanned: boolean) => {
    setUpdating(userId);
    try {
      await toggleSuperAdminUserBan(userId, !isBanned);
      toast.success(isBanned ? "Admin unbanned" : "Admin banned");
      await loadAdmins();
    } catch (error) {
      toast.error("Failed to update admin status");
    } finally {
      setUpdating(null);
    }
  };

  const handleDemote = async (userId: string) => {
    setUpdating(userId);
    try {
      await updateSuperAdminUserRole(userId, "CUSTOMER");
      toast.success("Admin demoted to CUSTOMER");
      await loadAdmins();
    } catch (error) {
      toast.error("Failed to update role");
    } finally {
      setUpdating(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(admins.length / pageSize));
  const paginatedAdmins = useMemo(() => {
    const start = (page - 1) * pageSize;
    return admins.slice(start, start + pageSize);
  }, [admins, page]);

  useEffect(() => {
    setPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 dark:bg-slate-950 md:p-6">
      <h1 className="mb-6 text-3xl font-bold text-slate-900 dark:text-slate-100">System Admin Management</h1>
      <div className="mb-4 font-semibold text-slate-800 dark:text-slate-200">Total Admin Accounts: {admins.length}</div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-44 w-full rounded-lg" />
          <Skeleton className="h-44 w-full rounded-lg" />
          <Skeleton className="h-44 w-full rounded-lg" />
        </div>
      ) : admins.length === 0 ? (
        <div className="p-6 text-gray-500 dark:text-slate-400">No admin users found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedAdmins.map((admin) => (
            <div key={admin.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow dark:border-slate-700 dark:bg-slate-900">
              <div className="mb-2 text-lg font-bold text-slate-900 dark:text-slate-100">{admin.name}</div>
              <div className="mb-1 text-sm text-gray-600 dark:text-slate-400">{admin.email}</div>
              <div className="mb-1 text-sm text-slate-700 dark:text-slate-300">Role: <span className="font-semibold">{admin.role}</span></div>
              <div className="mb-3 text-sm">
                Status:{" "}
                <span className={admin.isBanned ? "text-red-600 font-semibold" : "text-green-600 font-semibold"}>
                  {admin.isBanned ? "Banned" : "Active"}
                </span>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={() => handleToggleBan(admin.id, admin.isBanned)}
                  className={`w-full ${admin.isBanned ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
                  disabled={updating === admin.id}
                >
                  {updating === admin.id ? "Updating..." : admin.isBanned ? "Unban Admin" : "Ban Admin"}
                </Button>

                {admin.role === "ADMIN" ? (
                  <Button
                    onClick={() => handleDemote(admin.id)}
                    className="w-full bg-amber-600 hover:bg-amber-700"
                    disabled={updating === admin.id}
                  >
                    Demote to Customer
                  </Button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

      <PaginationControls
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        itemLabel={`${admins.length} admins`}
      />
    </div>
  );
}
