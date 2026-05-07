import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "SpendLens — AI Spend Audit for Startups",
  description:
    "Find out if you're overpaying for AI tools. Get an instant free audit of your AI subscriptions and discover potential savings.",
  keywords: ["AI tools", "SaaS spend", "startup tools", "AI audit", "cost optimization"],
  openGraph: {
    title: "SpendLens — AI Spend Audit for Startups",
    description:
      "Find out if you're overpaying for AI tools. Free instant audit.",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "SpendLens",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SpendLens — AI Spend Audit for Startups",
    description: "Find out if you're overpaying for AI tools. Free instant audit.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}