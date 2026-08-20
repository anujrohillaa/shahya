import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { ToastProvider } from "@/components/ToastProvider";
import LayoutWrapper from "@/components/LayoutWrapper";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://shahya.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Shahya — Find Rooms, Flats & Flatmates for Free | Zero Brokerage",
    template: "%s | Shahya",
  },
  description: "Browse verified rooms, shared flats, and compatible flatmates in Manesar, Gurgaon, Delhi NCR, Bangalore, Noida, Pune, and Mumbai with zero brokerage and direct chat.",
  keywords: [
    "Shahya",
    "flatmates in Manesar",
    "rooms for rent in IMT Manesar",
    "flatmates in Gurgaon",
    "rooms in Sector 56 Gurgaon",
    "flat share Delhi NCR",
    "no brokerage flatmate finder",
    "shared accommodation Gurgaon",
    "roommate finder India",
    "zero brokerage flat share",
  ],
  authors: [{ name: "Shahya Network" }],
  creator: "Shahya",
  publisher: "Shahya",
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: baseUrl,
    siteName: "Shahya",
    title: "Shahya — Find Rooms, Flats & Flatmates for Free | Zero Brokerage",
    description: "Connect directly with verified roommates and room hosts in Manesar, Gurgaon, Delhi, and top Indian metros. 100% free with zero unlock charges.",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Shahya — Free Flatmate Discovery Network",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shahya — Find Rooms, Flats & Flatmates for Free | Zero Brokerage",
    description: "Browse verified rooms, shared flats, and flatmates in Manesar, Gurgaon, Delhi NCR, and Bangalore with zero commission.",
    images: ["/icon.png"],
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
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
};

import NextTopLoader from "nextjs-toploader";
import JsonLd, { getOrganizationSchema, getWebSiteSchema } from "@/components/JsonLd";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <JsonLd data={getOrganizationSchema(baseUrl)} />
        <JsonLd data={getWebSiteSchema(baseUrl)} />
      </head>
      <body className="bg-[#f8fafc] text-slate-900 antialiased min-h-screen">
        <NextTopLoader
          color="#059669"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 12px #059669,0 0 6px #10b981"
          zIndex={99999}
        />
        <AuthProvider>
          <ToastProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
