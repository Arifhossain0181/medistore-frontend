'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { HeartIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardFooter,
  CardContent,
} from '@/nextjs/ui/card'

import { cn } from '@/lib/utils'
import { getAllMedicines } from '@/lib/api/medicine'

type Medicine = {
  id: string
  name: string
  description: string
  price: number
  manufacturer: string
  imageUrl?: string
  stock?: number
}

const ShopPage = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [likedId, setLikedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

 
  useEffect(() => {
    async function loadMedicines() {
      try {
        const data = await getAllMedicines()
        console.log("Medicines data:", data)
        
        // Handle different response structures
        if (data && data.data) {
          setMedicines(data.data)
        } else if (Array.isArray(data)) {
          setMedicines(data)
        }
      } catch (err) {
        console.error('Failed to load medicines:', err)
        setError('Failed to load medicines')
      } finally {
        setLoading(false)
      }
    }

    loadMedicines()
  }, [])


  if (loading) {
    return <p className="text-center py-10 text-lg">Loading medicines...</p>
  }

  if (error) {
    return <p className="text-center text-red-500 py-10 text-lg">{error}</p>
  }

  if (medicines.length === 0) {
    return <p className="text-center py-10 text-lg text-gray-500">No medicines available</p>
  }

 
  return (
    <section className="px-4 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Shop Medicines</h1>
        <p className="text-gray-600 mt-2">Browse our collection ({medicines.length} items)</p>
      </div>

      <div
        className="
          grid gap-6
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
        "
      >
        {medicines.map((med) => (
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
                    ? 'fill-red-500 stroke-red-500'
                    : 'stroke-black'
                )}
              />
            </Button>

            {/* IMAGE */}
            <Link href={`/shop/${med.id}`}>
              <div className="flex h-56 items-center justify-center bg-white rounded-t-xl cursor-pointer hover:opacity-90 transition-opacity">
                <Image 
                  src={med.imageUrl || '/placeholder.png'}
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
                  {med.stock !== undefined && (
                    <Badge variant={med.stock > 0 ? "outline" : "destructive"}>
                      {med.stock > 0 ? `Stock: ${med.stock}` : 'Out of Stock'}
                    </Badge>
                  )}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {med.description}
                </p>
              </CardContent>

              <CardFooter className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase text-muted-foreground">
                    Price
                  </p>
                  <p className="text-lg font-semibold">৳ {med.price.toFixed(2)}</p>
                </div>

                <Link href="/cart">
                  <Button disabled={med.stock === 0}>
                    {med.stock === 0 ? 'Out of Stock' : 'Add to cart'}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ShopPage
