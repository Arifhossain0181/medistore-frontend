"use client";

import { addmedicine, generateMedicineDescription } from "@/lib/api/addmedicine";
import { getAllCategories } from "@/lib/api/medicine";
import { Input } from "@/nextjs/ui/input";
import { Label } from "@/nextjs/ui/label";
import { Button } from "@/nextjs/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authstore";
import { Skeleton } from "@/components/ui/skeleton";

interface Category {
  id: string;
  name: string;
}

export default function AddPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [medicineName, setMedicineName] = useState("");
  const [description, setDescription] = useState("");

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
      name: medicineName,
      description,
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

  const handleGenerate = async () => {
    if (!medicineName.trim()) {
      toast.error("আগে medicine name লিখুন");
      return;
    }

    setGenerating(true);
    try {
      const generated = await generateMedicineDescription(medicineName);
      setDescription(generated.fullText || generated.description);
      toast.success("AI description generated");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to generate";
      toast.error("AI generate failed", { description: message });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 text-slate-900 dark:bg-slate-950 dark:text-slate-100 md:p-6">
      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-6">
        <h1 className="mb-6 text-2xl font-bold md:text-3xl">Add Medicine</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
        {/* Medicine Name */}
        <div>
          <Label className="text-gray-900 dark:text-white">Medicine Name</Label>
          <Input
            name="medicineName"
            value={medicineName}
            onChange={(e) => setMedicineName(e.target.value)}
            required
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
          />
          <div className="mt-2">
            <Button
              type="button"
              onClick={handleGenerate}
              disabled={generating || !medicineName.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {generating ? "Generating..." : "AI Generate"}
            </Button>
          </div>
        </div>

        {/* Description */}
        <div>
          <Label className="text-gray-900 dark:text-white">Description</Label>
          <textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={8}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2"
          />
        </div>

        {/* Price */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label className="text-gray-900 dark:text-white">Price</Label>
            <Input name="price" type="number" step="0.01" required className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600" />
          </div>

          <div>
            <Label className="text-gray-900 dark:text-white">Stock</Label>
            <Input name="stock" type="number" required className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600" />
          </div>
        </div>

        <div>
          <Label className="text-gray-900 dark:text-white">Manufacturer</Label>
          <Input name="manufacturer" required className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600" />
        </div>

        {/* Category Dropdown */}
        <div>
          <Label htmlFor="categoryId" className="text-gray-900 dark:text-white">Category</Label>
          {loadingCategories ? (
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
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
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button type="submit" disabled={loading} className="bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white">
            {loading ? "Adding..." : "Add Medicine"}
          </Button>
          <Button type="button" onClick={() => router.back()} variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
            Cancel
          </Button>
        </div>
        </form>
      </div>
    </div>
  );
}
