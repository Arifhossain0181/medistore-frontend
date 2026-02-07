"use client";
import React, { useEffect, useState } from "react";
import { getAllMedicines } from "@/lib/api/medicine";

type Medicine = {
  id: string;
  name: string;
  manufacturer: string;
  stock: number;
  price?: number;
  description?: string;
};

export default function AdminMedicinesPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMedicines = async () => {
      try {
        const data = await getAllMedicines();
        setMedicines(data || []);
      } catch (error) {
        console.error("Error loading medicines:", error);
      } finally {
        setLoading(false);
      }
    };
    loadMedicines();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">All Medicines</h1>
      <div className="mb-4 font-semibold">Total Medicines: {medicines.length}</div>
      {loading ? (
        <div className="p-6">Loading medicines...</div>
      ) : medicines.length === 0 ? (
        <div className="p-6 text-gray-500">No medicines found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {medicines.map((med) => (
            <div key={med.id} className="border rounded-lg p-4 bg-white shadow">
              <div className="font-bold text-lg mb-2">{med.name}</div>
              <div className="text-sm text-gray-600 mb-1">
                Manufacturer: {med.manufacturer}
              </div>
              <div className="text-sm mb-1">Stock: {med.stock}</div>
              {med.price && (
                <div className="text-sm font-semibold mb-2">Price: ৳{med.price}</div>
              )}
              {med.description && (
                <div className="text-xs text-gray-500">{med.description}</div>
              )}
              {/* Add edit/delete buttons here */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
