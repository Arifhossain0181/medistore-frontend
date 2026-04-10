"use client";

import { addmedicine } from "@/lib/api/addmedicine";
import { getAllCategories } from "@/lib/api/medicine";
import { Input } from "@/nextjs/ui/input";
import { Label } from "@/nextjs/ui/label";
import { Button } from "@/nextjs/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authstore";

interface Category {
  id: string;
  name: string;
}

export default function AddPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Check if user is authenticated and is a SELLER
  useEffect(() => {
    if (!user) {
      toast.error("Please login to continue");
      router.push("/login?redirect=/seller/add");
      return;
    }
    if (user.role !== "SELLER") {
      toast.error("Only sellers can add medicines");
      router.push("/");
      return;
    }
  }, [user, router]);

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories. Please refresh the page.");
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Get form data
    const form = e.currentTarget;
    const data = {
      name: form.medicineName.value,
      description: form.description.value,
      price: Number(form.price.value),
      stock: Number(form.stock.value),
      manufacturer: form.manufacturer.value,
      categoryId: form.categoryId.value,
      imageUrl: form.imageUrl.value,
    };

    try {
      // Call API to add medicine
      const result = await addmedicine(data);
      console.log("Success:", result);
      toast.success("Medicine added successfully!", {
        description: "Redirecting to medicines list..."
      });
      router.push("/seller/medicines");
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to add medicine";
      toast.error("Failed to add medicine", {
        description: errorMessage,
        duration: 5000
      });
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-2xl bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white">
      <h1 className="text-2xl font-bold mb-6">Add Medicine</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Medicine Name */}
        <div>
          <Label className="text-gray-900 dark:text-white">Medicine Name</Label>
          <Input name="medicineName" required className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600" />
        </div>

        {/* Description */}
        <div>
          <Label className="text-gray-900 dark:text-white">Description</Label>
          <Input name="description" required className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600" />
        </div>

        {/* Price */}
        <div>
          <Label className="text-gray-900 dark:text-white">Price</Label>
          <Input name="price" type="number" step="0.01" required className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600" />
        </div>

        {/* Stock */}
        <div>
          <Label className="text-gray-900 dark:text-white">Stock</Label>
          <Input name="stock" type="number" required className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600" />
        </div>

        {/* Manufacturer */}
        <div>
          <Label className="text-gray-900 dark:text-white">Manufacturer</Label>
          <Input name="manufacturer" required className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600" />
        </div>

        {/* Category Dropdown */}
        <div>
          <Label htmlFor="categoryId" className="text-gray-900 dark:text-white">Category</Label>
          {loadingCategories ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading categories...</p>
          ) : (
            <select
              id="categoryId"
              name="categoryId"
              required
              className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Image URL */}
        <div>
          <Label className="text-gray-900 dark:text-white">Image URL</Label>
          <Input name="imageUrl" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600" />
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <Button type="submit" disabled={loading} className="bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white">
            {loading ? "Adding..." : "Add Medicine"}
          </Button>
          <Button type="button" onClick={() => router.back()} variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
