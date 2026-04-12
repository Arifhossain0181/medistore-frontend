"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getSuperAdminSettings,
  updateSuperAdminSettings,
  type SuperAdminSettings,
} from "@/lib/api/super-admin";
import { Skeleton } from "@/components/ui/skeleton";

export default function SuperAdminSettingsPage() {
  const [settings, setSettings] = useState<SuperAdminSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getSuperAdminSettings();
        setSettings(data);
      } catch (error) {
        console.error("Failed to load settings:", error);
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      const updated = await updateSuperAdminSettings(settings);
      setSettings(updated);
      toast.success("Settings updated successfully");
    } catch (error) {
      console.error("Failed to update settings:", error);
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-10 w-52" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!settings) {
    return <div className="p-6 text-gray-500 dark:text-slate-400">No settings found</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 dark:bg-slate-950 md:p-6">
      <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Platform Settings</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">Control global platform flags and announcement text.</p>
      </div>

      <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
        <label className="flex items-center justify-between gap-4">
          <span className="font-medium">Maintenance Mode</span>
          <input
            type="checkbox"
            checked={settings.maintenanceMode}
            onChange={(e) =>
              setSettings((prev) => (prev ? { ...prev, maintenanceMode: e.target.checked } : prev))
            }
          />
        </label>

        <label className="flex items-center justify-between gap-4">
          <span className="font-medium">Allow New Registrations</span>
          <input
            type="checkbox"
            checked={settings.registrationOpen}
            onChange={(e) =>
              setSettings((prev) => (prev ? { ...prev, registrationOpen: e.target.checked } : prev))
            }
          />
        </label>

        <div>
          <label className="font-medium block mb-2">System Message</label>
          <textarea
            value={settings.message}
            onChange={(e) => setSettings((prev) => (prev ? { ...prev, message: e.target.value } : prev))}
            rows={4}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            placeholder="Enter maintenance or announcement message"
          />
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-md bg-black px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-gray-400 dark:bg-slate-100 dark:text-slate-900 dark:disabled:bg-slate-600 dark:disabled:text-slate-300"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
      </div>
    </div>
  );
}
