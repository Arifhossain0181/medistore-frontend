export async function initMedicinePayment(medicineId: string) {
  const res = await fetch("/api/payment/init", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ medicineId }),
  });

  const payload = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(payload?.message || "Failed to initialize payment");
  }

  return payload as {
    url: string;
    sessionId: string;
    paymentId: string;
  };
}

export async function createCartCheckoutSession(
  items: Array<{ name: string; price: number; quantity: number }>,
) {
  const res = await fetch("/api/payment/create-checkout-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ items }),
  });

  const payload = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(payload?.message || "Failed to create checkout session");
  }

  return payload as {
    success: boolean;
    url: string;
  };
}

export async function verifyPaymentSession(sessionId: string) {
  const query = new URLSearchParams({ sessionId }).toString();
  const res = await fetch(`/api/payment/verify-session?${query}`, {
    method: "GET",
    credentials: "include",
    cache: "no-cache",
  });

  const payload = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(payload?.message || "Failed to verify payment");
  }

  return payload as {
    message: string;
    medicineId: string;
  };
}
