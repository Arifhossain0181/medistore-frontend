"use client";

import { useEffect, useState } from "react";
import { getDeliveryProfile } from "@/lib/api/delivery";
import { toast } from "sonner";

type DeliveryProfile = {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
};

export default function DeliveryProfilePage() {
  const [profile, setProfile] = useState<DeliveryProfile | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getDeliveryProfile();
        setProfile(data);
      } catch (_error) {
        toast.error("Failed to load delivery profile");
      }
    };

    load();
  }, []);

  return (
    <div className="max-w-xl rounded-xl border bg-white p-6">
      <h2 className="text-2xl font-bold">Delivery Profile</h2>
      <div className="mt-4 space-y-2 text-sm text-slate-700">
        <p><span className="font-semibold">Name:</span> {profile?.name || "N/A"}</p>
        <p><span className="font-semibold">Email:</span> {profile?.email || "N/A"}</p>
        <p><span className="font-semibold">Role:</span> {profile?.role || "DELIVERY_MAN"}</p>
        <p><span className="font-semibold">User ID:</span> {profile?.id || "N/A"}</p>
      </div>
    </div>
  );
}
