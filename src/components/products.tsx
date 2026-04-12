"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

import { getAllMedicines } from "@/lib/api/medicine";

type Medicine = {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  manufacturer: string;
  rating?: number;
  viewCount?: number;
  category?:
    | {
        id: string;
        name: string;
      }
    | string;
};

const getSafeImageSrc = (imageUrl?: string): string => {
  if (!imageUrl) return "/placeholder.png";

  const url = imageUrl.trim();
  if (!url) return "/placeholder.png";

  if (url.startsWith("/") || url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:image/")) {
    return url;
  }

  return "/placeholder.png";
};

const getShopUrl = (medicine: Medicine) => {
  const categoryName = typeof medicine.category === "object" ? medicine.category?.name : medicine.category;
  const params = new URLSearchParams();

  if (categoryName) {
    params.set("category", categoryName);
  }

  params.set("search", medicine.name);
  return `/shop?${params.toString()}`;
};

const AnimatedSection = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay }}
    >
      {children}
    </motion.div>
  );
};

const Products = () => {
  const [products, setProducts] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await getAllMedicines();
        const medicines: Medicine[] = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
            ? response.data
            : [];

        const featuredMedicines = [...medicines]
          .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
          .slice(0, 4);

        setProducts(featuredMedicines);
      } catch (error) {
        console.error("Failed to load featured therapeutics:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    void loadFeaturedProducts();
  }, []);

  return (
    <section className="py-20 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-6">
        <AnimatedSection>
          <div className="mb-12 flex items-end justify-between gap-4">
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl dark:text-slate-100">
              Featured Therapeutics
            </h2>
            <Link
              href="/shop"
              className="text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-600 dark:text-emerald-300 dark:hover:text-emerald-200"
            >
              Featured Page
            </Link>
          </div>
        </AnimatedSection>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {[...Array(4)].map((_, index) => (
              <div
                key={`featured-skeleton-${index}`}
                className="h-72 animate-pulse rounded-2xl border border-slate-200/70 bg-slate-100 dark:border-slate-700/70 dark:bg-slate-800/70"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-slate-200/70 bg-white p-8 text-center text-slate-600 dark:border-slate-700/70 dark:bg-slate-900 dark:text-slate-300">
            No featured therapeutics available right now.
          </div>
        ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {products.map((product, i) => (
            <AnimatedSection key={product.name} delay={i * 0.1}>
              <motion.article
                whileHover={{ y: -6 }}
                className="group overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-[0_14px_28px_-24px_rgba(15,23,42,0.45)] transition-all duration-300 dark:border-slate-700/70 dark:bg-slate-900"
              >
                <Link href={getShopUrl(product)} className="block">
                  <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800/70">
                    <Image
                      src={getSafeImageSrc(product.imageUrl)}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="mb-1 text-sm font-semibold text-slate-900 transition-colors group-hover:text-emerald-600 dark:text-slate-100 dark:group-hover:text-emerald-300">
                      {product.name}
                    </h3>
                    <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">
                      {product.description || product.manufacturer || "Premium therapeutic product"}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-600 dark:text-emerald-300">
                        ${Number(product.price || 0).toFixed(2)}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star size={12} className="fill-amber-400 text-amber-400" />
                        {(product.rating || 4.7).toFixed(1)}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            </AnimatedSection>
          ))}
        </div>
        )}
      </div>
    </section>
  );
};

export { Products };
