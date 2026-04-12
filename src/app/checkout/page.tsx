"use client";

import { useAuthStore } from "@/store/authstore";
import { useCartStore } from "@/store/cartstore";
import { checkDeliveryServiceability, type DeliveryCoverageCheck } from "@/lib/api/delivery";
import { createCartCheckoutSession } from "@/lib/api/payment";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { Input } from "@/nextjs/ui/input";
import { Label } from "@/nextjs/ui/label";
import { Button } from "@/nextjs/ui/button";
import { toast } from "sonner";
import { DELIVERY_AREAS } from "@/lib/delivery-areas";
import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutPage() {
  const user = useAuthStore((s) => s.user);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const router = useRouter();
  const { items, getTotalPrice } = useCartStore();
  
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [serviceability, setServiceability] = useState<DeliveryCoverageCheck | null>(null);
  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [thana, setThana] = useState("");
  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    postalCode: "",
    phone: ""
  });

  const selectedDivision = DELIVERY_AREAS.find((area) => area.value === division);
  const districtOptions = selectedDivision?.districts ?? [];
  const selectedDistrict = districtOptions.find((item) => item.value === district);
  const thanaOptions = selectedDistrict?.thanas ?? [];

  const shippingAddress = useMemo(
    () => `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}`.trim(),
    [shippingInfo.address, shippingInfo.city, shippingInfo.postalCode],
  );

  useEffect(() => {
    const loadCoverage = async () => {
      if (!division || !district || !thana) {
        setServiceability(null);
        return;
      }

      setChecking(true);
      try {
        const result = await checkDeliveryServiceability(division, district, thana);
        setServiceability(result);
      } catch (error) {
        console.error("Serviceability check failed:", error);
        setServiceability(null);
      } finally {
        setChecking(false);
      }
    };

    loadCoverage();
  }, [division, district, thana]);

  useEffect(() => {
    if (!hasHydrated) return;

    if (!user || user.role !== "CUSTOMER") {
      router.replace("/login");
    }
    if (items.length === 0) {
      router.replace("/");
    }
  }, [hasHydrated, user, router, items]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!serviceability?.serviceable) {
        toast.error("Selected area is not serviceable yet.");
        return;
      }

      setLoading(true);

      const orderData = {
        items: items.map(item => ({
          medicineId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        total: getTotalPrice(),
        shippingAddress,
        phone: shippingInfo.phone,
        division,
        district,
        thana,
      };

      sessionStorage.setItem("pendingOrderData", JSON.stringify(orderData));

      const session = await createCartCheckoutSession(
        items.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      );

      if (!session.url) {
        throw new Error("Stripe checkout URL not found");
      }

      window.location.href = session.url;
    } catch (error) {
      console.error("Order error:", error);
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Failed to start payment. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Only allow checkout if user is CUSTOMER
  if (!hasHydrated) {
    return (
      <div className="container mx-auto max-w-6xl p-6">
        <div className="space-y-4">
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-6 w-72" />
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-96 w-full rounded-lg" />
            <Skeleton className="h-96 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "CUSTOMER") {
    return <div>Redirecting...</div>;
  }

  if (items.length === 0) {
    return <div>Your cart is empty...</div>;
  }

  const total = getTotalPrice();
  const shipping = serviceability?.fee ?? 0;
  const grandTotal = total + shipping;

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Shipping Information Form */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Shipping Information</h2>
          
          <form onSubmit={handlePlaceOrder} className="space-y-4">
            <div className="space-y-2 rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Delivery Area</p>
              <div>
                <Label htmlFor="division">Division</Label>
                <select
                  id="division"
                  value={division}
                  onChange={(e) => {
                    setDivision(e.target.value);
                    setDistrict("");
                    setThana("");
                  }}
                  className="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                >
                  <option value="" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Select division</option>
                  {DELIVERY_AREAS.map((area) => (
                    <option key={area.value} value={area.value} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                      {area.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="district">District</Label>
                <select
                  id="district"
                  value={district}
                  onChange={(e) => {
                    setDistrict(e.target.value);
                    setThana("");
                  }}
                  className="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                  disabled={!division}
                >
                  <option value="" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Select district</option>
                  {districtOptions.map((item) => (
                    <option key={item.value} value={item.value} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="thana">Thana</Label>
                <select
                  id="thana"
                  value={thana}
                  onChange={(e) => setThana(e.target.value)}
                  className="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                  disabled={!district}
                >
                  <option value="" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Select thana</option>
                  {thanaOptions.map((item) => (
                    <option key={item.value} value={item.value} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-sm text-slate-600 dark:text-slate-400">
                {checking ? "Checking serviceability..." : serviceability ? (
                  <>
                    <p>Mode: {serviceability.mode}</p>
                    <p>Delivery fee: ৳{serviceability.fee.toFixed(2)}</p>
                    <p>ETA: {serviceability.etaDays ?? "-"} day(s)</p>
                  </>
                ) : (
                  <p>Select division, district and thana to check serviceability.</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={shippingInfo.address}
                onChange={handleChange}
                required
                placeholder="Street address"
              />
            </div>

            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={shippingInfo.city}
                onChange={handleChange}
                required
                placeholder="City"
              />
            </div>

            <div>
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                name="postalCode"
                value={shippingInfo.postalCode}
                onChange={handleChange}
                required
                placeholder="Postal code"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={shippingInfo.phone}
                onChange={handleChange}
                required
                placeholder="Phone number"
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading || checking || !serviceability?.serviceable}
              className="w-full"
            >
              {loading ? "Redirecting..." : "Continue to Secure Payment"}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Order Summary</h2>
          
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{item.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ${item.price.toFixed(2)} × {item.quantity}
                  </p>
                </div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-2 border-t border-slate-200 dark:border-slate-700 pt-4">
            <div className="flex justify-between text-slate-900 dark:text-white">
              <span>Subtotal:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-900 dark:text-white">
              <span>Shipping:</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-slate-200 dark:border-slate-700 pt-2 text-slate-900 dark:text-white">
              <span>Total:</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 dark:bg-slate-800 rounded">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong className="text-slate-900 dark:text-white">Order includes {items.length} items</strong>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Online card payment only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
