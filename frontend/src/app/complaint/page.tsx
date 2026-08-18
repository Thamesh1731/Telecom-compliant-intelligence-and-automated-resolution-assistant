"use client";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import LottieAnimation from "@/app/components/shared/LottieAnimation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type ResolutionResult = {
  success: boolean;
  complaint_id: string;
  ticketId: string;
  category: string;
  subcategory: string;
  solution: string;
  escalationRequired: boolean;
  escalationReason?: string;
  customerMessage?: string;
  status: string;
  priority?: string;
};

type FeedbackState = "idle" | "sending" | "sent";

const loadingSteps = [
  "Connecting to Signal CX Network…",
  "Analyzing complaint symptoms & urgency…",
  "Querying telecom knowledge base & resolver memory…",
  "Synthesizing your personalized step-by-step solution…",
];

export default function ComplaintPage() {
  // Form state
  const [complaint, setComplaint] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [filingOnBehalf, setFilingOnBehalf] = useState("No");

  // UI state
  const [loading, setLoading] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [result, setResult] = useState<ResolutionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<FeedbackState>("idle");
  const [feedbackText, setFeedbackText] = useState("");
  const [showFeedbackBox, setShowFeedbackBox] = useState(false);

  // Cycle loading steps smoothly while waiting
  useEffect(() => {
    if (!loading) {
      setLoadingStepIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingStepIndex((prev) => (prev + 1) % loadingSteps.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!complaint.trim() || complaint.trim().length < 10) {
      setError("Please describe your issue in at least 10 characters.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setFeedbackState("idle");
    setShowFeedbackBox(false);

    try {
      const res = await fetch(`${API_URL}/api/complaints`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ complaint, email, city, state, zipCode, filingOnBehalf }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.detail || `Server error: ${res.status}`);
      }

      const data: ResolutionResult = await res.json();
      setResult(data);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setError(err.message || "Failed to submit complaint. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNegativeFeedback = async () => {
    if (!result) return;
    if (!feedbackText.trim()) {
      toast.error("Please describe what didn't help.");
      return;
    }

    setFeedbackState("sending");

    try {
      const res = await fetch(`${API_URL}/api/negative-feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          complaint_id: result.complaint_id,
          complaint,
          category: result.category,
          subcategory: result.subcategory,
          ai_solution: result.solution,
          feedback: feedbackText,
          email,
        }),
      });

      if (!res.ok) throw new Error("Feedback submission failed.");

      setFeedbackState("sent");
      toast.success("Feedback received! A technician will review your case.");
    } catch {
      toast.error("Could not submit feedback. Please try again.");
      setFeedbackState("idle");
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setComplaint("");
    setEmail("");
    setCity("");
    setState("");
    setZipCode("");
    setFeedbackState("idle");
    setFeedbackText("");
    setShowFeedbackBox(false);
  };

  return (
    <div
      className="min-h-screen pt-28 pb-20 relative"
      style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #EFF6FF 40%, #F4F9FD 100%)" }}
    >
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#FFFFFF",
            color: "#102D47",
            border: "1px solid #BFDBFE",
            boxShadow: "0 10px 25px rgba(26, 115, 232, 0.1)",
          },
        }}
      />

      {/* Background grid & glows */}
      <div className="absolute inset-0 grid-pattern opacity-60" />
      <div
        className="hero-glow w-[450px] h-[450px] top-[-50px] right-[-50px]"
        style={{ background: "#93C5FD", opacity: 0.3 }}
      />
      <div
        className="hero-glow w-[400px] h-[400px] top-[40%] left-[-100px]"
        style={{ background: "#60A5FA", opacity: 0.2 }}
      />

      <div className="container mx-auto max-w-3xl px-6 relative z-10">
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="text-[#102D47] text-3xl sm:text-4xl md:text-5xl font-extrabold mt-2 mb-3">
            Submit Your <span className="gradient-text">Complaint</span>
          </h1>
          <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto">
            Describe your issue and our system will analyze and deliver a step-by-step resolution.
          </p>
        </div>

        {/* ── Loading State with Network Animation ── */}
        {loading && (
          <div
            className="glass-card p-8 sm:p-12 text-center bg-white border border-blue-100 shadow-2xl shadow-blue-500/10 rounded-3xl flex flex-col items-center animate-fade-up"
          >
            <div className="w-52 h-52 sm:w-64 sm:h-64 mb-4 flex items-center justify-center">
              <LottieAnimation
                animationPath="/animations/network.json"
                className="w-full h-full"
              />
            </div>
            <h3 className="text-[#102D47] text-xl sm:text-2xl font-extrabold mb-2">
              Routing Through Telecom Network
            </h3>
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm sm:text-base mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
              <span>{loadingSteps[loadingStepIndex]}</span>
            </div>
            <div className="w-full max-w-xs bg-blue-50 rounded-full h-2 overflow-hidden border border-blue-100">
              <div className="bg-gradient-to-r from-blue-500 to-sky-400 h-full rounded-full animate-pulse w-full" />
            </div>
            <p className="text-slate-400 text-xs mt-3">
              This usually takes 5–15 seconds
            </p>
          </div>
        )}

        {/* ── Complaint Form ── */}
        {!result && !loading && (
          <form
            onSubmit={handleSubmit}
            className="glass-card p-6 sm:p-10 space-y-6 bg-white border border-blue-100 shadow-xl shadow-blue-500/5 rounded-3xl"
          >
            {/* Complaint Textarea */}
            <div>
              <label className="block text-sm font-semibold text-[#102D47] mb-2">
                Describe Your Issue <span className="text-blue-600">*</span>
              </label>
              <textarea
                id="complaint-input"
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
                rows={5}
                placeholder="e.g., My broadband connection dropped 3 times this afternoon. The router DSL light is blinking orange and restart does not fix it..."
                className="input-field resize-none text-sm sm:text-base leading-relaxed"
                required
              />
              <p className="text-slate-400 text-xs mt-1.5 font-medium">
                {complaint.length} characters (minimum 10)
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-[#102D47] mb-2">
                Email Address <span className="text-slate-400 font-normal text-xs">(optional — for status updates)</span>
              </label>
              <input
                type="email"
                id="email-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@example.com"
                className="input-field"
              />
            </div>

            {/* Location Row */}
            <div className="grid sm:grid-cols-3 grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#102D47] mb-2">City</label>
                <input
                  type="text"
                  id="city-input"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Dallas"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#102D47] mb-2">State</label>
                <input
                  type="text"
                  id="state-input"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="TX"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#102D47] mb-2">ZIP Code</label>
                <input
                  type="text"
                  id="zip-input"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="75001"
                  className="input-field"
                />
              </div>
            </div>

            {/* Filing on behalf */}
            <div>
              <label className="block text-sm font-semibold text-[#102D47] mb-3">
                Filing on behalf of someone else?
              </label>
              <div className="flex gap-3">
                {["No", "Yes"].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setFilingOnBehalf(opt)}
                    className={`px-6 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                      filingOnBehalf === opt
                        ? "border-blue-600 bg-blue-50 text-blue-600 shadow-xs"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 p-4 rounded-2xl border border-red-200 bg-red-50 text-red-700">
                <svg className="text-red-500 flex-shrink-0 mt-0.5" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              id="submit-complaint-btn"
              disabled={loading}
              className="btn-primary w-full py-4 text-base font-bold shadow-lg shadow-blue-500/25 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              Submit &amp; Get Resolution
            </button>
          </form>
        )}

        {/* ── Result Card ── */}
        {result && (
          <div className="space-y-6">
            {/* Status Banner */}
            <div
              className={`flex items-center gap-4 p-5 rounded-2xl border shadow-sm ${
                result.escalationRequired
                  ? "border-amber-200 bg-amber-50"
                  : "border-emerald-200 bg-emerald-50"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  result.escalationRequired ? "bg-amber-100" : "bg-emerald-100"
                }`}
              >
                {result.escalationRequired ? (
                  <svg className="text-amber-600" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                ) : (
                  <svg className="text-emerald-600" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-bold text-base ${result.escalationRequired ? "text-amber-900" : "text-emerald-900"}`}>
                  {result.escalationRequired ? "Forwarded to Support Technician" : "Issue Resolved by AI Assistant"}
                </p>
                <p className={`text-sm mt-0.5 ${result.escalationRequired ? "text-amber-800" : "text-emerald-800"}`}>
                  {result.escalationRequired
                    ? result.customerMessage || "A technician will review your case and contact you."
                    : "Your step-by-step resolution is ready below."}
                </p>
              </div>
              <span className={result.escalationRequired ? "badge-warning" : "badge-success"}>
                {result.status}
              </span>
            </div>

            {/* Ticket ID + Category Grid */}
            <div className="glass-card p-6 grid sm:grid-cols-2 grid-cols-1 gap-5 bg-white border border-blue-100 rounded-2xl shadow-sm">
              <div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Ticket ID</p>
                <p className="text-[#102D47] font-mono font-bold text-sm sm:text-base">{result.ticketId}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Category</p>
                <p className="text-[#102D47] text-sm sm:text-base font-semibold">{result.category}</p>
              </div>
            </div>

            {/* AI Resolution Markdown */}
            <div className="glass-card p-6 sm:p-8 bg-white border border-blue-100 rounded-3xl shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-blue-50">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
                  </svg>
                </div>
                <h3 className="text-[#102D47] text-lg font-bold">
                  {result.escalationRequired ? "Initial Assessment & Next Steps" : "Recommended Resolution"}
                </h3>
              </div>

              <div className="ai-response prose max-w-none text-slate-700">
                <ReactMarkdown>{result.solution}</ReactMarkdown>
              </div>
            </div>

            {/* Track Ticket Card */}
            <div className="glass-card p-6 bg-[#F0F6FA] border border-blue-100 rounded-2xl flex flex-col sm:flex-row items-center gap-4 justify-between">
              <div>
                <p className="text-[#102D47] font-bold text-sm">Save your Ticket ID for tracking</p>
                <p className="text-slate-600 text-xs mt-0.5">Use it to check updates on your complaint anytime.</p>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <a
                  href={`/track?id=${result.ticketId}`}
                  className="btn-outline text-sm px-4 py-2.5 text-center flex-1 sm:flex-initial"
                >
                  Track Status
                </a>
                <button
                  onClick={handleReset}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-blue-600 bg-white border border-slate-200 hover:border-blue-300 transition-all duration-200 shadow-xs flex-1 sm:flex-initial"
                >
                  New Complaint
                </button>
              </div>
            </div>

            {/* Negative Feedback Flow */}
            {!result.escalationRequired && feedbackState !== "sent" && (
              <div className="glass-card p-6 bg-white border border-blue-100 rounded-2xl shadow-xs">
                {!showFeedbackBox ? (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <p className="text-slate-700 text-sm font-medium">Did this resolve your problem?</p>
                    <div className="flex gap-3">
                      <button
                        onClick={handleReset}
                        className="px-4 py-2 rounded-xl text-sm font-semibold border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all duration-200"
                      >
                        ✓ Yes, resolved!
                      </button>
                      <button
                        id="not-helpful-btn"
                        onClick={() => setShowFeedbackBox(true)}
                        className="px-4 py-2 rounded-xl text-sm font-semibold border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 transition-all duration-200"
                      >
                        ✗ This didn't help
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-[#102D47] text-sm font-bold">What went wrong? We will route this to a technician.</p>
                    <textarea
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      rows={3}
                      placeholder="e.g., I restarted the router as indicated, but the red internet light is still flashing..."
                      className="input-field resize-none text-sm"
                    />
                    <div className="flex gap-3">
                      <button
                        id="submit-feedback-btn"
                        onClick={handleNegativeFeedback}
                        disabled={feedbackState === "sending"}
                        className="btn-primary text-sm px-5 py-2.5 disabled:opacity-60"
                      >
                        {feedbackState === "sending" ? "Submitting…" : "Send to Technician"}
                      </button>
                      <button
                        onClick={() => setShowFeedbackBox(false)}
                        className="text-sm font-medium text-slate-500 hover:text-slate-700 px-3"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {feedbackState === "sent" && (
              <div className="flex items-center gap-3 p-5 rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-800">
                <svg className="text-emerald-600" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <p className="text-sm font-semibold">Feedback recorded! A support technician has been assigned to your issue.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
