"use client";
import { getAlluser, banUser, unbanUser, updateUserRole } from "@/lib/api/medicine";
import { Button } from "@/nextjs/ui/button";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  isBanned?: boolean;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [changingRole, setChangingRole] = useState<string | null>(null);

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

  const handleRoleChange = async (userId: string, newRole: "CUSTOMER" | "SELLER" | "ADMIN") => {
    setChangingRole(userId);
    try {
      await updateUserRole(userId, newRole);
      toast.success(`User role updated to ${newRole}`);
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

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
      <div className="mb-4 text-sm text-gray-600">
        <p className="font-semibold mb-2">Total Users: {users.length}</p>
        <p className="text-blue-600">💡 Only admins can change user roles. All new users register as CUSTOMER.</p>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4 bg-white shadow">
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
        <div className="p-6 text-gray-500">No users found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <div key={user.id} className="border rounded-lg p-4 bg-white shadow">
              <div className="font-bold text-lg mb-2">{user.name}</div>
              <div className="text-sm text-gray-600 mb-1">{user.email}</div>
              
              {/* Role Selector */}
              <div className="mb-3">
                <label className="text-xs text-gray-500 block mb-1">Role:</label>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value as "CUSTOMER" | "SELLER" | "ADMIN")}
                  disabled={changingRole === user.id}
                  className="w-full border rounded px-2 py-1 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="CUSTOMER">Customer</option>
                  <option value="SELLER">Seller</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              
              <div className="text-sm mb-3">
                Status: <span className={user.isBanned ? "text-red-600 font-semibold" : "text-green-600 font-semibold"}>
                  {user.isBanned ? "Banned" : "Active"}
                </span>
              </div>
              
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
    </div>
  );
}
