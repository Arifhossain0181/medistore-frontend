"use client";

import {
  ShoppingBag,
  ShoppingCart,
  Package,
  User,
  Settings,
  FileText,
  Users,
  LayoutDashboard,
  PlusCircle,
  Truck,
  Shield,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/authstore";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Menu items based on user role
const customerMenuItems = [
  { title: "Home", url: "/", icon: LayoutDashboard },
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Shop", url: "/shop", icon: ShoppingBag },
  { title: "Checkout", url: "/dashboard/checkout", icon: ShoppingCart },
  { title: "My Orders", url: "/customer/orders", icon: Package },
  { title: "My Profile", url: "/dashboard/profile", icon: User },
];

const sellerMenuItems = [
  { title: "Home", url: "/", icon: LayoutDashboard },
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Manage Medicines", url: "/seller/medicines", icon: Package },
  { title: "Add Medicine", url: "/seller/add", icon: PlusCircle },
  { title: "Orders", url: "/seller/orders", icon: FileText },
  { title: "My Profile", url: "/dashboard/profile", icon: User },
];

const adminMenuItems = [
  { title: "Home", url: "/", icon: LayoutDashboard },
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Medicines", url: "/admin/medicines", icon: Package },
  { title: "Orders", url: "/admin/orders", icon: FileText },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Delivery Applications", url: "/admin/delivery-applications", icon: Truck },
  { title: "Categories", url: "/admin/categories", icon: Settings },
  { title: "My Profile", url: "/dashboard/profile", icon: User },
];

const superAdminMenuItems = [
  { title: "Home", url: "/", icon: LayoutDashboard },
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "All Medicines", url: "/super-admin/medicines", icon: Package },
  { title: "All Orders", url: "/super-admin/orders", icon: FileText },
  { title: "All Users", url: "/super-admin/users", icon: Users },
  { title: "Admins", url: "/super-admin/admins", icon: Shield },
  { title: "Reports", url: "/super-admin/reports", icon: FileText },
  { title: "Settings", url: "/super-admin/settings", icon: Settings },
  { title: "My Profile", url: "/dashboard/profile", icon: User },
];

const deliveryManMenuItems = [
  { title: "Home", url: "/", icon: LayoutDashboard },
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Deliveries", url: "/delivery/orders", icon: Truck },
  { title: "Active Orders", url: "/delivery/active", icon: Package },
  { title: "Completed", url: "/delivery/completed", icon: FileText },
  { title: "My Profile", url: "/dashboard/profile", icon: User },
];

export function AppSidebar() {
  const user = useAuthStore((s) => s.user);
  const pathname = usePathname();

  // Determine which menu items to show based on role
  let menuItems = customerMenuItems;
  let dashboardTitle = "Customer Dashboard";

  if (user?.role === "SELLER") {
    menuItems = sellerMenuItems;
    dashboardTitle = "Seller Dashboard";
  } else if (user?.role === "ADMIN") {
    menuItems = adminMenuItems;
    dashboardTitle = "Admin Dashboard";
  } else if (user?.role === "SUPER_ADMIN") {
    menuItems = superAdminMenuItems;
    dashboardTitle = "Super Admin Dashboard";
  } else if (user?.role === "DELIVERY_MAN") {
    menuItems = deliveryManMenuItems;
    dashboardTitle = "Delivery Man Dashboard";
  }

  const isActive = (url: string) => {
    if (url === "/") return pathname === "/";
    return Boolean(pathname?.startsWith(url));
  };

  return (
    <Sidebar className="shadow-[6px_0_28px_-22px_rgba(15,23,42,0.5)] dark:shadow-[6px_0_28px_-22px_rgba(2,132,199,0.25)]">
      <SidebarHeader className="border-b border-slate-200/70 dark:border-slate-800/80">
        <div className="flex items-center gap-2 px-4 py-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md shadow-emerald-500/20">
            <ShoppingBag className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-lg">MediStore</span>
            {user && (
              <span className="text-xs text-muted-foreground capitalize">
                {dashboardTitle}
              </span>
            )}
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const active = isActive(item.url);

                return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={active}
                    className="h-10 rounded-xl border border-transparent transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-200/80 hover:shadow-[0_16px_30px_-22px_rgba(8,145,178,0.7)] data-[active=true]:border-emerald-300/80 data-[active=true]:bg-emerald-100/75 data-[active=true]:text-emerald-800 data-[active=true]:shadow-[0_18px_32px_-24px_rgba(5,150,105,0.7)] dark:hover:border-cyan-900/60 dark:hover:shadow-[0_16px_30px_-22px_rgba(14,116,144,0.5)] dark:data-[active=true]:border-emerald-800/80 dark:data-[active=true]:bg-emerald-900/35 dark:data-[active=true]:text-emerald-200"
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )})}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-200/70 dark:border-slate-800/80">
        {user && (
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-muted shadow-sm">
                <User className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>
            <div className="px-2 py-1 rounded-md border border-slate-200/60 bg-muted text-xs text-center dark:border-slate-700/70">
              <span className="font-medium">{user.role}</span>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
