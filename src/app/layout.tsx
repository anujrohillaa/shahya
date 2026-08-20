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

export const metadata: Metadata = {
  title: "Shahya — Find Rooms, Flats & Flatmates for Free | Zero Brokerage",
  description: "Browse verified rooms, shared flats, and flatmates in Gurgaon, Bangalore, Delhi, Noida, Pune, and Mumbai. Chat directly on Shahya without contact unlock charges.",
  keywords: "Shahya, flatmate, room for rent, shared accommodation, flat share, roommate finder, no brokerage, zero commission, shahya.com",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

import NextTopLoader from "nextjs-toploader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
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
