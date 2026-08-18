import type { Metadata } from "next";
import Hero from "./components/home/hero";
import Features from "./components/home/features";
import HowItWorks from "./components/home/how-it-works";

export const metadata: Metadata = {
  title: "Signal CX — AI-Powered Telecom Support",
  description:
    "Submit your telecom complaint and get an instant AI-powered resolution. Signal CX resolves internet, billing, and service issues 24/7.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
    </>
  );
}
