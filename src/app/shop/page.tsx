"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { HeartIcon, ShoppingCart, Search, Filter } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardFooter,
  CardContent,
} from "@/nextjs/ui/card";

import { cn } from "@/lib/utils";
import { getAllMedicines, getAllCategories, incrementMedicineView } from "@/lib/api/medicine";
import { useCartStore } from "@/store/cartstore";
import { useAuthStore } from "@/store/authstore";
import { useRouter, useSearchParams } from "next/navigation";

type Medicine = {
  id: string;
  name: string;
  description: string;
  price: number;
  manufacturer: string;
  imageUrl?: string;
  category?: {
    id: string;
    name: string;
  } | string;
};

type Category = {
  id: string;
  name: string;
  description?: string;
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

const ShopPageContent = () => {
  const { scrollYProgress } = useScroll();
  const orbY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  const addToCart = useCartStore((s) => s.addToCart)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const router = useRouter()
  const searchParams = useSearchParams()
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [likedId, setLikedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    const searchFromUrl = searchParams.get("search") || "";
    const categoryFromUrl = searchParams.get("category") || "all";

    setSearchTerm(searchFromUrl);
    setSelectedCategory(categoryFromUrl);
  }, [searchParams]);

  useEffect(() => {
    async function loadData(){
      try{
        const [meddata ,catadata] = await Promise.all([getAllMedicines(), getAllCategories()])

        if(meddata && meddata.data){
          setMedicines(meddata.data)
        }
        else if(Array.isArray(meddata)){
          setMedicines(meddata)
        }
        if(catadata && catadata.data){
          setCategories(catadata.data)
        }
        else if(Array.isArray(catadata)){
          setCategories(catadata)
        }
      }
      catch(error){
        console.error("Failed to load data:", error)
        toast.error("Failed to load medicines. Please try again.")
        setError("Failed to load data")
      }
      finally{
        setLoading(false)
      }
    }
    loadData();
  }, [])
  //filter medicines based on search and category
  const filterMedicines = medicines.filter((med) => {
    const matchesSearch = 
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const categoryName = typeof med.category === "object" ? med.category?.name : med.category;
    const matchesCategory = 
      selectedCategory === "all" || categoryName?.toLowerCase() === selectedCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });
  
  const handleAddtoCart = (med: Medicine) => {
    // Check if user is logged in
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart", {
        description: "You need to be logged in to shop",
        action: {
          label: "Login",
          onClick: () => router.push("/auth/login")
        }
      })
      return
    }
    
    // Validate required fields
    if (!med.price || !med.name) {
      console.error("Invalid medicine data:", med)
      toast.error("Cannot add item: Missing required data")
      return
    }
  
    addToCart({ 
      id: med.id, 
      name: med.name, 
      price: med.price, 
      manufacturer: med.manufacturer, 
      imageUrl: med.imageUrl,
    })
  
    toast.success(`${med.name} added to cart!`, {
      description: "Go to cart to checkout",
    })
  }

  const handleMedicineClick = (medicineId: string) => {
    void incrementMedicineView(medicineId);
  }



  if (loading) {
    return (
      <section className="px-4 pt-32 pb-12 md:pt-36">
        <div className="mx-auto mb-8 max-w-7xl">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-56 w-full" />
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-8 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return <p className="py-32 text-center text-lg text-red-500">{error}</p>;
  }

  if (medicines.length === 0) {
    return (
      <p className="text-center py-10 text-lg text-gray-500">
        No medicines available
      </p>
    );
  }

  return (
    <section className="relative overflow-hidden bg-slate-50 px-4 pt-32 pb-16 dark:bg-slate-950 md:pt-36">
      <motion.div style={{ y: orbY }} className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-emerald-200/20 blur-3xl dark:bg-emerald-500/8" />
        <div className="absolute top-1/3 -right-20 h-72 w-72 rounded-full bg-cyan-200/20 blur-3xl dark:bg-cyan-500/8" />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 md:text-5xl">Shop Medicines</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Browse our collection ({filterMedicines.length} of {medicines.length} items)
        </p>
      </motion.div>
      {/* Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="mb-6 rounded-2xl border border-emerald-100 bg-white/75 p-4 shadow-[0_16px_35px_-30px_rgba(15,23,42,0.45)] backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/70"
      >
      <div className="flex flex-col gap-4 sm:flex-row">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input 
            type="text" 
            placeholder="Search medicines by name, description, or manufacturer..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 border-emerald-100 bg-white/90 pl-10 dark:border-slate-700 dark:bg-slate-900"
          />
        </div>
        
        {/* Category Filter */}
        <div className="relative sm:w-64">
          <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-11 w-full rounded-md border border-emerald-100 bg-white/90 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:border-slate-700 dark:bg-slate-900"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      </motion.div>

      {/* Active Filters Display */}
      {(searchTerm || selectedCategory !== "all") && (
        <div className="mb-4 flex flex-wrap gap-2">
          {searchTerm && (
            <Badge variant="secondary" className="gap-1">
              Search: {searchTerm}
              <button
                onClick={() => setSearchTerm("")}
                className="ml-1 hover:text-destructive"
              >
                X
              </button>
            </Badge>
          )}
          {selectedCategory !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Category: {selectedCategory}
              <button
                onClick={() => setSelectedCategory("all")}
                className="ml-1 hover:text-destructive"
              >
                X
              </button>
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
            }}
            className="h-6 text-xs"
          >
            Clear all filters
          </Button>
        </div>
      )}

      {/* No Results Message */}
      {filterMedicines.length === 0 ? (
        <div className="text-center py-10">
          <p className="mb-2 text-lg text-slate-500 dark:text-slate-300">No medicines found</p>
          <p className="text-sm text-slate-400 dark:text-slate-400">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div
          className="
            grid gap-6
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
          ">
          {filterMedicines.map((med, index) => {
          return (
          <motion.div
            key={med.id}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            whileHover={{ y: -6 }}
            className="group relative overflow-hidden rounded-xl border border-emerald-100 bg-white/90 shadow-[0_20px_40px_-35px_rgba(15,23,42,0.55)] transition-all dark:border-slate-700 dark:bg-slate-900/90"
          >
            {/* LIKE BUTTON */}
            <Button
              size="icon"
              onClick={() => setLikedId(likedId === med.id ? null : med.id)}
              className="absolute right-3 top-3 z-10 rounded-full bg-white/80 hover:bg-white"
            >
              <HeartIcon
                className={cn(
                  likedId === med.id
                    ? "fill-red-500 stroke-red-500"
                    : "stroke-black",
                )}
              />
            </Button>

            {/* IMAGE */}
            <Link href={`/shop/${med.id}`} onClick={() => handleMedicineClick(med.id)}>
              <div className="flex h-56 cursor-pointer items-center justify-center rounded-t-xl bg-slate-50 transition-opacity hover:opacity-95 dark:bg-slate-800/80">
                <Image
                  src={getSafeImageSrc(med.imageUrl)}
                  alt={med.name}
                  width={160}
                  height={160}
                  className="object-contain transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            </Link>

            {/* CARD */}
            <Card className="rounded-t-none border-none bg-transparent">
              <CardHeader>
                <Link href={`/shop/${med.id}`} onClick={() => handleMedicineClick(med.id)}>
                  <CardTitle className="line-clamp-1 cursor-pointer transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-300">
                    {med.name}
                  </CardTitle>
                </Link>
                <CardDescription className="flex gap-2 flex-wrap">
                  <Badge variant="outline">{med.manufacturer}</Badge>
                </CardDescription>
              </CardHeader>

              <CardContent>
                <p className="line-clamp-2 text-sm text-muted-foreground mb-3">
                  {med.description}
                </p>
              </CardContent>

              <CardFooter className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase text-muted-foreground">
                    Price
                  </p>
                  <p className="text-lg font-semibold">
                    $ {med.price.toFixed(2)}
                  </p>
                </div>

                <Button 
                  onClick={() => handleAddtoCart(med)}
                  className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to cart
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
          )
          })}
        </div>
      )}
      </div>
    </section>
  );
};

export default function ShopPage() {
  return (
    <Suspense fallback={<section className="px-4 pt-32 pb-12 md:pt-36"><div className="mx-auto max-w-7xl rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">Loading shop...</div></section>}>
      <ShopPageContent />
    </Suspense>
  );
}
