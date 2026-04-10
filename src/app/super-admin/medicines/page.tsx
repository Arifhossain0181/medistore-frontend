"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getSuperAdminMedicines, type SuperAdminMedicine } from "@/lib/api/super-admin";

export default function SuperAdminMedicinesPage() {
  const [medicines, setMedicines] = useState<SuperAdminMedicine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMedicines = async () => {
      try {
        const data = await getSuperAdminMedicines();
        setMedicines(data || []);
      } catch (error) {
        console.error("Failed to load medicines:", error);
        toast.error("Failed to load medicines");
      } finally {
        setLoading(false);
      }
    };

    loadMedicines();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">All Medicines (Super Admin)</h1>
      <div className="mb-4 font-semibold">Total Medicines: {medicines.length}</div>

      {loading ? (
        <div className="p-6">Loading medicines...</div>
      ) : medicines.length === 0 ? (
        <div className="p-6 text-gray-500">No medicines found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {medicines.map((medicine) => (
            <div key={medicine.id} className="border rounded-lg p-4 bg-white shadow">
              <div className="font-bold text-lg mb-2">{medicine.name}</div>
              <div className="text-sm text-gray-600 mb-1">
                Manufacturer: {medicine.manufacturer || "N/A"}
              </div>
              <div className="text-sm mb-1">Stock: {medicine.stock}</div>
              <div className="text-sm mb-1">Category: {medicine.category?.name || "N/A"}</div>
              <div className="text-sm mb-2">
                Seller: {medicine.seller?.name || "N/A"} ({medicine.seller?.email || "no-email"})
              </div>
              {typeof medicine.price === "number" ? (
                <div className="text-sm font-semibold">Price: ৳{medicine.price.toFixed(2)}</div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
