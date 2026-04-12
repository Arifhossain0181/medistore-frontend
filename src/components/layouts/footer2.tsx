import { cn } from "@/lib/utils";
import logs from "../../../public/Gemini_Generated_Image_pp41bmpp41bmpp41.png";
import { Logo, LogoImage, LogoText } from "@/components/logo";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, MapPin, Phone, Mail } from "lucide-react";

interface MenuItem {
  title: string;
  links: {
    text: string;
    url: string;
  }[];
}

interface Footer2Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  className?: string;
  tagline?: string;
  menuItems?: MenuItem[];
  copyright?: string;
  bottomLinks?: {
    text: string;
    url: string;
  }[];
}

const Footer2 = ({
  logo = {
    src: "/logo.svg",
    alt: "MediStore Logo",
    title: "MediStore",
    url: "/",
  },
  className,
  tagline = "Your Trusted Online Medicine Shop",
  menuItems = [
    {
      title: "Shop",
      links: [
        { text: "All Medicines", url: "/shop" },
        { text: "Featured Products", url: "/#featured-products" },
        { text: "Cart", url: "/cart" },
        { text: "Checkout", url: "/checkout" },
        { text: "Payment", url: "/Payment" },
      ],
    },
    {
      title: "Customer Service",
      links: [
        { text: "Dashboard", url: "/dashboard" },
        { text: "My Orders", url: "/customer/orders" },
        { text: "Delivery Dashboard", url: "/delivery/dashboard" },
        { text: "Clinical Chat", url: "/chatbot" },
        { text: "Register", url: "/signup" },
      ],
    },
    {
      title: "Company",
      links: [
        { text: "About Us", url: "/about" },
        { text: "Services", url: "/services" },
        { text: "Home", url: "/" },
        { text: "Shop", url: "/shop" },
        { text: "Become a Seller", url: "/signup?role=seller" },
      ],
    },
    {
      title: "Legal",
      links: [
        { text: "Login", url: "/login" },
        { text: "Sign Up", url: "/signup" },
        { text: "Terms of Service", url: "/about" },
      ],
    },
  ],
  copyright = `© ${new Date().getFullYear()} MediStore. All rights reserved.`,
  bottomLinks = [
    { text: "Shop", url: "/shop" },
    { text: "About", url: "/about" },
  ],
}: Footer2Props) => {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-t border-slate-200 bg-slate-100 py-14 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-28 left-0 h-72 w-72 rounded-full bg-emerald-300/25 blur-3xl dark:bg-emerald-800/20" />
        <div className="absolute -bottom-20 right-0 h-80 w-80 rounded-full bg-cyan-300/25 blur-3xl dark:bg-cyan-800/20" />
      </div>

      <div className="container mx-auto px-4">
        <footer>
          <div className="relative z-10 grid grid-cols-1 gap-10 border-b border-slate-300/70 pb-10 sm:grid-cols-2 lg:grid-cols-6 dark:border-slate-800">
            <div className="col-span-1 rounded-2xl border border-slate-300/70 bg-white/80 p-6 shadow-[0_20px_45px_-30px_rgba(15,23,42,0.5)] backdrop-blur sm:col-span-2 dark:border-slate-700 dark:bg-slate-900/75">
              <div className="flex items-center gap-2 lg:justify-start">
                <Logo url="/">
                  <LogoImage
                    src={logs.src}
                    alt={logo.alt}
                    title={logo.title}
                    className="h-10"
                  />
                  <LogoText className="text-xl text-slate-900 dark:text-slate-100">{logo.title}</LogoText>
                </Logo>
              </div>
              <p className="mt-4 text-base font-semibold text-slate-800 dark:text-slate-100">{tagline}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Reliable healthcare commerce with verified medicines, transparent pricing, and delivery-focused service.
              </p>
              <div className="mt-5 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <p className="flex items-center gap-2"><MapPin className="size-4 text-emerald-600 dark:text-emerald-300" /> 123 Health Avenue, Dhaka</p>
                <p className="flex items-center gap-2"><Phone className="size-4 text-emerald-600 dark:text-emerald-300" /> +880 1900-000000</p>
                <p className="flex items-center gap-2"><Mail className="size-4 text-emerald-600 dark:text-emerald-300" /> support@medistore.com</p>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="rounded-full border border-slate-300 bg-white p-2.5 text-slate-700 transition hover:border-cyan-300 hover:text-cyan-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-cyan-700 dark:hover:text-cyan-300"><Facebook className="size-4" /></a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="rounded-full border border-slate-300 bg-white p-2.5 text-slate-700 transition hover:border-cyan-300 hover:text-cyan-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-cyan-700 dark:hover:text-cyan-300"><Instagram className="size-4" /></a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="rounded-full border border-slate-300 bg-white p-2.5 text-slate-700 transition hover:border-cyan-300 hover:text-cyan-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-cyan-700 dark:hover:text-cyan-300"><Linkedin className="size-4" /></a>
              </div>
            </div>
            {menuItems.map((section, sectionIdx) => (
              <div key={`${section.title}-${sectionIdx}`}>
                <h3 className="mb-4 text-sm font-bold tracking-[0.08em] text-slate-800 uppercase dark:text-slate-100">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIdx) => (
                    <li
                      key={`${link.text}-${link.url}-${linkIdx}`}
                      className="font-medium"
                    >
                      <Link href={link.url} className="text-sm text-slate-600 transition hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-300">{link.text}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="relative z-10 mt-6 flex flex-col justify-between gap-4 text-sm font-medium text-slate-600 md:flex-row md:items-center dark:text-slate-300">
            <p>{copyright}</p>
            <ul className="flex flex-wrap items-center gap-4">
              {bottomLinks.map((link, linkIdx) => (
                <li key={`${link.text}-${link.url}-${linkIdx}`}>
                  <Link href={link.url} className="rounded-full border border-slate-300/80 px-3 py-1.5 text-xs text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-700 dark:text-slate-200 dark:hover:border-emerald-700 dark:hover:text-emerald-300">
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </footer>
      </div>
    </section>
  );
};

export { Footer2 };
