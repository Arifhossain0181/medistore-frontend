"use client"

import { useCartStore } from "@/store/cartstore"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/nextjs/ui/card"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import { toast } from "sonner"

export default function CartPage() {
    const { items, removeFromCart, updateQuantity, getTotalPrice, getTotalItems, clearCart } = useCartStore()

    const handleQuantityChange = (id: string, currentQuantity: number, change: number, stock?: number) => {
        const newQuantity = currentQuantity + change
        
        if (newQuantity < 1) return
        
        if (stock && newQuantity > stock) {
            toast.error("Cannot exceed available stock")
            return
        }
        
        updateQuantity(id, newQuantity)
    }

    const handleRemove = (id: string, name: string) => {
        removeFromCart(id)
        toast.success(`${name} removed from cart`)
    }

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-12 sm:py-20">
                <div className="flex flex-col items-center justify-center gap-4 sm:gap-6">
                    <ShoppingBag className="h-20 w-20 sm:h-24 sm:w-24 text-gray-300" />
                    <h2 className="text-2xl sm:text-3xl font-bold text-center">Your cart is empty</h2>
                    <p className="text-muted-foreground text-center">Add some medicines to get started</p>
                    <Link href="/shop">
                        <Button size="lg" className="gap-2">
                            Continue Shopping
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    const subtotal = getTotalPrice()
    const shipping = 5.00
    const tax = subtotal * 0.1
    const total = subtotal + shipping + tax

    return (
        <div className="container mx-auto px-4 py-6 sm:py-10">
            {/* Header */}
            <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold">Shopping Cart</h1>
                    <p className="text-muted-foreground mt-2">
                        {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in your cart
                    </p>
                </div>
                <Button 
                    variant="outline" 
                    onClick={() => {
                        clearCart()
                        toast.success("Cart cleared")
                    }}
                    className="w-full sm:w-auto"
                >
                    Clear Cart
                </Button>
            </div>

            <div className="grid gap-6 lg:gap-8 lg:grid-cols-3">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => (
                        <Card key={item.id} className="p-3 sm:p-4">
                            <div className="flex gap-3 sm:gap-4">
                                {/* Image */}
                                <Link href={`/shop/${item.id}`} className="flex-shrink-0">
                                    <div className="relative h-20 w-20 sm:h-24 sm:w-24 bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                                        <Image
                                            src={item.imageUrl || "/placeholder.png"}
                                            alt={item.name}
                                            fill
                                            className="object-contain p-2"
                                        />
                                    </div>
                                </Link>

                                {/* Details */}
                                <div className="flex-1 min-w-0 flex flex-col justify-between">
                                    <div>
                                        <Link href={`/shop/${item.id}`}>
                                            <h3 className="font-semibold text-base sm:text-lg hover:text-violet-600 transition-colors cursor-pointer line-clamp-1">
                                                {item.name}
                                            </h3>
                                        </Link>
                                        <p className="text-xs sm:text-sm text-muted-foreground">{item.manufacturer}</p>
                                        <p className="text-base sm:text-lg font-bold mt-1 sm:mt-2">
                                            $ {(item.price || 0).toFixed(2)}
                                        </p>
                                    </div>

                                    {/* Mobile Quantity Controls */}
                                    <div className="flex items-center justify-between mt-3 lg:hidden">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="h-3 w-3" />
                                            </Button>
                                            <span className="w-10 text-center font-semibold">
                                                {item.quantity}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => handleQuantityChange(item.id, item.quantity, 1, item.stock)}
                                                disabled={item.stock !== undefined && item.quantity >= item.stock}
                                            >
                                                <Plus className="h-3 w-3" />
                                            </Button>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-semibold">
                                                $ {((item.price || 0) * item.quantity).toFixed(2)}
                                            </p>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleRemove(item.id, item.name)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Desktop Quantity Controls */}
                                <div className="hidden lg:flex flex-col items-end justify-between">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleRemove(item.id, item.name)}
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </Button>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                                            disabled={item.quantity <= 1}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <span className="w-12 text-center font-semibold">
                                            {item.quantity}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleQuantityChange(item.id, item.quantity, 1, item.stock)}
                                            disabled={item.stock !== undefined && item.quantity >= item.stock}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <p className="text-sm font-semibold">
                                        Total: $ {((item.price || 0) * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <Card className="p-4 sm:p-6 lg:sticky lg:top-4">
                        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Order Summary</h2>
                        
                        <div className="space-y-3 mb-4 sm:mb-6">
                            <div className="flex justify-between text-sm sm:text-base">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="font-semibold">$ {subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm sm:text-base">
                                <span className="text-muted-foreground">Shipping</span>
                                <span className="font-semibold">$ {shipping.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm sm:text-base">
                                <span className="text-muted-foreground">Tax (10%)</span>
                                <span className="font-semibold">$ {tax.toFixed(2)}</span>
                            </div>
                            <div className="border-t pt-3 mt-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-base sm:text-lg font-bold">Total</span>
                                    <span className="text-xl sm:text-2xl font-bold text-violet-600">
                                        $ {total.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <Link href="/checkout">
                            <Button size="lg" className="w-full mb-3">
                                Proceed to Checkout
                            </Button>
                        </Link>
                        
                        <Link href="/shop">
                            <Button variant="outline" size="lg" className="w-full">
                                Continue Shopping
                            </Button>
                        </Link>
                    </Card>
                </div>
            </div>
        </div>
    )
}