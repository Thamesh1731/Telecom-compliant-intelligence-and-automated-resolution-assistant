import Link from "next/link";

const steps = [
  {
    num: "01",
    title: "Describe Your Issue",
    description:
      "Fill out the complaint form with your issue details — internet, billing, device, or service problem. No jargon required.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    color: "text-blue-600",
    border: "border-blue-100",
  },
  {
    num: "02",
    title: "AI Analyzes & Retrieves",
    description:
      "Our RAG engine classifies your complaint, searches the knowledge base, and synthesizes a tailored solution — in seconds.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
    color: "text-indigo-600",
    border: "border-indigo-100",
  },
  {
    num: "03",
    title: "Get Your Resolution",
    description:
      "Receive a personalized, step-by-step fix immediately. If escalation is needed, your ticket is sent to a live technician.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    color: "text-emerald-600",
    border: "border-emerald-100",
  },
];

export default function HowItWorks() {
  return (
    <section
      className="relative py-24"
      style={{ background: "linear-gradient(180deg, #F4F9FD 0%, #FFFFFF 100%)" }}
    >
      <div className="container mx-auto max-w-screen-xl px-6">
        {/* Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <span className="badge-info mb-3">How It Works</span>
          <h2 className="text-[#102D47] mt-3 mb-4 text-3xl sm:text-4xl font-extrabold">
            Resolved in{" "}
            <span className="gradient-text">3 Simple Steps</span>
          </h2>
          <p className="text-slate-600 text-lg max-w-xl mx-auto">
            No phone queues, no repeated explanations. Just submit and get fixed.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 mb-14">
          {steps.map((step, i) => (
            <div
              key={step.num}
              data-aos="fade-up"
              data-aos-delay={i * 100}
              className="relative"
            >
              {/* Connector line (desktop) */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-full h-px border-t-2 border-dashed border-blue-200 z-0" />
              )}

              <div
                className={`relative z-10 rounded-2xl p-7 border ${step.border} bg-white shadow-lg shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300`}
              >
                {/* Step number */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="step-circle text-sm font-bold">{step.num}</div>
                  <div className={step.color}>{step.icon}</div>
                </div>

                <h4 className="text-[#102D47] font-bold text-lg mb-2">{step.title}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center" data-aos="fade-up">
          <Link
            href="/complaint"
            className="btn-primary px-10 py-4 text-base shadow-lg shadow-blue-500/20"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            Get Your Issue Resolved Now
          </Link>
        </div>
      </div>
    </section>
  );
}
