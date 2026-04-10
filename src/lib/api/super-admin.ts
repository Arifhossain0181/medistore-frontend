import axios from "axios";

export type SuperAdminRole =
  | "CUSTOMER"
  | "SELLER"
  | "ADMIN"
  | "SUPER_ADMIN"
  | "DELIVERY_MAN";

export type SuperAdminUser = {
  id: string;
  name: string;
  email: string;
  role: SuperAdminRole;
  isBanned: boolean;
  status?: string;
  createdAt?: string;
};

export type SuperAdminOrder = {
  id: string;
  status: string;
  totalAmount?: number;
  createdAt: string;
  customer?: {
    name?: string;
    email?: string;
  };
};

export type SuperAdminMedicine = {
  id: string;
  name: string;
  manufacturer?: string;
  stock: number;
  price?: number;
  category?: {
    name?: string;
  };
  seller?: {
    name?: string;
    email?: string;
  };
};

export type SuperAdminReportSummary = {
  users: number;
  medicines: number;
  orders: number;
  deliveredOrders: number;
  deliveredRevenue: number;
};

export type SuperAdminSettings = {
  maintenanceMode: boolean;
  registrationOpen: boolean;
  message: string;
};

export async function getSuperAdminUsers() {
  const res = await axios.get("/api/super-admin/users", { withCredentials: true });
  return (res.data.data || res.data) as SuperAdminUser[];
}

export async function getSuperAdminAdmins() {
  const res = await axios.get("/api/super-admin/admins", { withCredentials: true });
  return (res.data.data || res.data) as SuperAdminUser[];
}

export async function updateSuperAdminUserRole(userId: string, role: SuperAdminRole) {
  const res = await axios.patch(
    `/api/super-admin/users/${userId}/role`,
    { role },
    { withCredentials: true },
  );
  return res.data.data || res.data;
}

export async function toggleSuperAdminUserBan(userId: string, isBanned: boolean) {
  const res = await axios.patch(
    `/api/super-admin/users/${userId}/ban`,
    { isBanned },
    { withCredentials: true },
  );
  return res.data.data || res.data;
}

export async function getSuperAdminOrders() {
  const res = await axios.get("/api/super-admin/orders", { withCredentials: true });
  return (res.data.data || res.data) as SuperAdminOrder[];
}

export async function getSuperAdminMedicines() {
  const res = await axios.get("/api/super-admin/medicines", { withCredentials: true });
  return (res.data.data || res.data) as SuperAdminMedicine[];
}

export async function getSuperAdminReports() {
  const res = await axios.get("/api/super-admin/reports/summary", { withCredentials: true });
  return (res.data.data || res.data) as SuperAdminReportSummary;
}

export async function getSuperAdminSettings() {
  const res = await axios.get("/api/super-admin/settings", { withCredentials: true });
  return (res.data.data || res.data) as SuperAdminSettings;
}

export async function updateSuperAdminSettings(payload: Partial<SuperAdminSettings>) {
  const res = await axios.patch("/api/super-admin/settings", payload, { withCredentials: true });
  return (res.data.data || res.data) as SuperAdminSettings;
}
