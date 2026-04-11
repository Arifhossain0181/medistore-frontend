export type DeliveryMan = {
  id: string;
  name: string | null;
  email: string;
  status?: string;
};

export type DeliveryAssignment = {
  id: string;
  status: "ASSIGNED" | "IN_TRANSIT" | "DELIVERED" | "FAILED";
  assignedAt: string;
  orderId?: string;
  order?: {
    id: string;
    status?: string;
    shippingAddress?: string;
    createdAt?: string;
    totalAmount?: number;
    customer?: {
      name?: string;
      email?: string;
    };
  };
};

export type DeliveryCoverageCheck = {
  serviceable: boolean;
  mode: "OWN_DELIVERY" | "COURIER" | null;
  fee: number;
  etaDays: number | null;
  division?: string;
  district?: string;
  thana?: string;
};

type DeliveryResponse = {
  success?: boolean;
  data?: DeliveryAssignment[];
};

async function getDeliveryAssignments(path: string): Promise<DeliveryAssignment[]> {
  const res = await fetch(path, {
    credentials: "include",
    cache: "no-cache",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch delivery data");
  }

  const payload = (await res.json()) as DeliveryResponse | DeliveryAssignment[];
  if (Array.isArray(payload)) return payload;
  return Array.isArray(payload?.data) ? payload.data : [];
}

export async function getDeliveryMen(): Promise<DeliveryMan[]> {
  const res = await fetch("/api/delivery/men", {
    credentials: "include",
    cache: "no-cache",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch delivery men");
  }

  const payload = await res.json();
  const list = payload?.data ?? payload;
  return Array.isArray(list) ? list : [];
}

export async function assignOrderToDeliveryMan(orderId: string, deliveryManId: string) {
  const res = await fetch("/api/delivery/assign", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ orderId, deliveryManId }),
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    throw new Error(payload?.message || "Failed to assign delivery man");
  }

  return res.json();
}

export async function updateDeliveryOrderStatus(orderId: string, status: "SHIPPED" | "DELIVERED" | "FAILED") {
  const res = await fetch(`/api/delivery/orders/${orderId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    throw new Error(payload?.message || "Failed to update delivery status");
  }

  return res.json();
}

export function getMyDeliveryOrders() {
  return getDeliveryAssignments("/api/delivery/orders");
}

export function getMyActiveDeliveryOrders() {
  return getDeliveryAssignments("/api/delivery/active");
}

export function getMyCompletedDeliveryOrders() {
  return getDeliveryAssignments("/api/delivery/completed");
}

export async function getDeliveryProfile() {
  const res = await fetch("/api/delivery/profile", {
    credentials: "include",
    cache: "no-cache",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch delivery profile");
  }

  const payload = await res.json();
  return payload?.data ?? payload;
}

export async function checkDeliveryServiceability(division: string, district: string, thana: string) {
  const params = new URLSearchParams({ division, district, thana });
  const res = await fetch(`/api/delivery/coverage/check?${params.toString()}`, {
    credentials: "include",
    cache: "no-cache",
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    throw new Error(payload?.message || "Failed to check serviceability");
  }

  const payload = await res.json();
  return (payload?.data ?? payload) as DeliveryCoverageCheck;
}
