import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import NextTopLoader from "nextjs-toploader";
import AosInit from "@/utils/aos";
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "Signal CX — AI-Powered Telecom Support",
    template: "%s | Signal CX",
  },
  description:
    "Submit your telecom complaint and get an instant AI-powered resolution. Signal CX uses advanced AI to resolve internet, billing, and service issues instantly.",
  keywords: ["telecom support", "complaint resolution", "AI customer service", "internet issues", "billing help"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans bg-[#F4F9FD] text-[#102D47]`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <AosInit>
            <NextTopLoader color="#1A73E8" showSpinner={false} height={3} />
            <Header />
            <main>{children}</main>
            <Footer />
          </AosInit>
        </ThemeProvider>
      </body>
    </html>
  );
}
