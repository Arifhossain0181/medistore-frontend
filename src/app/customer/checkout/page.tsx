"use client";

import { useAuthStore } from "@/store/authstore";
import { useCartStore } from "@/store/cartstore";
import { createOrder } from "@/lib/api/order";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Input } from "@/nextjs/ui/input";
import { Label } from "@/nextjs/ui/label";
import { Button } from "@/nextjs/ui/button";
import { toast } from "sonner";

export default function CheckoutPage() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  
  const [loading, setLoading] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    postalCode: "",
    phone: ""
  });

  useEffect(() => {
    if (!user || user.role !== "CUSTOMER") {
      router.replace("/login");
    }
    if (items.length === 0) {
      router.replace("/cart");
    }
  }, [user, router, items]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare order data
      const orderData = {
        items: items.map(item => ({
          medicineId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        total: getTotalPrice(),
        shippingAddress: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}`,
        phone: shippingInfo.phone
      };

      const result = await createOrder(orderData);
      console.log("Order created:", result);
      
      // Clear cart and redirect
      clearCart();
      toast.success("Order placed successfully!", {
        description: "Your order has been confirmed and will be delivered soon."
      });
      router.push("/customer/orders");
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Only allow checkout if user is CUSTOMER
  if (!user || user.role !== "CUSTOMER") {
    return <div>Redirecting...</div>;
  }

  if (items.length === 0) {
    return <div className="p-6 text-gray-900 dark:text-white">Your cart is empty...</div>;
  }

  const total = getTotalPrice();
  const shipping = 5.00; // Fixed shipping cost
  const grandTotal = total + shipping;

  return (
    <div className="container mx-auto p-6 max-w-6xl bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Shipping Information Form */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          
          <form onSubmit={handlePlaceOrder} className="space-y-4">
            <div>
              <Label htmlFor="address" className="text-gray-900 dark:text-white">Address</Label>
              <Input
                id="address"
                name="address"
                value={shippingInfo.address}
                onChange={handleChange}
                required
                placeholder="Street address"
                className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              />
            </div>

            <div>
              <Label htmlFor="city" className="text-gray-900 dark:text-white">City</Label>
              <Input
                id="city"
                name="city"
                value={shippingInfo.city}
                onChange={handleChange}
                required
                placeholder="City"
                className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              />
            </div>

            <div>
              <Label htmlFor="postalCode" className="text-gray-900 dark:text-white">Postal Code</Label>
              <Input
                id="postalCode"
                name="postalCode"
                value={shippingInfo.postalCode}
                onChange={handleChange}
                required
                placeholder="Postal code"
                className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-gray-900 dark:text-white">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={shippingInfo.phone}
                onChange={handleChange}
                required
                placeholder="Phone number"
                className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between border-b border-gray-200 dark:border-gray-600 pb-2">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ${item.price.toFixed(2)} × {item.quantity}
                  </p>
                </div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-2 border-t border-gray-200 dark:border-gray-600 pt-4">
            <div className="flex justify-between text-gray-900 dark:text-white">
              <span>Subtotal:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-900 dark:text-white">
              <span>Shipping:</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-gray-200 dark:border-gray-600 pt-2 text-gray-900 dark:text-white">
              <span>Total:</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Order includes {items.length} items</strong>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              Payment on delivery (Cash on Delivery)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
