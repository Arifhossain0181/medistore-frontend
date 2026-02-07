"use client";
import { getAlluser, banUser, unbanUser } from "@/lib/api/medicine";
import { Button } from "@/nextjs/ui/button";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

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

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
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
              <div className="text-sm mb-2">Role: <span className="font-semibold">{user.role}</span></div>
              <div className="text-sm mb-3">
                Status: <span className={user.isBanned ? "text-red-600 font-semibold" : "text-green-600 font-semibold"}>
                  {user.isBanned ? "Banned" : "Active"}
                </span>
              </div>
              <Button
                onClick={() => handleToggleBan(user.id, user.isBanned || false)}
                className={`w-full ${user.isBanned ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
                disabled={updating === user.id}
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
