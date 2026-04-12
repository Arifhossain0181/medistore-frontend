"use client";

import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, LogOut, ChevronDown, UserRound, SunMoon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/store/authstore";
import { toast } from "sonner";
import axios from "axios";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";


interface MenuItem {
  title: string;
  url: string;
  children?: { title: string; url: string }[];
}

interface Navbar1Props {
  className?: string;
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
    className?: string;
  };
  menu?: MenuItem[];
  auth?: {
    login: {
      title: string;
      url: string;
    };
    signup: {
      title: string;
      url: string;
    };
  };
}

const Navbar = ({
  logo = {
    url: "/",
    src: "/Gemini_Generated_Image_pp41bmpp41bmpp41.png",
    alt: "logo",
    title: "MediStore",
  },
  menu = [
    { title: "Home", url: "/" },
    { title: "Shop", url: "/shop" },
    { title: "About", url: "/about" },
    { title: "Cart", url: "/cart" },
    { title: "Chat", url: "/chatbot" },
    {
      title: "Services",
      url: "/services",
      children: [
        { title: "Fast Delivery", url: "/services?focus=delivery#fast-delivery" },
        { title: "Trusted Network", url: "/services?focus=trusted#trusted-network" },
        { title: "Clinical Chatbot", url: "/chatbot" },
        { title: "Checkout Support", url: "/checkout" },
      ],
    },
  ],
  auth = {
    login: { title: "Login", url: "/login" },
    signup: { title: "Sign up", url: "/signup" },
  },
  className,
}: Navbar1Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);
  
  // Show extra tools for any logged-in role (customer, delivery, admin, super-admin)
  const menuItems = user
    ? [
        ...menu,
        { title: "Dashboard", url: "/dashboard" },
      ]
    : menu;
  
  const loginUrl = pathname && pathname !== "/login" && pathname !== "/signup" 
    ? `${auth.login.url}?redirect=${encodeURIComponent(pathname)}` 
    : auth.login.url;

  const isActive = (url: string) => {
    if (url === "/") {
      return pathname === "/";
    }
    return Boolean(pathname?.startsWith(url));
  };
  
  const handleLogout = async () => {
    try {
      await axios.post(
        `/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      // Clear auth cache completely
      localStorage.removeItem('medistore-auth');
      logout();
      // Don't clear cart on logout - keep items visible
      toast.success("Logged out successfully");
      router.push("/");
    } catch (err: unknown) {
      console.error("Logout error:", err);
      // Clear auth cache and user anyway even if API call fails
      localStorage.removeItem('medistore-auth');
      logout();
      toast.success("Logged out successfully");
      router.push("/");
    }
  };

  const openChatWidget = () => {
    window.dispatchEvent(new Event("medistore:open-chat"));
    setMobileOpen(false);
  };

  const handleNavigation = (e: MouseEvent<HTMLAnchorElement>, url: string) => {
    if (url === "/chatbot") {
      e.preventDefault();
      openChatWidget();
      return;
    }

    setMobileOpen(false);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
    
  return (
    <motion.header
      initial={{ y: -90, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed top-0 right-0 left-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-white/78 py-2.5 shadow-[0_12px_40px_-24px_rgba(12,74,110,0.5)] backdrop-blur-xl dark:bg-slate-950/72"
          : "bg-transparent py-4",
        className,
      )}
    >
      <div className="container mx-auto px-4">
        <div className="relative flex items-center justify-between rounded-2xl border border-sky-400/15 bg-white/70 px-4 py-2.5 backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-900/55">
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-r from-sky-400/7 via-emerald-300/6 to-cyan-400/7 dark:from-sky-500/7 dark:via-emerald-500/5 dark:to-cyan-500/6" />

          <Link href={logo.url} className="relative z-10 flex items-center gap-2.5">
            <Image
              src={logo.src}
              alt={logo.alt}
              width={34}
              height={34}
              className="max-h-8 w-auto"
            />
            <span className="text-lg tracking-tight font-bold text-slate-900 dark:text-white">
              {logo.title}
            </span>
          </Link>

          <div className="relative z-10 hidden items-center gap-1 lg:flex">
            {menuItems.map((item) => {
              const active = isActive(item.url);
              if (item.children?.length) {
                return (
                  <DropdownMenu key={item.title}>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className={cn(
                          "relative inline-flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-300",
                          active
                            ? "text-sky-700 dark:text-sky-300"
                            : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white",
                        )}
                      >
                        {item.title}
                        <ChevronDown className="size-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 border-slate-200 bg-white/95 dark:border-slate-700 dark:bg-slate-900/95">
                      {item.children.map((child, idx) => (
                          <DropdownMenuItem key={`${child.url}-${child.title}-${idx}`} asChild>
                          <Link href={child.url} onClick={(e) => handleNavigation(e, child.url)}>{child.title}</Link>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/services">See all services</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }

              return (
                <Link
                  key={item.title}
                  href={item.url}
                  onClick={(e) => handleNavigation(e, item.url)}
                  className={cn(
                    "relative rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-300",
                    active
                      ? "text-sky-700 dark:text-sky-300"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-lg bg-linear-to-r from-sky-200/65 via-emerald-100/70 to-cyan-200/60 dark:from-sky-900/50 dark:via-emerald-900/45 dark:to-cyan-900/45"
                      transition={{ type: "spring", stiffness: 320, damping: 28 }}
                    />
                  )}
                  <span className="relative z-10">{item.title}</span>
                </Link>
              );
            })}
          </div>

          <div className="relative z-10 flex items-center gap-2">
            <div className="hidden items-center gap-2 md:flex">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="border-slate-300/80 bg-white/65 hover:bg-white dark:border-slate-700 dark:bg-slate-900/70">
                    <UserRound className="mr-2 size-4" />
                    {user ? "Profile" : "Account"}
                    <ChevronDown className="ml-2 size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 border-slate-200 bg-white/95 dark:border-slate-700 dark:bg-slate-900/95">
                  {user ? (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard">Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 size-4" />
                        Logout
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href={loginUrl}>{auth.login.title}</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={auth.signup.url}>{auth.signup.title}</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={toggleTheme}>
                    <SunMoon className="mr-2 size-4" />
                    {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <motion.button
              type="button"
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.04 }}
              onClick={() => setMobileOpen((prev) => !prev)}
              className="rounded-md border border-slate-300/80 bg-white/75 p-2 text-slate-700 lg:hidden dark:border-slate-700 dark:bg-slate-900/75 dark:text-slate-200"
            >
              {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-[2px] lg:hidden"
              onClick={() => setMobileOpen(false)}
            >
              <motion.aside
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="absolute top-0 right-0 h-full w-[86vw] max-w-[360px] overflow-y-auto border-l border-sky-300/25 bg-white/95 px-4 py-5 shadow-2xl dark:border-slate-700/70 dark:bg-slate-900/95"
              >
                <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-700">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Menu</span>
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md border border-slate-300/80 bg-white/75 p-1.5 text-slate-700 dark:border-slate-700 dark:bg-slate-900/75 dark:text-slate-200"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                <div className="flex flex-col gap-1.5">
                  {menuItems.map((item) => {
                    const active = isActive(item.url);
                    return (
                      <div key={item.title}>
                        <Link
                          href={item.url}
                          onClick={(e) => handleNavigation(e, item.url)}
                          className={cn(
                            "rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors",
                            active
                              ? "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300"
                              : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
                          )}
                        >
                          {item.title}
                        </Link>
                        {item.children?.length ? (
                          <div className="ml-3 mt-1 flex flex-col">
                            {item.children.map((child, idx) => (
                              <Link
                                key={`${child.url}-${child.title}-${idx}`}
                                href={child.url}
                                onClick={(e) => handleNavigation(e, child.url)}
                                className="rounded-lg px-3 py-2 text-xs text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                              >
                                {child.title}
                              </Link>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 flex flex-col gap-2 border-t border-slate-200 pt-4 dark:border-slate-700">
                  {user ? (
                    <>
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-200">Welcome, {user.name}</div>
                      <Button asChild variant="outline" className="border-slate-300 dark:border-slate-700">
                        <Link href="/dashboard">Profile</Link>
                      </Button>
                      <Button onClick={handleLogout} variant="outline" className="border-slate-300 dark:border-slate-700">
                        <LogOut className="mr-2 size-4" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button asChild variant="outline" className="border-slate-300 dark:border-slate-700">
                        <Link href={loginUrl}>{auth.login.title}</Link>
                      </Button>
                      <Button asChild className="bg-emerald-600 text-white hover:bg-emerald-700">
                        <Link href={auth.signup.url}>{auth.signup.title}</Link>
                      </Button>
                    </>
                  )}
                  <Button onClick={toggleTheme} variant="outline" className="border-slate-300 dark:border-slate-700">
                    <SunMoon className="mr-2 size-4" />
                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                  </Button>
                </div>
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export { Navbar };
