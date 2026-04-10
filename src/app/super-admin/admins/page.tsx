"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getSuperAdminAdmins,
  toggleSuperAdminUserBan,
  updateSuperAdminUserRole,
  type SuperAdminUser,
} from "@/lib/api/super-admin";
import { Button } from "@/nextjs/ui/button";

export default function SuperAdminAdminsPage() {
  const [admins, setAdmins] = useState<SuperAdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

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

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">System Admin Management</h1>
      <div className="mb-4 font-semibold">Total Admin Accounts: {admins.length}</div>

      {loading ? (
        <div className="p-6">Loading admins...</div>
      ) : admins.length === 0 ? (
        <div className="p-6 text-gray-500">No admin users found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {admins.map((admin) => (
            <div key={admin.id} className="border rounded-lg p-4 bg-white shadow">
              <div className="font-bold text-lg mb-2">{admin.name}</div>
              <div className="text-sm text-gray-600 mb-1">{admin.email}</div>
              <div className="text-sm mb-1">Role: <span className="font-semibold">{admin.role}</span></div>
              <div className="text-sm mb-3">
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
    </div>
  );
}
