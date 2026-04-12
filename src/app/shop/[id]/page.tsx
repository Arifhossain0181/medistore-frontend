"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { createMedicineReview, getAllMedicines, getMedicineReviews, getSingleMedicine, incrementMedicineView, type MedicineReview } from "@/lib/api/medicine"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Heart, Minus, Plus, Truck, ShieldCheck, Star } from "lucide-react"
import { toast } from "sonner"
import { useCartStore } from "@/store/cartstore"
import { useAuthStore } from "@/store/authstore"
import { Skeleton } from "@/components/ui/skeleton"

type Medicine = {
  id: string
  name: string
  description: string
  price: number
  stock?: number
  manufacturer: string
  category: {
    id: string
    name: string
  } | string
  imageUrl?: string
  viewCount?: number
  createdAt?: string
  updatedAt?: string
}

const getSafeImageSrc = (imageUrl?: string): string => {
  if (!imageUrl) return "/placeholder.png"

  const url = imageUrl.trim()
  if (!url) return "/placeholder.png"

  if (
    url.startsWith("/") ||
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("data:image/")
  ) {
    return url
  }

  return "/placeholder.png"
}

export default function Mediasingle(){
    const {id} = useParams()
    const router = useRouter()
    const [medicine, setMedicine] = useState<Medicine | null>(null)
  const [relatedMedicines, setRelatedMedicines] = useState<Medicine[]>([])
    const [reviews, setReviews] = useState<MedicineReview[]>([])
    const [reviewLoading, setReviewLoading] = useState(false)
    const [submittingReview, setSubmittingReview] = useState(false)
    const [rating, setRating] = useState(5)
    const [comment, setComment] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState("/placeholder.png")
    const [loading, setLoading] = useState(true)
    const { addToCart } = useCartStore()
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
    const user = useAuthStore((s) => s.user)
    const [isFavorite, setIsFavorite] = useState(false) // Added state from block

    const loadReviews = async (medicineId: string) => {
      try {
        setReviewLoading(true)
        const data = await getMedicineReviews(medicineId)
        setReviews(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Failed to load reviews:", error)
        setReviews([])
      } finally {
        setReviewLoading(false)
      }
    }

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

      for (let i = 0; i < quantity; i += 1) {
        addToCart({
          id: medicine.id,
          name: medicine.name,
          price: medicine.price,
          manufacturer: medicine.manufacturer,
          imageUrl: medicine.imageUrl,
        })
      }

      toast.success(`${quantity} x ${medicine.name} added to cart!`, {
        description: "Go to cart to checkout",
        action: {
          label: "View Cart",
          onClick: () => router.push("/cart"),
        },
      })
    }

    const handleBuyNow = () => {
      if (!medicine) return;

      if (!isAuthenticated) {
        toast.error("Please login to continue", {
          description: "You need to be logged in to make payment",
          action: {
            label: "Login",
            onClick: () => router.push("/auth/login"),
          },
        });
        return;
      }

      for (let i = 0; i < quantity; i += 1) {
        addToCart({
          id: medicine.id,
          name: medicine.name,
          price: medicine.price,
          manufacturer: medicine.manufacturer,
          imageUrl: medicine.imageUrl,
        });
      }

      toast.success("Proceed to checkout to complete payment", {
        description: "Shipping info and payment will create your order",
      });

      router.push("/checkout");
    }
    

  useEffect(() => {
    async function loaddata() {
      try {
        setLoading(true)
        void incrementMedicineView(id as string)
        const [data, allMedicinesResponse] = await Promise.all([
          getSingleMedicine(id as string),
          getAllMedicines(),
        ])

        const allMedicines: Medicine[] = Array.isArray(allMedicinesResponse)
          ? allMedicinesResponse
          : Array.isArray(allMedicinesResponse?.data)
            ? allMedicinesResponse.data
            : []

        const currentCategory =
          typeof data.category === "object" ? data.category?.name : data.category

        const related = allMedicines
          .filter((item) => item.id !== data.id)
          .filter((item) => {
            const itemCategory =
              typeof item.category === "object" ? item.category?.name : item.category
            return currentCategory ? itemCategory === currentCategory : true
          })
          .sort((a, b) => Number(b.viewCount || 0) - Number(a.viewCount || 0))
          .slice(0, 4)

        setMedicine(data)
        setSelectedImage(getSafeImageSrc(data.imageUrl))
        setRelatedMedicines(related)
        await loadReviews(id as string)
      } catch (err) {
        console.error("Error fetching medicine:", err)
        toast.error("Failed to load medicine details. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    loaddata()
  }, [id])

  const categoryName = useMemo(() => {
    if (!medicine) return "General"
    return typeof medicine.category === "object" ? medicine.category.name : medicine.category
  }, [medicine])

  const galleryImages = useMemo(() => {
    const main = getSafeImageSrc(medicine?.imageUrl)
    return [main]
  }, [medicine?.imageUrl])

  const avgRatingNumber = useMemo(() => {
    if (!reviews.length) return 0
    return reviews.reduce((sum, item) => sum + Number(item.rating || 0), 0) / reviews.length
  }, [reviews])

  const avgRating = avgRatingNumber ? avgRatingNumber.toFixed(1) : null

  const stockCount = medicine?.stock ?? 0
  const isInStock = stockCount > 0
  const maxQuantity = Math.min(20, stockCount || 1)

  const usageHint = useMemo(() => {
    if (!medicine?.description) return "Follow your physician's instructions for proper dosage and timing."
    const firstSentence = medicine.description.split(".")[0]?.trim()
    return firstSentence ? `${firstSentence}.` : "Follow your physician's instructions for proper dosage and timing."
  }, [medicine?.description])

  const handleSubmitReview = async () => {
    if (!medicine) return

    if (!isAuthenticated) {
      toast.error("Please login to add a review")
      router.push("/auth/login")
      return
    }

    if (!comment.trim()) {
      toast.error("Please write a review comment")
      return
    }

    try {
      setSubmittingReview(true)
      await createMedicineReview({
        medicineId: medicine.id,
        rating,
        comment: comment.trim(),
      })

      setComment("")
      setRating(5)
      await loadReviews(medicine.id)
      toast.success("Review submitted successfully")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to submit review"
      toast.error(message)
    } finally {
      setSubmittingReview(false)
    }
  }
  
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
    <section className="bg-slate-100 pb-16 pt-32 dark:bg-slate-950 md:pt-36">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-8 text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
          <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-300">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-emerald-600 dark:hover:text-emerald-300">Shop</Link>
          <span className="mx-2">/</span>
          <span>{categoryName}</span>
          <span className="mx-2">/</span>
          <span className="text-slate-700 dark:text-slate-200">{medicine.name}</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.9fr]">
          <div className="rounded-2xl border border-slate-200 bg-slate-100 p-4 dark:border-slate-800 dark:bg-slate-900/50 md:p-6">
            <div className="grid gap-4 md:grid-cols-[72px_1fr]">
              <div className="hidden flex-col gap-3 md:flex">
                {galleryImages.map((img, idx) => (
                  <button
                    key={`thumb-${idx}`}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`relative h-16 w-16 overflow-hidden rounded-lg border ${selectedImage === img ? "border-emerald-500" : "border-slate-300 dark:border-slate-700"}`}
                  >
                    <Image src={img} alt={`${medicine.name} preview ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>

              <div className="group relative min-h-[380px] overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900 md:min-h-[480px]">
                <Image
                  src={selectedImage}
                  alt={medicine.name}
                  fill
                  className="object-contain p-8 transition-transform duration-500 ease-out group-hover:scale-105"
                  priority
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <Badge className={isInStock ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300" : "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"}>
                {isInStock ? "Available" : "Out of Stock"}
              </Badge>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{medicine.name}</h1>
              <p className="mt-1 text-sm font-semibold tracking-wider text-cyan-700 uppercase dark:text-cyan-300">{medicine.manufacturer}</p>
            </div>

            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-extrabold text-slate-900 dark:text-slate-50">${medicine.price.toFixed(2)}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Stock: {stockCount}</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-600 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
              {medicine.description}
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">Quantity</p>
              <div className="inline-flex items-center rounded-lg border border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-slate-900">
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  disabled={!isInStock}
                  className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-12 px-4 text-center text-sm font-semibold">{String(quantity).padStart(2, "0")}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.min(maxQuantity, prev + 1))}
                  disabled={!isInStock || quantity >= maxQuantity}
                  className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                className="h-12 w-full gap-2 bg-emerald-700 text-white hover:bg-emerald-800" 
                size="lg"
                onClick={handleAddToCart}
                disabled={!isInStock}
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>
              <Button
                variant="default"
                size="lg"
                className="h-12 w-full bg-cyan-600 text-white hover:bg-cyan-700"
                onClick={handleBuyNow}
                disabled={!isInStock}
              >
                Buy Now
              </Button>

              <button
                type="button"
                className={`inline-flex items-center gap-2 text-sm font-medium ${
                  isFavorite
                    ? "text-red-500"
                    : "text-slate-500 hover:text-red-500"
                }`}
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart
                  className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`}
                />
                {isFavorite ? "Saved" : "Save for later"}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Lab Tested & Certified
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
                <Truck className="h-4 w-4 text-emerald-600" />
                Free Priority Shipping
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">Viewed {medicine.viewCount ?? 0} times</p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900">
              <h2 className="mb-3 text-sm font-bold tracking-[0.25em] text-emerald-700 uppercase dark:text-emerald-300">Overview</h2>
              <p className="leading-relaxed text-slate-600 dark:text-slate-300">{medicine.description}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900">
              <h2 className="mb-4 text-sm font-bold tracking-[0.25em] text-emerald-700 uppercase dark:text-emerald-300">Key Specifications</h2>
              <div className="grid gap-3 text-sm text-slate-600 dark:text-slate-300 md:grid-cols-2">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2 dark:border-slate-700">
                  <span>Category</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{categoryName}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-200 pb-2 dark:border-slate-700">
                  <span>Manufacturer</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{medicine.manufacturer}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-200 pb-2 dark:border-slate-700">
                  <span>Current Stock</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{stockCount}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-200 pb-2 dark:border-slate-700">
                  <span>Product ID</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">#{medicine.id.slice(0, 8)}</span>
                </div>
                <div className="flex items-center justify-between md:col-span-2">
                  <span>Last Updated</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {medicine.updatedAt ? new Date(medicine.updatedAt).toLocaleDateString() : "N/A"}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="mb-2 text-sm font-semibold text-slate-900 dark:text-slate-100">Usage Guidance</h3>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{usageHint}</p>
                <p className="mt-3 text-xs text-red-500">Consult a licensed clinician before starting any new medication.</p>
              </div>
            </div>
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900">
            <h2 className="mb-4 text-sm font-bold tracking-[0.25em] text-emerald-700 uppercase dark:text-emerald-300">Reviews</h2>
            <div className="flex items-end gap-2">
              <p className="text-5xl font-bold text-slate-900 dark:text-slate-100">{avgRating ?? "0.0"}</p>
              <div className="pb-2">
                <div className="flex text-emerald-600 dark:text-emerald-300">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={`star-${index}`}
                      className={`h-4 w-4 ${index < Math.round(avgRatingNumber) ? "fill-current" : "fill-transparent"}`}
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Based on {reviews.length} clinical reviews</p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {reviews.slice(0, 2).map((review) => (
                <div key={review.id} className="rounded-xl border border-slate-200 p-3 text-sm dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{review.user?.name || "Patient"}</p>
                    <span className="text-xs text-slate-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="mt-2 text-slate-600 dark:text-slate-300">&quot;{review.comment}&quot;</p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => document.getElementById("ratings-reviews")?.scrollIntoView({ behavior: "smooth" })}
              className="mt-6 text-xs font-semibold tracking-[0.18em] text-emerald-700 uppercase hover:text-emerald-600 dark:text-emerald-300"
            >
              View All Feedback
            </button>
          </aside>
        </div>

        <div id="ratings-reviews" className="mt-12 rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="text-2xl font-bold">Ratings & Reviews</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {avgRating ? `Average rating: ${avgRating}/5 from ${reviews.length} review(s)` : "No reviews yet"}
          </p>

          <div className="mt-6 rounded-lg border p-4">
            <h4 className="text-lg font-semibold">Write a review</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              {user ? `Reviewing as ${user.name}` : "Login required to submit a review"}
            </p>

            <div className="mt-4 flex items-center gap-3">
              <label htmlFor="rating" className="text-sm font-medium">Rating</label>
              <select
                id="rating"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="rounded-md border px-3 py-2 text-sm"
              >
                <option value={5}>5 - Excellent</option>
                <option value={4}>4 - Good</option>
                <option value={3}>3 - Average</option>
                <option value={2}>2 - Poor</option>
                <option value={1}>1 - Bad</option>
              </select>
            </div>

            <div className="mt-4">
              <label htmlFor="reviewComment" className="mb-2 block text-sm font-medium">Comment</label>
              <textarea
                id="reviewComment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this medicine..."
                className="min-h-[110px] w-full rounded-md border px-3 py-2 text-sm"
              />
            </div>

            <Button
              onClick={handleSubmitReview}
              disabled={submittingReview}
              className="mt-4"
            >
              {submittingReview ? "Submitting..." : "Submit Review"}
            </Button>
          </div>

          <div className="mt-6 space-y-3">
            {reviewLoading ? (
              <p className="text-sm text-muted-foreground">Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <p className="text-sm text-muted-foreground">No reviews submitted yet.</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">{review.user?.name || "Customer"}</p>
                    <p className="text-sm text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                  <p className="mt-1 text-sm">Rating: {review.rating}/5</p>
                  <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-12">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Relevant Medicines</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Dynamic suggestions from the same category</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedMedicines.length === 0 ? (
              <div className="col-span-full rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                No relevant medicines available right now.
              </div>
            ) : (
              relatedMedicines.map((item) => (
                <Link
                  key={item.id}
                  href={`/shop/${item.id}`}
                  className="group rounded-xl border border-slate-200 bg-slate-50 p-3 transition hover:-translate-y-1 hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
                >
                  <div className="relative mb-3 h-36 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                    <Image
                      src={getSafeImageSrc(item.imageUrl)}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <p className="line-clamp-1 font-semibold text-slate-900 dark:text-slate-100">{item.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{item.manufacturer}</p>
                  <p className="mt-2 text-base font-bold text-emerald-700 dark:text-emerald-300">${item.price.toFixed(2)}</p>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}