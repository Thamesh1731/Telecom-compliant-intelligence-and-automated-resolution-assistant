import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-blue-100 bg-[#F0F6FA] py-14">
      <div className="container mx-auto max-w-screen-xl px-6">
        <div className="grid md:grid-cols-4 grid-cols-1 gap-10 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20"
                style={{ background: "linear-gradient(135deg, #1A73E8, #2563EB)" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="white" />
                </svg>
              </div>
              <span className="text-xl font-bold">
                <span className="text-[#102D47]">Signal</span>
                <span className="gradient-text"> CX</span>
              </span>
            </Link>
            <p className="text-slate-600 text-sm leading-relaxed max-w-xs">
              AI-powered telecom complaint resolution. Get instant answers
              for internet, billing, and service issues — 24/7.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-[#102D47] font-bold text-sm mb-4">Quick Links</h5>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: "Home", href: "/" },
                { label: "Submit Complaint", href: "/complaint" },
                { label: "Track My Ticket", href: "/track" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-slate-600 hover:text-blue-600 text-sm font-medium transition-colors duration-200"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h5 className="text-[#102D47] font-bold text-sm mb-4">Support</h5>
            <ul className="flex flex-col gap-2.5 text-sm text-slate-600 font-medium">
              <li>Available 24/7</li>
              <li>AI-First Resolution</li>
              <li>Human Escalation</li>
              <li>Ticket Tracking</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-blue-200/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-500 text-sm">
            © {year} Signal CX. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="status-dot bg-emerald-500" />
            <span className="text-slate-600 text-sm font-medium">System Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
