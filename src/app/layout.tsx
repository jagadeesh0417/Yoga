import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollProgress from "@/components/animations/ScrollProgress";
import MouseGlow from "@/components/animations/MouseGlow";
import LoadingScreen from "@/components/animations/LoadingScreen";
import EnquiryForm from "@/components/EnquiryForm";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MYSTIC YOGA™ | Awaken Your Inner Power. Transform Your Life.",
  description:
    "Mystic Yoga is an international wellness platform founded by Sunita Singh, dedicated to helping individuals achieve peak health, mental clarity, emotional balance, and spiritual growth through yoga, meditation, and holistic wellness programs.",
  keywords: [
    "yoga",
    "meditation",
    "wellness",
    "hong kong yoga",
    "online yoga classes",
    "corporate wellness",
    "yoga retreats",
    "sunita singh",
    "mystic yoga",
  ],
  openGraph: {
    title: "MYSTIC YOGA™ | Awaken Your Inner Power. Transform Your Life.",
    description:
      "International wellness platform offering yoga, meditation, corporate wellness, and luxury retreats.",
    url: "https://www.mysticyoga.global",
    siteName: "MYSTIC YOGA",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MYSTIC YOGA™ | Awaken Your Inner Power. Transform Your Life.",
    description:
      "International wellness platform offering yoga, meditation, corporate wellness, and luxury retreats.",
  },
  robots: {
    index: true,
    follow: true,
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
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <LoadingScreen />
        <EnquiryForm />
        <ScrollProgress />
        <MouseGlow />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
