"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getSuperAdminUsers,
  toggleSuperAdminUserBan,
  updateSuperAdminUserRole,
  type SuperAdminRole,
  type SuperAdminUser,
} from "@/lib/api/super-admin";
import { Button } from "@/nextjs/ui/button";

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

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">All Users (Super Admin)</h1>
      <div className="mb-4 font-semibold">Total Users: {users.length}</div>

      {loading ? (
        <div className="p-6">Loading users...</div>
      ) : users.length === 0 ? (
        <div className="p-6 text-gray-500">No users found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <div key={user.id} className="border rounded-lg p-4 bg-white shadow">
              <div className="font-bold text-lg mb-2">{user.name}</div>
              <div className="text-sm text-gray-600 mb-1">{user.email}</div>

              <div className="mb-3">
                <label className="text-xs text-gray-500 block mb-1">Role:</label>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value as SuperAdminRole)}
                  disabled={changingRole === user.id}
                  className="w-full border rounded px-2 py-1 text-sm font-semibold"
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
    </div>
  );
}
