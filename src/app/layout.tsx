import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConditionalNavbar } from "@/components/layouts/ConditionalNavbar";
import { ThemeProvider } from "@/Providers/theme.Provider";
import { ConditionalFooter } from "@/components/layouts/ConditionalFooter";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MediStore - Your Trusted Online Medicine Shop",
  description: "Order medicines online with ease. Fast delivery, genuine products, and best prices guaranteed."
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
         <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
             <ConditionalNavbar />
        {children}
        <ConditionalFooter />
        <Toaster richColors />
          </ThemeProvider>
       
      </body>
    </html>
  );
}
