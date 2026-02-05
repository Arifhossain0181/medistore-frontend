"use client"

import {
  Home,
  ShoppingBag,
  ShoppingCart,
  Package,
  User,
  Settings,
  FileText,
  Users,
  LayoutDashboard,
  PlusCircle,
} from "lucide-react"

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
} from "@/components/ui/sidebar"
import { useAuthStore } from "@/store/authstore"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Menu items based on user role
const customerMenuItems = [
  { title: "Dashboard", url: "/customer/dashboard", icon: LayoutDashboard },
  { title: "Shop", url: "/shop", icon: ShoppingBag },
  { title: "Cart", url: "/dashboard/cart", icon: ShoppingCart },
  { title: "Checkout", url: "/customer/checkout", icon: ShoppingCart },
  { title: "My Orders", url: "/customer/orders", icon: Package },
  { title: "Profile", url: "/customer/profile", icon: User },
]

const sellerMenuItems = [
  { title: "Dashboard", url: "/seller/dashboard", icon: LayoutDashboard },
  { title: "My Products", url: "/seller/products", icon: Package },
  { title: "Add Product", url: "/seller/products/add", icon: PlusCircle },
  { title: "Orders", url: "/seller/orders", icon: FileText },
  { title: "Profile", url: "/seller/profile", icon: User },
]

const adminMenuItems = [
  { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Medicines", url: "/admin/medicines", icon: Package },
  { title: "Orders", url: "/admin/orders", icon: FileText },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Categories", url: "/admin/categories", icon: Settings },
]

export function AppSidebar() {
  const user = useAuthStore((s) => s.user)
  const router = useRouter()

  // Determine which menu items to show based on role
  let menuItems = customerMenuItems
  let dashboardTitle = "Customer Dashboard"
  
  if (user?.role === "SELLER") {
    menuItems = sellerMenuItems
    dashboardTitle = "Seller Dashboard"
  } else if (user?.role === "ADMIN") {
    menuItems = adminMenuItems
    dashboardTitle = "Admin Dashboard"
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-4 py-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
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
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        {user && (
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                <User className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
            <div className="px-2 py-1 rounded-md bg-muted text-xs text-center">
              <span className="font-medium">{user.role}</span>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
