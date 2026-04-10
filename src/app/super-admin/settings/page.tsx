"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getSuperAdminSettings,
  updateSuperAdminSettings,
  type SuperAdminSettings,
} from "@/lib/api/super-admin";

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
    return <div className="p-6">Loading settings...</div>;
  }

  if (!settings) {
    return <div className="p-6 text-gray-500">No settings found</div>;
  }

  return (
    <div className="p-6 max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Platform Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Control global platform flags and announcement text.</p>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm space-y-5">
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
            className="w-full rounded-md border px-3 py-2"
            placeholder="Enter maintenance or announcement message"
          />
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-md bg-black px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
