import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });

export const metadata: Metadata = {
  title: "VYNX — Launch Memecoins on TON",
  description:
    "The fastest and easiest way to launch, trade and discover memecoins on TON. VYNX — every token takes orbit.",
  openGraph: {
    title: "VYNX — Launch Memecoins on TON",
    description:
      "The fastest and easiest way to launch, trade and discover memecoins on TON. VYNX — every token takes orbit.",
    siteName: "VYNX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VYNX — Launch Memecoins on TON",
    description:
      "The fastest and easiest way to launch, trade and discover memecoins on TON.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${space.variable}`}>
      <body>{children}</body>
    </html>
  );
}
