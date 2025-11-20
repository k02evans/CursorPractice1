import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CursorLight } from "@/components/layout/CursorLight";

export const metadata: Metadata = {
  title: "IndieLab - Music Artist Resources & Genre Hub",
  description: "Comprehensive resources for independent artists across all genres. Community management, affiliate marketing, essential software and hardware, learning resources, and local performance finder.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CursorLight />
        <Navbar />
        <main className="relative z-[2]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

