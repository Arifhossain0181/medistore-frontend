"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CustomerCheckoutRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/checkout");
  }, [router]);

  return <div className="p-6">Redirecting to checkout...</div>;
}
