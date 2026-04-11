"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { HeartIcon, EyeIcon, PackageIcon, ShoppingCart, Search, Filter } from "lucide-react";
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
import { getAllMedicines, getAllCategories } from "@/lib/api/medicine";
import { useCartStore } from "@/store/cartstore";
import { useAuthStore } from "@/store/authstore";
import { useRouter } from "next/navigation";

type Medicine = {
  id: string;
  name: string;
  description: string;
  price: number;
  manufacturer: string;
  imageUrl?: string;
  viewCount?: number;
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

const ShopPage = () => {
  const addToCart = useCartStore((s) => s.addToCart)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const router = useRouter()
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [likedId, setLikedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

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



  if (loading) {
    return (
      <section className="px-4 py-10">
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
    return <p className="text-center text-red-500 py-10 text-lg">{error}</p>;
  }

  if (medicines.length === 0) {
    return (
      <p className="text-center py-10 text-lg text-gray-500">
        No medicines available
      </p>
    );
  }

  return (
    <section className="px-4 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Shop Medicines</h1>
        <p className="text-gray-600 mt-2">
          Browse our collection ({filterMedicines.length} of {medicines.length} items)
        </p>
      </div>
      {/* Search and Filter Section */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            type="text" 
            placeholder="Search medicines by name, description, or manufacturer..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Category Filter */}
        <div className="relative sm:w-64">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
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
          <p className="text-lg text-gray-500 mb-2">No medicines found</p>
          <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
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
          {filterMedicines.map((med) => {
          return (
          <div
            key={med.id}
            className="relative rounded-xl bg-gradient-to-r from-neutral-700 to-violet-400 shadow-lg hover:shadow-xl transition-shadow"
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
            <Link href={`/shop/${med.id}`}>
              <div className="flex h-56 items-center justify-center bg-white rounded-t-xl cursor-pointer hover:opacity-90 transition-opacity">
                <Image
                  src={getSafeImageSrc(med.imageUrl)}
                  alt={med.name}
                  width={160}
                  height={160}
                  className="object-contain"
                />
              </div>
            </Link>

            {/* CARD */}
            <Card className="border-none rounded-t-none">
              <CardHeader>
                <Link href={`/shop/${med.id}`}>
                  <CardTitle className="line-clamp-1 cursor-pointer hover:text-violet-600 transition-colors">
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
                {/* View Count */}
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <EyeIcon className="h-4 w-4" />
                    <span>{med.viewCount || 0} views</span>
                  </div>
                </div>
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
                  className="gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to cart
                </Button>
              </CardFooter>
            </Card>
          </div>
          )
          })}
        </div>
      )}
    </section>
  );
};

export default ShopPage;
