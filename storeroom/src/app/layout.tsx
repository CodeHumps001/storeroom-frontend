import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "next-themes";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("storeroom-in.vercel.app"),

  title: {
    default: "Storeroom - Smart Inventory & POS Management System",
    template: "%s | Storeroom",
  },

  description:
    "Storeroom is a modern inventory and POS management system that helps businesses manage products, sales, barcode scanning, receipts, stock tracking, staff, and analytics in real time.",

  keywords: [
    "Inventory Management System",
    "POS System",
    "Store Management Software",
    "Inventory Tracking Software",
    "Barcode Inventory System",
    "Retail POS Software",
    "Stock Management App",
    "Sales Management System",
    "Receipt Generator",
    "Business Management Software",
    "Warehouse Management System",
    "Multi Tenant SaaS",
    "Inventory Software Ghana",
    "Retail Management Platform",
    "Product Inventory Tracking",
    "Smart Inventory Solution",
    "Cloud POS System",
    "Small Business Inventory App",
    "Real Time Inventory Tracking",
    "Barcode Scanner POS",
  ],

  authors: [
    {
      name: "Storeroom",
    },
  ],

  creator: "Storeroom",

  publisher: "Storeroom",

  category: "Business Software",

  applicationName: "Storeroom",

  alternates: {
    canonical: "https://storeroom.app",
  },

  openGraph: {
    title: "Storeroom - Smart Inventory & POS Management System",

    description:
      "Manage products, inventory, sales, barcode scanning, PDF receipts, staff, and reports with Storeroom business software.",

    url: "storeroom-in.vercel.app",

    siteName: "Storeroom",

    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Storeroom Inventory Management System",
      },
    ],

    locale: "en_US",

    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Storeroom - Inventory & POS Software",

    description:
      "Modern inventory and POS software for managing products, sales, barcode scanning, reports, and stock tracking.",

    images: ["/logo.png"],
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
