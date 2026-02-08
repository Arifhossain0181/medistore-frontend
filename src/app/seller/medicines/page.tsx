"use client";

import React, { useEffect, useState } from "react";
import { getAllMedicines, updateMedicine, deleteMedicine } from "@/lib/api/medicine";
import { useRouter } from "next/navigation";
import { Button } from "@/nextjs/ui/button";
import { Input } from "@/nextjs/ui/input";

interface Medicine {
  id: string;
  name: string;
  price: number;
  stock: number;
  manufacturer: string;
}

export default function SellerMedicinesPage() {
  const router = useRouter();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingStock, setEditingStock] = useState<string | null>(null);
  const [stockValue, setStockValue] = useState("");

  useEffect(() => {
    loadMedicines();
  }, []);

  const loadMedicines = async () => {
    try {
      const data = await getAllMedicines();
      console.log('Loaded medicines:', data);
      const medicinesArray = Array.isArray(data) ? data : [];
      console.log('Medicines array:', medicinesArray);
      console.log('Sample medicine IDs:', medicinesArray.slice(0, 3).map(m => ({ id: m.id, name: m.name })));
      setMedicines(medicinesArray);
    } catch (error) {
      console.error("Error loading medicines:", error);
      alert("Failed to load medicines");
    } finally {
      setLoading(false);
    }
  };

  // Update stock
  const handleUpdateStock = async (id: string) => {
    console.log('Updating stock for medicine ID:', id, 'New stock:', stockValue);
    try {
      const result = await updateMedicine(id, { stock: Number(stockValue) });
      console.log('Update result:', result);
      alert("Stock updated!");
      setEditingStock(null);
      loadMedicines();
    } catch (error) {
      console.error('Stock update error:', error);
      alert("Failed to update stock");
    }
  };

  // Delete medicine
  const handleDelete = async (id: string, name: string) => {
    console.log('Attempting to delete medicine:', { id, name });
    if (confirm(`Delete ${name}?`)) {
      try {
        const result = await deleteMedicine(id);
        console.log('Delete result:', result);
        alert("Medicine deleted!");
        loadMedicines();
      } catch (error) {
        console.error('Delete error:', error);
        alert("Failed to delete medicine");
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Medicines</h1>
        <Button onClick={() => router.push("/seller/add")}>
          + Add Medicine
        </Button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : medicines.length === 0 ? (
        <p className="text-gray-500">No medicines found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Manufacturer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {medicines.map((medicine) => (
                <tr key={medicine.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm">{medicine.name}</td>
                  <td className="px-4 py-4 text-sm">${medicine.price}</td>
                  <td className="px-4 py-4 text-sm">
                    {editingStock === medicine.id ? (
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          value={stockValue}
                          onChange={(e) => setStockValue(e.target.value)}
                          className="w-20"
                        />
                        <Button 
                          size="sm" 
                          onClick={() => handleUpdateStock(medicine.id)}
                        >
                          Save
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setEditingStock(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <span 
                        className="cursor-pointer hover:text-blue-600"
                        onClick={() => {
                          setEditingStock(medicine.id);
                          setStockValue(medicine.stock.toString());
                        }}
                      >
                        {medicine.stock} (click to edit)
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm">{medicine.manufacturer}</td>
                  <td className="px-4 py-4 text-sm">
                    <button
                      onClick={() => router.push(`/seller/medicines/edit?id=${medicine.id}`)}
                      className="text-blue-600 hover:underline mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(medicine.id, medicine.name)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
