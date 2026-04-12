"use client";
import { fetchCategories, createCategory, updateCategory, deleteCategory } from "@/lib/api/medicine";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { PaginationControls } from "@/components/ui/pagination-controls";

type Category = {
  id: string;
  name: string;
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 9;

  const loadCategories = async () => {
    try {
      const res = await fetchCategories.getAllCategories();
      if (res.data && Array.isArray(res.data)) {
        setCategories(res.data);
      } else if (res.data && res.data.data) {
        setCategories(res.data.data);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const totalPages = Math.max(1, Math.ceil(categories.length / pageSize));
  const paginatedCategories = useMemo(() => {
    const start = (page - 1) * pageSize;
    return categories.slice(start, start + pageSize);
  }, [categories, page]);

  useEffect(() => {
    setPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    setSubmitting(true);
    try {
      await createCategory(newCategoryName.trim());
      toast.success("Category created successfully");
      setNewCategoryName("");
      await loadCategories();
    } catch (error) {
      const errorMsg = (error as {response?: {data?: {message?: string}}, message?: string}).response?.data?.message || 
                       (error as Error).message || 
                       "Failed to create category";
      console.error("Create error:", error);
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editingName.trim()) {
      toast.error("Category name is required");
      return;
    }

    setSubmitting(true);
    try {
      await updateCategory(id, editingName.trim());
      toast.success("Category updated successfully");
      setEditingId(null);
      setEditingName("");
      await loadCategories();
    } catch (error) {
      const errorMsg = (error as {response?: {data?: {message?: string}}, message?: string}).response?.data?.message || 
                       (error as Error).message || 
                       "Failed to update category";
      console.error("Update error:", error);
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) {
      return;
    }

    setSubmitting(true);
    try {
      await deleteCategory(id);
      toast.success("Category deleted successfully");
      await loadCategories();
    } catch (error) {
      let errorMsg = "Failed to delete category";
      
      // Check for foreign key constraint error
      const errorResponse = (error as {response?: {data?: {message?: string, error?: string}}}).response?.data;
      
      if (errorResponse?.error && errorResponse.error.includes("violates foreign key constraint")) {
        errorMsg = "Cannot delete category: It has medicines assigned to it. Please remove or reassign the medicines first.";
      } else if (errorResponse?.message) {
        errorMsg = errorResponse.message;
      } else if ((error as Error).message) {
        errorMsg = (error as Error).message;
      }
      
      console.error("Delete error:", error);
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setEditingName(category.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 dark:bg-slate-950 md:p-6">
      <h1 className="mb-6 text-3xl font-bold text-slate-900 dark:text-slate-100">Manage Categories</h1>
      
      {/* Add New Category Form */}
      <div className="mb-8 rounded-lg border border-slate-200 bg-white p-6 shadow dark:border-slate-700 dark:bg-slate-900">
        <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-slate-100">Add New Category</h2>
        <form onSubmit={handleCreate} className="flex flex-col gap-4 sm:flex-row">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Category name"
            className="flex-1 rounded border border-slate-300 bg-white px-4 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            disabled={submitting}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            disabled={submitting}
          >
            Add Category
          </button>
        </form>
      </div>

      <div className="mb-4 font-semibold text-slate-800 dark:text-slate-200">Total Categories: {categories.length}</div>
      
      {loading ? (
        <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      ) : categories.length === 0 ? (
        <div className="p-6 text-gray-500 dark:text-slate-400">No categories found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedCategories.map((category) => (
            <div key={category.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow dark:border-slate-700 dark:bg-slate-900">
              {editingId === category.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                    disabled={submitting}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(category.id)}
                      className="flex-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:bg-gray-400"
                      disabled={submitting}
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex-1 bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="font-bold text-lg mb-2">{category.name}</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(category)}
                      className="flex-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:bg-gray-400"
                      disabled={submitting}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="flex-1 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:bg-gray-400"
                      disabled={submitting}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <PaginationControls
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        itemLabel={`${categories.length} categories`}
      />
    </div>
  );
}