"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"
import { getSingleMedicine } from "@/lib/api/medicine"
import { Button } from "@/nextjs/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

type Medicine = {
  id: string
  name: string
  description: string
  price: number
  manufacturer: string
  category: string
  imageUrl?: string
}
export default function Mediasingle(){
    const {id} = useParams()
    const [medicine, setMedicine] = useState<Medicine | null>(null)
    

    useEffect(() => {
        async function loaddata(){
            try{
                const data = await getSingleMedicine(id as string)
                setMedicine(data)
                console.log(data)
            } catch(err){
                console.error("Error fetching medicine:", err)
            }
        }
        loaddata()
    },[id])
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
          <Badge>{medicine?.category}</Badge>

          <h1 className="text-3xl font-bold">{medicine?.name}</h1>

          <p className="text-muted-foreground">{medicine?.description}</p>
          <p className="text-xl font-semibold ">$ {medicine?.price}</p>

          <Link href="/cart" className="inline-block">
            <Button size="lg">Add to cart</Button>
          </Link>
        </div>
      </div>
    </section>
    )
}