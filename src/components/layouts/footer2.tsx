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
        { text: "Smart Search", url: "/smart-search" },
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
        { text: "Delivery Dashboard", url: "/delivery" },
        { text: "Clinical Chat", url: "/chatbot" },
        { text: "Register", url: "/signup" },
      ],
    },
    {
      title: "Company",
      links: [
        { text: "About Us", url: "/about" },
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
        { text: "Prescription Reader", url: "/prescription-reader" },
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
    <section className={cn("py-12 bg-gray-900 text-gray-300", className)}>
      <div className="container mx-auto px-4">
        <footer>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
            <div className="col-span-2 mb-8 lg:mb-0">
              <div className="flex items-center gap-2 lg:justify-start">
                <Logo url="/">
                  <LogoImage
                    src={logs.src}
                    alt={logo.alt}
                    title={logo.title}
                    className="h-10 dark:invert"
                  />
                  <LogoText className="text-xl">{logo.title}</LogoText>
                </Logo>
              </div>
              <p className="mt-4 font-bold">{tagline}</p>
              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2"><MapPin className="size-4" /> 123 Health Avenue, Dhaka</p>
                <p className="flex items-center gap-2"><Phone className="size-4" /> +880 1900-000000</p>
                <p className="flex items-center gap-2"><Mail className="size-4" /> support@medistore.com</p>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="rounded-full border border-gray-600 p-2 hover:text-cyan-300"><Facebook className="size-4" /></a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="rounded-full border border-gray-600 p-2 hover:text-cyan-300"><Instagram className="size-4" /></a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="rounded-full border border-gray-600 p-2 hover:text-cyan-300"><Linkedin className="size-4" /></a>
              </div>
            </div>
            {menuItems.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-4 font-bold">{section.title}</h3>
                <ul className="space-y-4 text-muted-foreground">
                  {section.links.map((link, linkIdx) => (
                    <li
                      key={linkIdx}
                      className="font-medium hover:text-primary"
                    >
                      <Link href={link.url}>{link.text}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-24 flex flex-col justify-between gap-4 border-t pt-8 text-sm font-medium text-muted-foreground md:flex-row md:items-center">
            <p>{copyright}</p>
            <ul className="flex gap-4">
              {bottomLinks.map((link, linkIdx) => (
                <li key={linkIdx} className="underline hover:text-primary">
                  <Link href={link.url}>{link.text}</Link>
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
