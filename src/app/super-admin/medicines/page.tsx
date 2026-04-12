"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { getSuperAdminMedicines, type SuperAdminMedicine } from "@/lib/api/super-admin";
import { Skeleton } from "@/components/ui/skeleton";
import { PaginationControls } from "@/components/ui/pagination-controls";

export default function SuperAdminMedicinesPage() {
  const [medicines, setMedicines] = useState<SuperAdminMedicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 9;

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

  const totalPages = Math.max(1, Math.ceil(medicines.length / pageSize));
  const paginatedMedicines = useMemo(() => {
    const start = (page - 1) * pageSize;
    return medicines.slice(start, start + pageSize);
  }, [medicines, page]);

  useEffect(() => {
    setPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 dark:bg-slate-950 md:p-6">
      <h1 className="mb-6 text-3xl font-bold text-slate-900 dark:text-slate-100">All Medicines (Super Admin)</h1>
      <div className="mb-4 font-semibold text-slate-800 dark:text-slate-200">Total Medicines: {medicines.length}</div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-40 w-full rounded-lg" />
          <Skeleton className="h-40 w-full rounded-lg" />
          <Skeleton className="h-40 w-full rounded-lg" />
        </div>
      ) : medicines.length === 0 ? (
        <div className="p-6 text-gray-500 dark:text-slate-400">No medicines found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedMedicines.map((medicine) => (
            <div key={medicine.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow dark:border-slate-700 dark:bg-slate-900">
              <div className="mb-2 text-lg font-bold text-slate-900 dark:text-slate-100">{medicine.name}</div>
              <div className="mb-1 text-sm text-gray-600 dark:text-slate-400">
                Manufacturer: {medicine.manufacturer || "N/A"}
              </div>
              <div className="mb-1 text-sm text-slate-700 dark:text-slate-300">Stock: {medicine.stock}</div>
              <div className="mb-1 text-sm text-slate-700 dark:text-slate-300">Category: {medicine.category?.name || "N/A"}</div>
              <div className="mb-2 text-sm text-slate-700 dark:text-slate-300">
                Seller: {medicine.seller?.name || "N/A"} ({medicine.seller?.email || "no-email"})
              </div>
              {typeof medicine.price === "number" ? (
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Price: ৳{medicine.price.toFixed(2)}</div>
              ) : null}
            </div>
          ))}
        </div>
      )}

      <PaginationControls
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        itemLabel={`${medicines.length} medicines`}
      />
    </div>
  );
}
