const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" />
        <path d="M12 8v4l3 3" />
      </svg>
    ),
    title: "Instant AI Resolution",
    description:
      "Our RAG pipeline retrieves the most relevant solution from thousands of telecom knowledge documents in under 30 seconds.",
    border: "border-blue-100 hover:border-blue-300",
    iconBg: "bg-blue-50 text-blue-600",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    title: "Smart Triage & Priority",
    description:
      "Sentiment analysis classifies your urgency. Critical issues are escalated instantly to a human support technician.",
    border: "border-indigo-100 hover:border-indigo-300",
    iconBg: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Human Escalation",
    description:
      "Complex issues are forwarded to technicians with full context — no need to repeat yourself. We handle the handoff.",
    border: "border-sky-100 hover:border-sky-300",
    iconBg: "bg-sky-50 text-sky-600",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
    ),
    title: "Real-Time Ticket Tracking",
    description:
      "Every complaint gets a unique Ticket ID. Track its status, see the AI solution, and know when it's resolved.",
    border: "border-emerald-100 hover:border-emerald-300",
    iconBg: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 12l2 2 4-4" />
        <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
      </svg>
    ),
    title: "Multi-Category Intelligence",
    description:
      "From broadband drops to billing disputes to device failures — our classifier handles 10+ telecom complaint categories.",
    border: "border-amber-100 hover:border-amber-300",
    iconBg: "bg-amber-50 text-amber-600",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
    title: "No Wait Times",
    description:
      "Forget hold music. Submit your complaint anytime from any device. Our AI never sleeps, never gets frustrated.",
    border: "border-rose-100 hover:border-rose-300",
    iconBg: "bg-rose-50 text-rose-600",
  },
];

export default function Features() {
  return (
    <section className="relative bg-white py-24 border-t border-b border-blue-100/60">
      <div className="container mx-auto max-w-screen-xl px-6">
        {/* Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <span className="badge-info mb-3">Why Signal CX</span>
          <h2 className="text-[#102D47] mt-3 mb-4 text-3xl sm:text-4xl font-extrabold">
            Built for{" "}
            <span className="gradient-text">Frustrated Customers</span>
          </h2>
          <p className="text-slate-600 text-lg max-w-xl mx-auto">
            We combine retrieval-augmented AI with real escalation workflows to
            actually fix your problem — not just acknowledge it.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              data-aos="fade-up"
              data-aos-delay={i * 70}
              className={`relative rounded-2xl p-7 border ${f.border} bg-[#FAFDFE] hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300 group`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${f.iconBg} shadow-xs`}>
                {f.icon}
              </div>
              <h4 className="text-[#102D47] font-bold mb-2 text-lg">{f.title}</h4>
              <p className="text-slate-600 text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
