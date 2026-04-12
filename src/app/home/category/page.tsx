

"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { getAllCategories } from "@/lib/api/medicine";

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
   
   // Helper function
   const getCategoryUrl = (categoryName: string) => {
       const slug = categoryName.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-');
       return `/shop?category=${slug}`;
   };

   const displayedCategories = categories.slice(0, 6);
   
   if (loading) {
       return (
           <section className="py-16 md:py-20 bg-slate-50 dark:bg-slate-950">
               <div className="container mx-auto px-4">
                   <div className="text-center mb-8 md:mb-12">
                       <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-3 md:mb-4">
                           Curated Care Collections
                       </h2>
                   </div>
                   <div className="flex items-center justify-center py-12">
                       <div className="text-center space-y-4">
                           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                           <p className="text-slate-600 dark:text-slate-300">Loading categories...</p>
                       </div>
                   </div>
               </div>
           </section>
       );
   }

   if (error) {
       return (
           <section className="py-16 md:py-20 bg-slate-50 dark:bg-slate-950">
               <div className="container mx-auto px-4">
                   <div className="text-center mb-8 md:mb-12">
                       <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-3 md:mb-4">
                           Curated Care Collections
                       </h2>
                   </div>
                   <div className="flex items-center justify-center py-12">
                       <div className="text-center space-y-4">
                           <div className="text-red-600 text-lg font-semibold">⚠️ Error Loading Categories</div>
                           <p className="text-slate-600 dark:text-slate-300">{error}</p>
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
        <section className="py-16 md:py-20 bg-slate-50 dark:bg-slate-950">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.5 }}
                    className="mb-10 flex items-end justify-between"
                >
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                            Curated Care Collections
                        </h2>
                        <p className="text-muted-foreground max-w-xl">
                            Browse our expertly organized categories designed for effortless discovery.
                        </p>
                    </div>
                    <Link href="/shop" className="hidden md:flex items-center gap-1 text-emerald-700 dark:text-emerald-300 text-sm font-medium hover:gap-2 transition-all">
                        View All Categories <ArrowUpRight size={16} />
                    </Link>
                </motion.div>

                {categories.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white/75 p-10 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
                        No categories available right now.
                    </div>
                ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {displayedCategories.map((category, idx) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.45, delay: 0.08 + idx * 0.06 }}
                        >
                            <Link
                                href={getCategoryUrl(category.name)}
                                className="group block rounded-2xl border border-slate-200/70 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg dark:border-slate-700/70 dark:bg-slate-900"
                            >
                                <h3 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-emerald-600 dark:text-slate-100 dark:group-hover:text-emerald-300">
                                    {category.name}
                                </h3>
                                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                                    {category.description || `Browse ${category.name} products`}
                                </p>
                                <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                                    Explore <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
                )}

                {/* View All Button */}
                <div className="text-center mt-8 md:mt-12">
                    <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 md:px-8 py-3 md:py-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg text-sm md:text-base"
                    >
                        View All Products
                        <ArrowUpRight size={16} />
                    </Link>
                </div>
            </div>
        </section>
    );
}