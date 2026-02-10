"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"
import { getSingleMedicine } from "@/lib/api/medicine"
import { Button } from "@/nextjs/ui/button" // Keeping existing import
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Eye, Heart } from "lucide-react"
import { toast } from "sonner"
import { useCartStore } from "@/store/cartstore"
import { useAuthStore } from "@/store/authstore"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"


type Medicine = {
  id: string
  name: string
  description: string
  price: number
  manufacturer: string
  category: {
    id: string
    name: string
  } | string
  imageUrl?: string
  viewCount?: number
}

// Placeholder for similar items as we don't have this data yet
const SIMILAR_ITEMS = [
//   {
//     name: "Black Bustier Top",
//     price: "€49.95",
//     image:
//       "https://images.unsplash.com/photo-1661327930345-9c6714b603b3?auto=format&fit=crop&q=80&w=400&h=400",
//     sizes: "Available in 5 size",
//   },
]

export default function Mediasingle(){
    const {id} = useParams()
    const router = useRouter()
    const [medicine, setMedicine] = useState<Medicine | null>(null)
    const [loading, setLoading] = useState(true)
    const { addToCart } = useCartStore()
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
    const [isFavorite, setIsFavorite] = useState(false) // Added state from block

    const handleAddToCart = () => {
      if (!medicine) return
      
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
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <Skeleton className="w-full h-[32rem] rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-40 w-full" />
            <div className="flex gap-2">
                 <Skeleton className="h-10 w-32" />
                 <Skeleton className="h-10 w-10" />
            </div>
          </div>
        </div>
      </section>
    )
  }
  
  if (!medicine) {
    return (
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-red-500">Medicine not found</h2>
        <Button onClick={() => router.push('/')} variant="link" className="mt-4">Back to Shop</Button>
      </section>
    )
  }
  
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Main Product Section */}
        <div className="mb-16 grid grid-cols-1 items-start gap-x-8 gap-y-10 md:grid-cols-2">
          <div className="bg-muted/30 relative h-full max-h-[32rem] w-full overflow-hidden rounded-xl border">
             {medicine.imageUrl ? (
                <Image
                  src={medicine.imageUrl}
                  alt={medicine.name}
                  fill
                  className="h-full w-full object-contain p-4"
                  priority
                />
             ) : (
                <div className="flex h-full items-center justify-center bg-gray-100 text-gray-400">
                    No Image Available
                </div>
             )}
          </div>
          <div className="md:p-2">
            <h3 className="text-3xl font-bold">{medicine.name}</h3>
            <p className="text-primary my-4 text-3xl font-bold">$ {medicine.price.toFixed(2)}</p>
            <div className="text-muted-foreground leading-relaxed">
              <Badge variant="outline" className="mb-2">
                {typeof medicine.category === 'object' ? medicine.category.name : medicine.category}
              </Badge>
              <p>Manufacturer: {medicine.manufacturer}</p>
            </div>

            <div className="my-6 flex items-center gap-2">
               {medicine.viewCount !== undefined && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  <span>{medicine.viewCount} views</span>
                </div>
              )}
              {/* Star rating placeholder from block */}
              {/* <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="h-5 w-5 fill-yellow-400"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div> */}
              {/* <p className="text-sm font-semibold">100 Reviews</p> */}
            </div>

            {/* Sizes / Colors removed as they don't apply to medicine generally, or data is missing */}

            <div className="mt-8 flex items-center gap-3">
              <Button 
                className="w-full max-w-sm gap-2" 
                size="lg"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                size="icon"
                className={`h-11 w-11 ${
                  isFavorite
                    ? "text-red-500 hover:text-red-600"
                    : "text-muted-foreground hover:text-red-500"
                }`}
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart
                  className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`}
                />
              </Button>
            </div>
          </div>
        </div>

        {/* More Info & Similar Items Section */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* More Info Section */}
          <div>
            <h3 className="mb-6 text-2xl font-bold">More Info</h3>
            <Accordion
              type="single"
              collapsible
              defaultValue="description"
              className="w-full"
            >
              <AccordionItem value="description">
                <AccordionTrigger className="text-base font-semibold">
                  Description
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  <p className="mb-4">
                    {medicine.description}
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="delivery">
                <AccordionTrigger className="text-base font-semibold">
                  Delivery & Returns
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  <p className="mb-4">
                    <strong>Standard Delivery:</strong> Available. Rates calculated at checkout.
                  </p>
                  <p>
                    <strong>Returns:</strong> Medicine returns are subject to safety regulations. Please contact support.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="contact" className="border-b-0">
                <AccordionTrigger className="text-base font-semibold">
                  Contact Us
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  <p className="mb-3">
                    Have questions about this medicine? We're here to help!
                  </p>
                  <p className="mb-2">
                    <strong>Email:</strong> support@medistore.com
                  </p>
                  <p>
                    <strong>Hours:</strong> Mon-Fri, 9AM-6PM EST
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Similar Items Section - Placeholder or Mock */}
          {/* <div>
            <h3 className="mb-6 text-2xl font-bold">Similar Items</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {SIMILAR_ITEMS.map((item, index) => (
                <Card
                  key={index}
                  className="group cursor-pointer overflow-hidden py-0 transition-shadow hover:shadow-lg"
                >
                  <CardContent className="p-0">
                    <div className="bg-muted aspect-[4/5] overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold tracking-wide uppercase">
                        {item.name}
                      </h4>
                      <p className="mt-2 text-lg font-bold">{item.price}</p>
                      <p className="text-muted-foreground mt-2 text-sm">
                        {item.sizes}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div> */}
        </div>
      </div>
    </section>
  )
}