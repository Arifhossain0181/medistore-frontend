"use client";
import { useAuthStore } from "@/store/authstore";
import { useCartStore } from "@/store/cartstore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const getSafeImageSrc = (imageUrl?: string): string => {
  if (!imageUrl) return "/placeholder.png";
  const url = imageUrl.trim();
  if (!url) return "/placeholder.png";

  if (url.startsWith("/") || url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:image/")) {
    return url;
  }

  return "/placeholder.png";
};

export default function CartPage() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const router = useRouter();

  const items = useCartStore((s) => s.items);
  const incrementQuantity = useCartStore((s) => s.incrementQuantity);
  const decrementQuantity = useCartStore((s) => s.decrementQuantity);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const getTotalPrice = useCartStore((s) => s.getTotalPrice);
  const totalItems = useCartStore((s) => s.getTotalItems());

  if (!isAuthenticated) {
    return (
      <section className="bg-slate-50 px-4 pt-32 pb-16 dark:bg-slate-950 md:pt-36">
        <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-[0_18px_40px_-30px_rgba(15,23,42,0.55)] dark:border-slate-700 dark:bg-slate-900">
          <h1 className="mb-3 text-2xl font-bold text-slate-900 dark:text-slate-100">Cart Access Required</h1>
          <p className="mb-6 text-sm text-slate-600 dark:text-slate-300">You must be logged in to view and manage your cart.</p>
          <Link
            href="/login"
            className="inline-flex rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Go to Login
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-slate-50 px-4 pt-32 pb-16 dark:bg-slate-950 md:pt-36">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 md:text-4xl">My Cart</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{totalItems} item(s) in your basket</p>
          </div>
          <Link href="/shop" className="text-sm font-semibold text-emerald-700 hover:text-emerald-600 dark:text-emerald-300">
            Continue Shopping
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900 md:p-6">
            {items.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 px-4 py-10 text-center dark:border-slate-700">
                <p className="text-slate-500 dark:text-slate-300">Your cart is empty.</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center gap-4 rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                    <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                      <Image src={getSafeImageSrc(item.imageUrl)} alt={item.name} fill className="object-cover" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-semibold text-slate-900 dark:text-slate-100">{item.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{item.manufacturer}</p>
                      <p className="mt-1 text-sm font-semibold text-emerald-700 dark:text-emerald-300">${item.price.toFixed(2)}</p>

                      <div className="mt-2 flex items-center gap-2">
                        <button
                          className="rounded-md border border-slate-300 px-2 py-1 text-sm hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
                          onClick={() => decrementQuantity(item.id)}
                          disabled={user?.role !== "CUSTOMER"}
                        >
                          -
                        </button>
                        <span className="min-w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          className="rounded-md border border-slate-300 px-2 py-1 text-sm hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
                          onClick={() => incrementQuantity(item.id)}
                          disabled={user?.role !== "CUSTOMER"}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      className="rounded-md bg-red-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-600 disabled:opacity-60"
                      onClick={() => removeFromCart(item.id)}
                      disabled={user?.role !== "CUSTOMER"}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900 md:p-6">
            <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>Items</span>
                <span>{totalItems}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>Subtotal</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>Delivery</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <div className="my-4 border-t border-slate-200 pt-4 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-slate-900 dark:text-slate-100">Total</span>
                <span className="text-xl font-bold text-emerald-700 dark:text-emerald-300">${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>

            {user?.role === "CUSTOMER" ? (
              <button
                className="w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                onClick={() => router.push("/checkout")}
                disabled={items.length === 0}
              >
                Proceed to Checkout
              </button>
            ) : (
              <div className="w-full rounded-lg bg-slate-100 py-2.5 text-center text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                Only customers can checkout or modify cart.
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
