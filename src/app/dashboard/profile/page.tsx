"use client";

import { FormEvent, useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { getUserProfile, updateUserProfile } from "@/lib/api/auth";
import { useAuthStore } from "@/store/authstore";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type EditableProfile = {
  name: string;
  email: string;
  image: string;
};

export default function DashboardProfilePage() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const canEditProfile = user?.role === "CUSTOMER";
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<EditableProfile>({ name: "", email: "", image: "" });

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const payload = await getUserProfile();
        const profile = payload?.data || payload;
        setForm({
          name: profile?.name || user?.name || "",
          email: profile?.email || user?.email || "",
          image: profile?.image || user?.image || "",
        });
      } catch {
        setForm({
          name: user?.name || "",
          email: user?.email || "",
          image: user?.image || "",
        });
      } finally {
        setLoading(false);
      }
    };

    void loadProfile();
  }, [user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canEditProfile) {
      toast.error("Only customer accounts can edit profile info.");
      return;
    }

    setSaving(true);
    try {
      await updateUserProfile({
        name: form.name,
        email: form.email,
        image: form.image || undefined,
      });

      if (user) {
        setUser({
          ...user,
          name: form.name,
          email: form.email,
          image: form.image || undefined,
        });
      }

      toast.success("Profile updated successfully");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Profile update failed";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-8">
        <p className="text-xs font-semibold tracking-[0.18em] text-emerald-600 uppercase dark:text-emerald-300">My Profile</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">Profile Settings</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Full-width editable and readable profile information synced with backend.</p>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 md:p-8">
        {!canEditProfile && !loading ? (
          <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-900/60 dark:bg-amber-900/20 dark:text-amber-300">
            This role is read-only. Only CUSTOMER accounts can update profile information.
          </div>
        ) : null}

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-11 w-full rounded-xl" />
            <Skeleton className="h-11 w-full rounded-xl" />
            <Skeleton className="h-11 w-full rounded-xl" />
            <Skeleton className="h-11 w-44 rounded-xl" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Full Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                placeholder="Your full name"
                required
                disabled={!canEditProfile}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                placeholder="name@example.com"
                required
                disabled={!canEditProfile}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Profile Image URL (optional)</label>
              <input
                value={form.image}
                onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
                className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                placeholder="https://..."
                disabled={!canEditProfile}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Role</label>
              <div className="h-11 w-full rounded-xl border border-slate-300 bg-slate-100 px-4 text-sm font-semibold leading-11 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {user?.role || "N/A"}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">User ID</label>
              <div className="h-11 w-full rounded-xl border border-slate-300 bg-slate-100 px-4 text-sm leading-11 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {user?.id || "-"}
              </div>
            </div>

            {canEditProfile ? (
              <div className="md:col-span-2 flex justify-end">
                <Button type="submit" disabled={saving} className="bg-emerald-600 text-white hover:bg-emerald-700">
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Changes
                </Button>
              </div>
            ) : null}
          </form>
        )}
      </section>
    </div>
  );
}
