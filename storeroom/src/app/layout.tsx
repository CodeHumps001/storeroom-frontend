import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

// Premium, clean fonts tailored for SaaS, inventory dashboards, and POS systems
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://storeroom-in.vercel.app"),

  title: {
    default: "Storeroom — Smart Inventory & POS Management System",
    template: "%s | Storeroom",
  },

  description:
    "Storeroom is a modern inventory and POS management platform built for businesses to manage products, stock, barcode scanning, sales, receipts, staff, and analytics in real time. Track inventory efficiently, generate PDF receipts, monitor low stock items, and streamline business operations from one powerful dashboard.",

  keywords: [
    "Storeroom",
    "inventory management system",
    "POS software",
    "store management system",
    "inventory tracking software",
    "barcode inventory system",
    "stock management app",
    "sales management software",
    "retail management platform",
    "inventory dashboard",
    "barcode scanner POS",
    "cloud inventory software",
    "business management software",
    "real time inventory tracking",
    "receipt generation software",
    "small business inventory app",
    "warehouse management system",
    "retail POS system",
    "inventory software Ghana",
    "multi tenant SaaS",
  ],

  authors: [
    {
      name: "Fosu Yaw Humphrey",
      url: "https://storeroom-in.vercel.app",
    },
  ],

  creator: "Fosu Yaw Humphrey",
  publisher: "Velux Corporation",
  category: "Business Software",
  applicationName: "Storeroom",

  alternates: {
    canonical: "https://storeroom-in.vercel.app",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://storeroom-in.vercel.app",
    siteName: "Storeroom",
    title: "Storeroom — Smart Inventory & POS Management System",
    description:
      "Manage products, inventory, barcode scanning, sales, receipts, staff, and analytics with Storeroom business software.",
    images: [
      {
        url: "/logo.jpeg",
        width: 1200,
        height: 630,
        alt: "Storeroom Inventory Management Platform",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Storeroom — Smart Inventory & POS System",
    description:
      "Modern inventory and POS software for managing products, stock, barcode scanning, receipts, and business analytics.",
    images: ["/logo.jpeg"],
    creator: "@YawFosu869776",
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
    icon: [
      { url: "/logo.jpeg", sizes: "any" },
      { url: "/logo.jpeg", sizes: "32x32", type: "image/png" },
      { url: "/logo.jpeg", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/logo.jpeg",
    apple: "/logo.jpeg",
  },

  verification: {
    google: "googlebce795757b0ef5e3",
  },

  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-screen bg-zinc-50 font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
