"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, Box, CircleDollarSign, PackageCheck, UsersRound } from "lucide-react";

import { useAuthStore } from "@/store/authstore";
import { getAllMedicines, getAlluser } from "@/lib/api/medicine";
import { fetchOrders, getMyOrders } from "@/lib/api/order";
import { getMyDeliveryOrders } from "@/lib/api/delivery";
import { getSuperAdminOrders } from "@/lib/api/super-admin";

type Role = "CUSTOMER" | "SELLER" | "ADMIN" | "SUPER_ADMIN" | "DELIVERY_MAN";

type DashboardOrder = {
  id: string;
  status?: string;
  createdAt?: string;
  totalAmount?: number;
  total?: number;
  customer?: { name?: string; email?: string };
  user?: { name?: string; email?: string };
  shippingAddress?: string;
};

type DashboardMedicine = {
  id: string;
  stock?: number;
  category?: { name?: string } | string;
};

const roleTitles: Record<Role, string> = {
  CUSTOMER: "Customer Dashboard",
  SELLER: "Seller Dashboard",
  ADMIN: "Admin Dashboard",
  SUPER_ADMIN: "Super Admin Dashboard",
  DELIVERY_MAN: "Delivery Man Dashboard",
};

function formatMoney(value: number) {
  return `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

function getMonthKey(dateLike?: string) {
  if (!dateLike) return "Unknown";
  const dt = new Date(dateLike);
  if (Number.isNaN(dt.getTime())) return "Unknown";
  return dt.toLocaleDateString("en-US", { month: "short" });
}

function normalizeOrderAmount(order: DashboardOrder) {
  return Number(order.totalAmount ?? order.total ?? 0);
}

export default function RoleDashboard() {
  const user = useAuthStore((s) => s.user);
  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [medicines, setMedicines] = useState<DashboardMedicine[]>([]);
  const [usersCount, setUsersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [chartMode, setChartMode] = useState<"bar" | "line">("bar");

  useEffect(() => {
    const loadDashboard = async () => {
      if (!user) return;

      setLoading(true);

      try {
        const role = user.role as Role;
        const tasks: Promise<unknown>[] = [];

        if (role === "CUSTOMER") {
          tasks.push(
            getMyOrders()
              .then((data) => setOrders(Array.isArray(data) ? (data as DashboardOrder[]) : []))
              .catch(() => setOrders([])),
          );
        } else if (role === "SELLER") {
          tasks.push(
            fetchOrders
              .getSellerOrders()
              .then((res) => {
                const payload = (res?.data as { data?: DashboardOrder[] } | DashboardOrder[] | undefined) || [];
                const list = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];
                setOrders(list);
              })
              .catch(() => setOrders([])),
          );
        } else if (role === "DELIVERY_MAN") {
          tasks.push(
            getMyDeliveryOrders()
              .then((deliveryOrders) => {
                const normalized: DashboardOrder[] = deliveryOrders.map((entry) => ({
                  id: entry.order?.id || entry.id,
                  status: entry.status,
                  createdAt: entry.order?.createdAt || entry.assignedAt,
                  totalAmount: Number(entry.order?.totalAmount || 0),
                  customer: {
                    name: entry.order?.customer?.name,
                    email: entry.order?.customer?.email,
                  },
                  shippingAddress: entry.order?.shippingAddress,
                }));
                setOrders(normalized);
              })
              .catch(() => setOrders([])),
          );
        } else if (role === "ADMIN") {
          tasks.push(
            fetchOrders
              .getOrders()
              .then((res) => {
                const payload = (res?.data as { data?: DashboardOrder[] } | DashboardOrder[] | undefined) || [];
                const list = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];
                setOrders(list);
              })
              .catch(() => setOrders([])),
          );
          tasks.push(getAlluser().then((list) => setUsersCount(Array.isArray(list) ? list.length : 0)).catch(() => setUsersCount(0)));
        } else {
          tasks.push(getSuperAdminOrders().then((list) => setOrders(Array.isArray(list) ? (list as DashboardOrder[]) : [])).catch(() => setOrders([])));
          tasks.push(getAlluser().then((list) => setUsersCount(Array.isArray(list) ? list.length : 0)).catch(() => setUsersCount(0)));
        }

        tasks.push(getAllMedicines().then((list) => setMedicines(Array.isArray(list) ? (list as DashboardMedicine[]) : [])).catch(() => setMedicines([])));

        await Promise.all(tasks);
      } finally {
        setLoading(false);
      }
    };

    void loadDashboard();
  }, [user]);

  const totalRevenue = useMemo(() => orders.reduce((sum, order) => sum + normalizeOrderAmount(order), 0), [orders]);
  const deliveredCount = useMemo(
    () => orders.filter((order) => ["DELIVERED", "SHIPPED", "IN_TRANSIT"].includes(String(order.status || "").toUpperCase())).length,
    [orders],
  );
  const activeCount = useMemo(
    () => orders.filter((order) => !["DELIVERED", "CANCELLED", "FAILED"].includes(String(order.status || "").toUpperCase())).length,
    [orders],
  );
  const inStockCount = useMemo(() => medicines.filter((item) => Number(item.stock || 0) > 0).length, [medicines]);

  const monthlyChart = useMemo(() => {
    const now = new Date();
    const monthWindow: { key: string; month: string }[] = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthWindow.push({
        key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
        month: date.toLocaleDateString("en-US", { month: "short" }),
      });
    }

    const monthCount = new Map<string, number>(monthWindow.map((entry) => [entry.key, 0]));

    orders.forEach((order) => {
      if (!order.createdAt) return;
      const date = new Date(order.createdAt);
      if (Number.isNaN(date.getTime())) return;
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (!monthCount.has(key)) return;
      monthCount.set(key, (monthCount.get(key) || 0) + 1);
    });

    return monthWindow.map((entry) => ({
      month: entry.month,
      count: monthCount.get(entry.key) || 0,
    }));
  }, [orders]);

  const maxBar = useMemo(() => Math.max(...monthlyChart.map((item) => item.count), 1), [monthlyChart]);
  const linePoints = useMemo(() => {
    const total = monthlyChart.length;
    if (!total) return [] as Array<{ x: number; y: number; month: string; count: number }>;

    return monthlyChart.map((item, idx) => {
      const x = total === 1 ? 50 : (idx / (total - 1)) * 100;
      const y = 100 - (item.count / maxBar) * 100;
      return { x, y, month: item.month, count: item.count };
    });
  }, [monthlyChart, maxBar]);

  const linePath = useMemo(() => {
    if (!linePoints.length) return "";
    return linePoints
      .map((point, idx) => `${idx === 0 ? "M" : "L"} ${point.x} ${point.y}`)
      .join(" ");
  }, [linePoints]);

  const chartBarColors = ["#0ea5e9", "#06b6d4", "#14b8a6", "#10b981", "#22c55e", "#84cc16"];

  const categorySplit = useMemo(() => {
    const map = new Map<string, number>();
    medicines.forEach((item) => {
      const category = typeof item.category === "string" ? item.category : item.category?.name;
      const key = category || "Other";
      map.set(key, (map.get(key) || 0) + 1);
    });
    const result = Array.from(map.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 4);

    const total = result.reduce((sum, item) => sum + item.value, 0) || 1;
    return {
      items: result,
      total,
    };
  }, [medicines]);

  const donutBackground = useMemo(() => {
    if (!categorySplit.items.length) {
      return "conic-gradient(#10b981 0deg 360deg)";
    }

    const colors = ["#0d9488", "#0891b2", "#84cc16", "#f59e0b"];
    let start = 0;
    const stops = categorySplit.items.map((item, idx) => {
      const portion = (item.value / categorySplit.total) * 360;
      const end = start + portion;
      const color = colors[idx % colors.length];
      const stop = `${color} ${start}deg ${end}deg`;
      start = end;
      return stop;
    });

    return `conic-gradient(${stops.join(",")})`;
  }, [categorySplit]);

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 6);
  }, [orders]);

  if (!user) return null;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_26px_55px_-36px_rgba(15,23,42,0.6)] dark:border-slate-800 dark:bg-slate-900 md:p-8">
        <p className="text-xs font-semibold tracking-[0.18em] text-emerald-600 uppercase dark:text-emerald-300">Dashboard System</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100 md:text-3xl">{roleTitles[user.role as Role] || "Role Dashboard"}</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Live analytics from backend orders, medicines and user records based on your active role.</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-[0_24px_45px_-32px_rgba(5,150,105,0.5)] dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-300">Total Revenue</span>
            <CircleDollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-slate-100">{formatMoney(totalRevenue)}</p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300 hover:shadow-[0_24px_45px_-32px_rgba(8,145,178,0.55)] dark:border-slate-800 dark:bg-slate-900 dark:hover:border-cyan-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-300">Total Orders</span>
            <PackageCheck className="h-5 w-5 text-cyan-600 dark:text-cyan-300" />
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-slate-100">{orders.length}</p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-[0_24px_45px_-32px_rgba(217,119,6,0.5)] dark:border-slate-800 dark:bg-slate-900 dark:hover:border-amber-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-300">Active Pipeline</span>
            <Activity className="h-5 w-5 text-amber-600 dark:text-amber-300" />
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-slate-100">{activeCount}</p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-[0_24px_45px_-32px_rgba(124,58,237,0.45)] dark:border-slate-800 dark:bg-slate-900 dark:hover:border-violet-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-300">In-Stock / Users</span>
            <UsersRound className="h-5 w-5 text-violet-600 dark:text-violet-300" />
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-slate-100">{inStockCount} / {usersCount || "-"}</p>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <article className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_45px_-32px_rgba(14,116,144,0.45)] dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Monthly Order Trend</h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Bar / Line chart from backend order creation dates</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setChartMode("bar")}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  chartMode === "bar"
                    ? "bg-cyan-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                Bar
              </button>
              <button
                type="button"
                onClick={() => setChartMode("line")}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  chartMode === "line"
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                Line
              </button>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
            <div className="relative h-56">
              <div className="pointer-events-none absolute inset-0 grid grid-rows-4">
                {[0, 1, 2, 3].map((line) => (
                  <div key={line} className="border-t border-dashed border-slate-200 dark:border-slate-700" />
                ))}
              </div>

              {chartMode === "bar" ? (
                <div className="absolute inset-0 grid grid-cols-6 items-end gap-3">
                  {monthlyChart.map((item, idx) => (
                    <div key={`${item.month}-${idx}`} className="flex h-full flex-col items-center justify-end gap-2">
                      <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300">{item.count}</span>
                      <div
                        className="w-full rounded-t-md"
                        style={{
                          height: `${Math.max((item.count / maxBar) * 100, 8)}%`,
                          backgroundColor: chartBarColors[idx % chartBarColors.length],
                        }}
                        title={`${item.month}: ${item.count}`}
                      />
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{item.month}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="absolute inset-0">
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
                    <path d={linePath} fill="none" stroke="#10b981" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                    {linePoints.map((point) => (
                      <circle key={point.month} cx={point.x} cy={point.y} r="2.3" fill="#0ea5e9" />
                    ))}
                  </svg>
                  <div className="mt-2 grid grid-cols-6 gap-3 text-center">
                    {monthlyChart.map((item, idx) => (
                      <div key={`${item.month}-${idx}`} className="text-xs font-medium text-slate-600 dark:text-slate-300">
                        {item.month}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_45px_-32px_rgba(5,150,105,0.45)] dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Category Distribution</h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Donut chart from live medicines categories</p>

          <div className="mt-5 flex justify-center">
            <div className="relative grid h-44 w-44 place-items-center rounded-full" style={{ background: donutBackground }}>
              <div className="grid h-28 w-28 place-items-center rounded-full bg-white text-center dark:bg-slate-900">
                <span className="text-lg font-bold text-slate-900 dark:text-slate-100">{categorySplit.total}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">TOTAL</span>
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            {categorySplit.items.map((item) => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <span className="text-slate-700 dark:text-slate-200">{item.label}</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{item.value}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_45px_-32px_rgba(15,23,42,0.5)] dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Dynamic Orders Table</h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">{loading ? "Loading..." : `Showing ${recentOrders.length} records`}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <th className="px-3 py-3">Order ID</th>
                <th className="px-3 py-3">Customer</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Amount</th>
                <th className="px-3 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-slate-100 transition-colors last:border-b-0 hover:bg-slate-50 dark:border-slate-800/60 dark:hover:bg-slate-800/35">
                  <td className="px-3 py-3 font-medium text-slate-900 dark:text-slate-100">#{order.id.slice(0, 8)}</td>
                  <td className="px-3 py-3 text-slate-700 dark:text-slate-300">{order.customer?.name || order.user?.name || "N/A"}</td>
                  <td className="px-3 py-3">
                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                      {(order.status || "PENDING").toUpperCase()}
                    </span>
                  </td>
                  <td className="px-3 py-3 font-semibold text-slate-900 dark:text-slate-100">{formatMoney(normalizeOrderAmount(order))}</td>
                  <td className="px-3 py-3 text-slate-600 dark:text-slate-300">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "-"}</td>
                </tr>
              ))}
              {!loading && !recentOrders.length && (
                <tr>
                  <td colSpan={5} className="px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                    No order data available for this role yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_35px_-30px_rgba(5,150,105,0.55)] dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          <Box className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
          Delivered/Completed records: <span className="font-semibold text-slate-900 dark:text-slate-100">{deliveredCount}</span>
        </div>
      </section>
    </div>
  );
}
