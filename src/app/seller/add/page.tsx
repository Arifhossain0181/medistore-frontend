"use client";

import { addmedicine } from "@/lib/api/addmedicine";
import { getAllCategories } from "@/lib/api/medicine";
import { Input } from "@/nextjs/ui/input";
import { Label } from "@/nextjs/ui/label";
import { Button } from "@/nextjs/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
}

export default function AddPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        alert("Failed to load categories");
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
      alert("Medicine added!");
      router.push("/seller/medicines");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add medicine");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Add Medicine</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Medicine Name */}
        <div>
          <Label>Medicine Name</Label>
          <Input name="medicineName" required />
        </div>

        {/* Description */}
        <div>
          <Label>Description</Label>
          <Input name="description" required />
        </div>

        {/* Price */}
        <div>
          <Label>Price</Label>
          <Input name="price" type="number" step="0.01" required />
        </div>

        {/* Stock */}
        <div>
          <Label>Stock</Label>
          <Input name="stock" type="number" required />
        </div>

        {/* Manufacturer */}
        <div>
          <Label>Manufacturer</Label>
          <Input name="manufacturer" required />
        </div>

        {/* Category Dropdown */}
        <div>
          <Label htmlFor="categoryId">Category</Label>
          {loadingCategories ? (
            <p className="text-sm text-gray-500">Loading categories...</p>
          ) : (
            <select
              id="categoryId"
              name="categoryId"
              required
              className="w-full border rounded px-3 py-2"
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
          <Label>Image URL</Label>
          <Input name="imageUrl" />
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Medicine"}
          </Button>
          <Button type="button" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
