import { useAuthStore } from "@/store/authstore";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function CheckoutPage() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "CUSTOMER") {
      router.replace("/login");
    }
  }, [user, router]);

  // Only allow checkout if user is CUSTOMER
  if (!user || user.role !== "CUSTOMER") {
    return <div>Redirecting...</div>;
  }

  return (
    <div>
      <h1>Checkout</h1>
      {/* Checkout form goes here */}
    </div>
  );
}
