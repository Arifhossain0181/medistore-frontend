"use client";

import { getSingleMedicine, updateMedicine, getAllCategories } from "@/lib/api/medicine";
import { Input } from "@/nextjs/ui/input";
import { Label } from "@/nextjs/ui/label";
import { Button } from "@/nextjs/ui/button";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Category {
    id: string;
    name: string;
}

export default function EditMedicineForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        manufacturer: "",
        categoryId: "",
        imageUrl: ""
    });

    useEffect(() => {
        if (id) {
            loadMedicine();
            loadCategories();
        }
    }, [id]);

    const loadMedicine = async () => {
        try {
            const data = await getSingleMedicine(id!);
            setFormData({
                name: data.name || "",
                description: data.description || "",
                price: data.price?.toString() || "",
                stock: data.stock?.toString() || "",
                manufacturer: data.manufacturer || "",
                categoryId: data.categoryId || "",
                imageUrl: data.imageUrl || ""
            });
        } catch (error) {
            alert("Failed to load medicine");
        }
    };

    const loadCategories = async () => {
        try {
            const data = await getAllCategories();
            setCategories(data);
        } catch (error) {
            console.error("Error loading categories:", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const updateData = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                manufacturer: formData.manufacturer,
                categoryId: formData.categoryId,
                imageUrl: formData.imageUrl
            };

            await updateMedicine(id!, updateData);
            alert("Medicine updated!");
            router.push("/seller/medicines");
        } catch (error) {
            alert("Failed to update medicine");
        } finally {
            setLoading(false);
        }
    };

    if (!id) {
        return <div className="p-6">No medicine ID provided</div>;
    }

    return (
        <div className="container mx-auto p-6 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">Edit Medicine</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label>Medicine Name</Label>
                    <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <Label>Description</Label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        className="w-full border rounded px-3 py-2 min-h-[100px]"
                    />
                </div>

                <div>
                    <Label>Price</Label>
                    <Input
                        name="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <Label>Stock</Label>
                    <Input
                        name="stock"
                        type="number"
                        value={formData.stock}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <Label>Manufacturer</Label>
                    <Input
                        name="manufacturer"
                        value={formData.manufacturer}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="categoryId">Category</Label>
                    <select
                        id="categoryId"
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
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
                </div>

                <div>
                    <Label>Image URL</Label>
                    <Input
                        name="imageUrl"
                        type="url"
                        value={formData.imageUrl}
                        onChange={handleChange}
                    />
                </div>

                <div className="flex gap-2">
                    <Button type="submit" disabled={loading}>
                        {loading ? "Updating..." : "Update Medicine"}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}
