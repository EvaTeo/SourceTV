import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import MobileBottomNav from "@/app/components/MobileBottomNav";
import PageTransition from "@/app/components/PageTransition";
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

export const metadata: Metadata = {
  title: "SourceTV",
  description:
    "The next generation of entertainment. Stream films, series, animation, documentaries, and more.",
};

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