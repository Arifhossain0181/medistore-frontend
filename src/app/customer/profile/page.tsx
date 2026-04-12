

"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authstore";
import type { User } from "@/store/authstore";
import { updateUserProfile, getUserProfile, getCustomerDashboardStats } from "@/lib/api/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  UserIcon,
  Mail,
  Edit3,
  Save,
  X,
  ShoppingBag,
  CreditCard,
  Settings,
  Camera,
} from "lucide-react";
import { Label } from "@/nextjs/ui/label";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'SELLER' | 'CUSTOMER';
  image?: string;
  status?: string;
}

interface CustomerDashboardStats {
  totalOrders: number;
  totalSpent: number;
  accountStatus: string;
}

export default function ProfilePage() {
  const { user, setUser, hasHydrated } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<CustomerDashboardStats>({
    totalOrders: 0,
    totalSpent: 0,
    accountStatus: "ACTIVE",
  });

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    image: ""
  });

  useEffect(() => {
    const syncProfile = async () => {
      if (!hasHydrated) return;

      const loadStats = async () => {
        const statsResponse = await getCustomerDashboardStats();
        if (statsResponse?.stats) {
          setStats({
            totalOrders: Number(statsResponse.stats.totalOrders || 0),
            totalSpent: Number(statsResponse.stats.totalSpent || 0),
            accountStatus: String(statsResponse.stats.accountStatus || "ACTIVE"),
          });
        }
      };

      if (user) {
        setProfile(user as UserProfile);
        setEditForm({
          name: user.name || "",
          email: user.email || "",
          image: user.image || ""
        });
        try {
          await loadStats();
        } catch {
          // Ignore stats errors to avoid blocking profile rendering.
        }
        return;
      }

      try {
        const [profileResponse] = await Promise.all([
          getUserProfile(),
        ]);

        const response = profileResponse;
        const profileUser = response?.user as User | undefined;

        if (!profileUser) {
          return;
        }

        setUser(profileUser);
        setProfile(profileUser as UserProfile);
        setEditForm({
          name: profileUser.name || "",
          email: profileUser.email || "",
          image: profileUser.image || ""
        });

        await loadStats();
      } catch {
        toast.error("Please login to manage your profile");
      }
    };

    syncProfile();
  }, [user, hasHydrated, setUser]);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData: { name?: string; email?: string; image?: string } = {};

      if (editForm.name !== user?.name) updateData.name = editForm.name;
      if (editForm.email !== user?.email) updateData.email = editForm.email;
      if (editForm.image !== user?.image) updateData.image = editForm.image;

      if (Object.keys(updateData).length === 0) {
        toast.info("No changes to update");
        setIsEditing(false);
        setLoading(false);
        return;
      }

      const response = await updateUserProfile(updateData);

      if (response.success) {
        const updatedProfile = (response?.user || {
          ...user,
          ...updateData,
        }) as User;

        setUser(updatedProfile);
        setProfile(updatedProfile as UserProfile);

        setIsEditing(false);
        toast.success("Profile updated successfully!");
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update profile";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // For now, we'll just set a placeholder. In a real app, you'd upload to a service
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setEditForm({ ...editForm, image: event.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'SELLER': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'CUSTOMER': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const avatarSrc = isEditing ? (editForm.image || profile?.image || "") : (profile?.image || "");

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-100 bg-white dark:bg-gray-900">
        <div className="w-full max-w-3xl space-y-4 p-6">
          <Skeleton className="mx-auto h-24 w-24 rounded-full" />
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6 bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account settings and preferences</p>
        </div>
        <Badge className={`${getRoleColor(profile.role)} dark:bg-opacity-20 dark:text-opacity-90`}>
          {profile.role}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="relative">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src={avatarSrc} alt={profile.name} />
                  <AvatarFallback className="text-2xl">
                    {getInitials(profile.name)}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <label className="absolute bottom-4 right-1/2 translate-x-12 bg-blue-600 text-white p-1 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <CardTitle className="text-xl">{profile.name}</CardTitle>
              <CardDescription>{profile.email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Separator />
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={editForm.name}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button type="submit" disabled={loading}>
                      <Save className="w-4 h-4 mr-2" />
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        // Reset form to original values
                        setEditForm({
                          name: user?.name || "",
                          email: user?.email || "",
                          image: user?.image || ""
                        });
                      }}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <UserIcon className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-medium">{profile.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{profile.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <ShoppingBag className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalOrders}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                  <CreditCard className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">${stats.totalSpent.toFixed(2)}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Settings className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.accountStatus}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Account Status</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}