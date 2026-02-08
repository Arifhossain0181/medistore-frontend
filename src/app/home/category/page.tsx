

"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pill, Thermometer, Heart, Package, Stethoscope, Baby, Eye, Bone, Activity, LucideIcon } from "lucide-react";
import { getAllCategories } from "@/lib/api/medicine";

// Icon mapping for categories
const iconMap: Record<string, LucideIcon> = {
    "pain relief": Pill,
    "cold & flu": Thermometer,
    "heart health": Heart,
    "first aid": Package,
    "vitamins": Stethoscope,
    "baby care": Baby,
    "eye care": Eye,
    "bone & joint": Bone,
};

// Color mapping for categories
const colorMap: Record<string, string> = {
    "pain relief": "bg-red-100 text-red-600",
    "cold & flu": "bg-blue-100 text-blue-600",
    "heart health": "bg-pink-100 text-pink-600",
    "first aid": "bg-green-100 text-green-600",
    "vitamins": "bg-yellow-100 text-yellow-600",
    "baby care": "bg-purple-100 text-purple-600",
    "eye care": "bg-indigo-100 text-indigo-600",
    "bone & joint": "bg-orange-100 text-orange-600",
};

type Category = {
    id: string;
    name: string;
    description?: string;
};

export default function CategoryPage() {
   const [categories, setCategories] = useState<Category[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   
   useEffect(() => {
    const fetchcategories = async() => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAllCategories();
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
            setError(error instanceof Error ? error.message : "Failed to load categories");
        } finally {
            setLoading(false);
        }
    }
    fetchcategories();
   }, []);
   
   // Helper functions
   const getCategoryIcon = (categoryName: string) => {
       const normalizedName = categoryName.toLowerCase();
       return iconMap[normalizedName] || Activity;
   };
   
   const getCategoryColor = (categoryName: string) => {
       const normalizedName = categoryName.toLowerCase();
       return colorMap[normalizedName] || "bg-gray-100 text-gray-600";
   };
   
   const getCategoryUrl = (categoryName: string) => {
       const slug = categoryName.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-');
       return `/shop?category=${slug}`;
   };
   
   if (loading) {
       return (
           <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
               <div className="container mx-auto px-4">
                   <div className="text-center mb-8 md:mb-12">
                       <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4">
                           Shop by Category
                       </h2>
                   </div>
                   <div className="flex items-center justify-center py-12">
                       <div className="text-center space-y-4">
                           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                           <p className="text-gray-600">Loading categories...</p>
                       </div>
                   </div>
               </div>
           </section>
       );
   }

   if (error) {
       return (
           <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
               <div className="container mx-auto px-4">
                   <div className="text-center mb-8 md:mb-12">
                       <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4">
                           Shop by Category
                       </h2>
                   </div>
                   <div className="flex items-center justify-center py-12">
                       <div className="text-center space-y-4">
                           <div className="text-red-600 text-lg font-semibold">⚠️ Error Loading Categories</div>
                           <p className="text-gray-600">{error}</p>
                           <button 
                               onClick={() => window.location.reload()} 
                               className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                           >
                               Retry
                           </button>
                       </div>
                   </div>
               </div>
           </section>
       );
   }

    return (
        <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-8 md:mb-12">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4">
                        Shop by Category
                    </h2>
                    <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                        Browse our wide range of medical categories and find the right products for your health needs
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {categories.map((category) => {
                        const Icon = getCategoryIcon(category.name);
                        const colorClass = getCategoryColor(category.name);
                        const categoryUrl = getCategoryUrl(category.name);
                        
                        return (
                            <Link
                                key={category.id}
                                href={categoryUrl}
                                className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1"
                            >
                                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-lg ${colorClass} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon className="w-7 h-7 md:w-8 md:h-8" />
                                </div>
                                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                    {category.name}
                                </h3>
                                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                                    {category.description || `Browse ${category.name} products`}
                                </p>
                                <div className="mt-4 text-sm font-medium text-blue-600 group-hover:text-blue-700 flex items-center gap-1">
                                    Browse products
                                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* View All Button */}
                <div className="text-center mt-8 md:mt-12">
                    <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 md:px-8 py-3 md:py-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg text-sm md:text-base"
                    >
                        View All Products
                        
                    </Link>
                </div>
            </div>
        </section>
    );
}