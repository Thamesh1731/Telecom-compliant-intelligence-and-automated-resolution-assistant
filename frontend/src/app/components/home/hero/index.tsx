"use client";
import Link from "next/link";
import LottieAnimation from "@/app/components/shared/LottieAnimation";

export default function Hero() {
  return (
    <section
      className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-28 pb-20"
      style={{
        background: "linear-gradient(180deg, #FFFFFF 0%, #EFF6FF 50%, #F4F9FD 100%)",
      }}
    >
      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-70" />

      {/* Soft Blue Glow Blobs */}
      <div
        className="hero-glow w-[550px] h-[550px] top-[-80px] left-[-80px]"
        style={{ background: "#93C5FD", opacity: 0.35 }}
      />
      <div
        className="hero-glow w-[450px] h-[450px] bottom-[-60px] right-[-60px]"
        style={{ background: "#60A5FA", opacity: 0.25 }}
      />
      <div
        className="hero-glow w-[350px] h-[350px] top-[30%] right-[15%]"
        style={{ background: "#38BDF8", opacity: 0.2 }}
      />

      <div className="container mx-auto max-w-screen-xl px-6 relative z-10">
        <div className="grid lg:grid-cols-12 grid-cols-1 items-center gap-12 lg:gap-8">
          {/* Left Column: Text & CTA */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Headline */}
            <h1
              className="text-[#102D47] font-extrabold mb-6 leading-[1.12] text-4xl sm:text-5xl lg:text-[54px]"
              data-aos="fade-right"
              data-aos-delay="100"
            >
              Instant Resolution for{" "}
              <span className="gradient-text">Every Telecom</span>{" "}
              Complaint
            </h1>

            {/* Subheadline */}
            <p
              className="text-slate-600 text-lg md:text-xl leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0"
              data-aos="fade-right"
              data-aos-delay="200"
            >
              Describe your issue — our AI instantly analyzes it, retrieves the
              best resolution from our knowledge base, and delivers a
              personalized fix in seconds.
            </p>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-12"
              data-aos="fade-right"
              data-aos-delay="300"
            >
              <Link href="/complaint" className="btn-primary px-8 py-4 text-base shadow-lg shadow-blue-500/20 w-full sm:w-auto text-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Submit a Complaint
              </Link>
              <Link href="/track" className="btn-outline px-8 py-4 text-base w-full sm:w-auto text-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                Track My Ticket
              </Link>
            </div>

            {/* 24/7 Always Available Stat */}
            <div className="max-w-xs mx-auto lg:mx-0">
              <div className="glass-card p-4 sm:p-5 rounded-2xl text-center border border-blue-100 bg-white/90 shadow-md shadow-blue-500/5">
                <p className="gradient-text text-3xl sm:text-4xl font-black tracking-tight mb-1">24/7</p>
                <p className="text-slate-600 text-xs sm:text-sm font-semibold uppercase tracking-wider">Always Available</p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive AI Animation */}
          <div
            className="lg:col-span-5 flex justify-center items-center"
            data-aos="fade-left"
            data-aos-delay="200"
          >
            <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center">
              {/* Background ambient glow circle */}
              <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-blue-200/50 to-sky-100/60 blur-2xl -z-10" />
              
              {/* Floating glass container for animation */}
              <div className="w-full h-full rounded-3xl bg-white/60 backdrop-blur-sm border border-blue-100/80 shadow-xl shadow-blue-500/10 p-4 flex items-center justify-center hover:scale-[1.02] transition-transform duration-500">
                <LottieAnimation
                  animationPath="/animations/cloud-robotics.json"
                  className="w-full h-full max-h-[380px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
