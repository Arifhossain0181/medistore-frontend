"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"
import { getSingleMedicine } from "@/lib/api/medicine"
import { Button } from "@/nextjs/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Eye } from "lucide-react"
import { toast } from "sonner"
import { useCartStore } from "@/store/cartstore"
import { Skeleton } from "@/components/ui/skeleton"

type Medicine = {
  id: string
  name: string
  description: string
  price: number
  manufacturer: string
  category: {
    id: string
    name: string
  } | string  // Can be object (from backend with include) or string
  imageUrl?: string
  viewCount?: number
}
export default function Mediasingle(){
    const {id} = useParams()
    const router = useRouter()
    const [medicine, setMedicine] = useState<Medicine | null>(null)
    const [loading, setLoading] = useState(true)
    const { addToCart } = useCartStore()

    const handleAddToCart = () => {
      if (!medicine) return
      
      // Validate required fields
      if (!medicine.price || !medicine.name) {
        console.error("Invalid medicine data:", medicine)
        toast.error("Cannot add item: Missing required data")
        return
      }

      addToCart({
        id: medicine.id,
        name: medicine.name,
        price: medicine.price,
        manufacturer: medicine.manufacturer,
        imageUrl: medicine.imageUrl,
      })

      toast.success(`${medicine.name} added to cart!`, {
        description: "Go to cart to checkout",
        action: {
          label: "View Cart",
          onClick: () => router.push("/cart"),
        },
      })
    }
    

  useEffect(() => {
    async function loaddata() {
      try {
        setLoading(true)
        const data = await getSingleMedicine(id as string)
        setMedicine(data)
      } catch (err) {
        console.error("Error fetching medicine:", err)
        toast.error("Failed to load medicine details. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    loaddata()
  }, [id])
  
  if (loading) {
    return (
      <section className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <Skeleton className="w-full h-96 rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-12 w-40" />
          </div>
        </div>
      </section>
    )
  }
  
  if (!medicine) {
    return (
      <section className="container mx-auto px-4 py-10">
        <p className="text-center text-red-500">Medicine not found</p>
      </section>
    )
  }
  
  return (
         <section className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        {/* IMAGE */}
        <div className="flex justify-center">
          <Image
            src={medicine?.imageUrl || '/placeholder.png'}
            alt={medicine?.name || "Medicine Image"}
            width={350}
            height={350}
            className="object-contain"
          />
        </div>

        {/* INFO */}
        <div className="space-y-4">
          <Badge>{typeof medicine?.category === 'object' ? medicine?.category?.name : medicine?.category}</Badge>

          <h1 className="text-3xl font-bold">{medicine?.name}</h1>

          <p className="text-muted-foreground">{medicine?.description}</p>
          
          <div className="space-y-2">
            <p className="text-2xl font-semibold text-primary">$ {(medicine?.price || 0).toFixed(2)}</p>
            
            <div className="flex flex-wrap items-center gap-2">
              {medicine?.manufacturer && (
                <span className="text-sm text-muted-foreground">
                  by {medicine.manufacturer}
                </span>
              )}
              {medicine?.viewCount !== undefined && (
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  {medicine.viewCount} views
                </span>
              )}
            </div>
          </div>

          <Button 
            size="lg" 
            onClick={handleAddToCart}
            disabled={!medicine}
            className="gap-2 w-full sm:w-auto"
          >
            <ShoppingCart className="h-5 w-5" />
            Add to cart
          </Button>
        </div>
      </div>
    </section>
    )
}