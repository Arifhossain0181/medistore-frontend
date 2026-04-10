"use client";
import { useAuthStore } from "@/store/authstore";
import { useCartStore } from "@/store/cartstore";
import { useRouter } from "next/navigation";
import React from "react";

export default function CartPage() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const router = useRouter();

  const items = useCartStore((s) => s.items);
  const incrementQuantity = useCartStore((s) => s.incrementQuantity);
  const decrementQuantity = useCartStore((s) => s.decrementQuantity);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const getTotalPrice = useCartStore((s) => s.getTotalPrice);

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Cart</h1>
        <p className="text-red-600">You must be logged in to view the cart.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">My Cart</h1>
      {items.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <ul className="divide-y divide-gray-200 mb-6">
          {items.map((item) => (
            <li key={item.id} className="flex items-center py-4">
              {item.imageUrl && (
                <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded mr-4 object-cover" />
              )}
              <div className="flex-1">
                <div className="font-semibold text-lg">{item.name}</div>
                <div className="text-sm text-gray-500">{item.manufacturer}</div>
                <div className="text-sm text-gray-700">৳{item.price}</div>
                <div className="flex items-center mt-2">
                  <button
                    className="px-2 py-1 bg-gray-200 rounded"
                    onClick={() => decrementQuantity(item.id)}
                    disabled={user?.role !== "CUSTOMER"}
                  >-</button>
                  <span className="mx-2 font-medium">{item.quantity}</span>
                  <button
                    className="px-2 py-1 bg-gray-200 rounded"
                    onClick={() => incrementQuantity(item.id)}
                    disabled={user?.role !== "CUSTOMER"}
                  >+</button>
                </div>
              </div>
              <button
                className="ml-4 px-3 py-1 bg-red-500 text-white rounded"
                onClick={() => removeFromCart(item.id)}
                disabled={user?.role !== "CUSTOMER"}
              >Remove</button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex justify-between items-center mb-6">
        <span className="font-semibold text-lg">Total:</span>
        <span className="font-bold text-xl text-green-600">${getTotalPrice()}</span>
      </div>
      {user?.role === "CUSTOMER" ? (
        <button
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded disabled:bg-gray-400"
          onClick={() => router.push("/checkout")}
          disabled={items.length === 0}
        >Proceed to Checkout</button>
      ) : (
        <div className="w-full py-2 bg-gray-200 text-gray-600 font-semibold rounded text-center">
          Only customers can checkout or modify cart.
        </div>
      )}
    </div>
  );
}
