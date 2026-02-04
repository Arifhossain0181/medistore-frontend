import { cn } from "@/lib/utils";

import { Logo, LogoImage, LogoText } from "@/components/logo";

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
        { text: "Pain Relief", url: "/shop?category=pain-relief" },
        { text: "Cold & Flu", url: "/shop?category=cold-flu" },
        { text: "Vitamins", url: "/shop?category=vitamins" },
        { text: "First Aid", url: "/shop?category=first-aid" },
      ],
    },
    {
      title: "Customer Service",
      links: [
        { text: "My Account", url: "/profile" },
        { text: "My Orders", url: "/orders" },
        { text: "Track Order", url: "/orders" },
        { text: "Shopping Cart", url: "/cart" },
        { text: "Help & FAQs", url: "/help" },
      ],
    },
    {
      title: "Company",
      links: [
        { text: "About Us", url: "/about" },
        { text: "Contact", url: "/contact" },
        { text: "Become a Seller", url: "/register?role=seller" },
      ],
    },
    {
      title: "Legal",
      links: [
        { text: "Privacy Policy", url: "/privacy" },
        { text: "Terms of Service", url: "/terms" },
        { text: "Return Policy", url: "/returns" },
      ],
    },
  ],
  copyright = `© ${new Date().getFullYear()} MediStore. All rights reserved.`,
  bottomLinks = [
    { text: "Terms and Conditions", url: "/terms" },
    { text: "Privacy Policy", url: "/privacy" },
  ],
}: Footer2Props) => {
  return (
    <section className={cn("py-12 bg-gray-900 text-gray-300", className)}>
      <div className="container mx-auto px-4">
        <footer>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
            <div className="col-span-2 mb-8 lg:mb-0">
              <div className="flex items-center gap-2 lg:justify-start">
                <Logo url="https://shadcnblocks.com">
                  <LogoImage
                    src={logo.src}
                    alt={logo.alt}
                    title={logo.title}
                    className="h-10 dark:invert"
                  />
                  <LogoText className="text-xl">{logo.title}</LogoText>
                </Logo>
              </div>
              <p className="mt-4 font-bold">{tagline}</p>
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
                      <a href={link.url}>{link.text}</a>
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
                  <a href={link.url}>{link.text}</a>
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
