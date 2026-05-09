import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  variable: "--font-sans",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Celsius — Inverter Climatization",
  description: "Premium inverter HVAC systems for modern homes and offices.",
  icons: { icon: "/favicon.ico" }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mk" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-canvas text-ink">{children}</body>
    </html>
  );
}
