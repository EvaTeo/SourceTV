import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import MobileBottomNav from "@/app/components/MobileBottomNav";
import PageTransition from "@/app/components/PageTransition";
import { getPlatformSettings } from "@/app/lib/platformSettings";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPlatformSettings();

  return {
    title: {
      default: settings.platformName,
      template: `%s | ${settings.platformName}`,
    },
    description:
      settings.tagline ||
      "Stream films, series, animation, documentaries, and more.",
    applicationName: settings.platformName,
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_APP_URL ||
        "http://localhost:3000"
    ),
    openGraph: {
      title: settings.platformName,
      description:
        settings.tagline ||
        "Stream films, series, animation, documentaries, and more.",
      siteName: settings.platformName,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: settings.platformName,
      description:
        settings.tagline ||
        "Stream films, series, animation, documentaries, and more.",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        className={`${geistSans.className} min-h-screen bg-[#05070d] text-white antialiased`}
      >
        <Header />

        <PageTransition>{children}</PageTransition>

        <Footer />

        <MobileBottomNav />
      </body>
    </html>
  );
}