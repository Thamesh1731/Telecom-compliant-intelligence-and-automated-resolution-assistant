"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Complaint", href: "/complaint" },
  { label: "Track My Ticket", href: "/track" },
];

export default function Header() {
  const pathname = usePathname();
  const [sticky, setSticky] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY >= 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (mobileRef.current && !mobileRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-[76px] flex items-center transition-all duration-300 ${
          sticky
            ? "border-b border-blue-100/80 shadow-md shadow-blue-500/5"
            : "bg-transparent"
        }`}
        style={{
          background: sticky ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="container mx-auto max-w-screen-xl px-6 flex items-center justify-between w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/25"
              style={{ background: "linear-gradient(135deg, #1A73E8, #2563EB)" }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="white" strokeWidth="0" />
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight">
              <span className="text-[#102D47]">Signal</span>
              <span className="gradient-text"> CX</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-2 bg-blue-50/60 p-1.5 rounded-2xl border border-blue-100/60">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-blue-600 bg-white shadow-sm font-semibold"
                      : "text-slate-600 hover:text-blue-600 hover:bg-white/60"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* CTA + Mobile Button */}
          <div className="flex items-center gap-3">
            <Link
              href="/complaint"
              className="hidden lg:inline-flex btn-primary text-sm px-5 py-2.5 shadow-md shadow-blue-500/20"
            >
              Submit Complaint
            </Link>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-colors border border-blue-100"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        ref={mobileRef}
        className={`fixed top-0 right-0 h-full w-72 z-50 lg:hidden transform transition-transform duration-300 ease-out bg-white shadow-2xl border-l border-blue-100 ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-blue-50">
            <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #1A73E8, #2563EB)" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="white" />
                </svg>
              </div>
              <span className="font-bold text-[#102D47]">Signal CX</span>
            </Link>
            <button onClick={() => setMobileOpen(false)} className="text-slate-400 hover:text-slate-700 p-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-col gap-2 mb-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-blue-600 bg-blue-50 font-semibold border border-blue-100"
                      : "text-slate-700 hover:text-blue-600 hover:bg-blue-50/50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <Link
            href="/complaint"
            onClick={() => setMobileOpen(false)}
            className="btn-primary w-full text-sm py-3 text-center"
          >
            Submit Complaint
          </Link>
        </div>
      </div>
    </>
  );
}
