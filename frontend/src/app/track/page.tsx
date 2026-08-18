"use client";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Suspense } from "react";
import LottieAnimation from "@/app/components/shared/LottieAnimation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type TicketInfo = {
  complaint_id: string;
  ticketId?: string;
  complaint: string;
  email?: string;
  category: string;
  subcategory?: string;
  status: string;
  ai_solution: string;
  support_message?: string;
  feedback?: string;
  is_admin_solved?: boolean;
  created_at?: string;
  resolved_at?: string;
  city?: string;
  state?: string;
};

function TrackContent() {
  const searchParams = useSearchParams();
  const [inputId, setInputId] = useState("");
  const [result, setResult] = useState<TicketInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const fetchTicket = useCallback(async (searchId: string) => {
    const cleanId = searchId.trim();
    if (!cleanId) {
      setError("Please enter a Ticket ID or Complaint ID.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`${API_URL}/api/complaints/${encodeURIComponent(cleanId)}`);
      if (res.status === 404) {
        throw new Error(`Ticket "${cleanId}" was not found. Please verify the ID and try again.`);
      }
      if (!res.ok) {
        throw new Error(`Server returned error ${res.status}. Please try again later.`);
      }
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to look up ticket.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTicket(inputId);
  };

  // Mount safety & auto-search on query param
  useEffect(() => {
    setMounted(true);
    const queryId = searchParams.get("id");
    if (queryId) {
      setInputId(queryId);
      fetchTicket(queryId);
    }
  }, [searchParams, fetchTicket]);

  const statusConfig = {
    SOLVED: {
      label: "Solved by Support Technician",
      badgeText: "SOLVED",
      color: "text-emerald-700",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      dot: "bg-emerald-500",
      description: "Our support technician has investigated your issue and provided an official resolution.",
    },
    RESOLVED: {
      label: "Resolved by AI Assistant",
      badgeText: "RESOLVED",
      color: "text-blue-700",
      bg: "bg-blue-50",
      border: "border-blue-200",
      dot: "bg-blue-500",
      description: "Your complaint was analyzed and resolved by the AI resolution engine.",
    },
    ESCALATED: {
      label: "Escalated to Technician — In Progress",
      badgeText: "ESCALATED",
      color: "text-amber-700",
      bg: "bg-amber-50",
      border: "border-amber-200",
      dot: "bg-amber-500",
      description: "This ticket is currently in our Level-3 Technician queue for manual intervention.",
    },
    OPEN: {
      label: "Escalated to Technician — In Progress",
      badgeText: "ESCALATED",
      color: "text-amber-700",
      bg: "bg-amber-50",
      border: "border-amber-200",
      dot: "bg-amber-500",
      description: "This ticket is actively being reviewed by a support technician.",
    },
    PENDING: {
      label: "Feedback Under Review — In Progress",
      badgeText: "PENDING",
      color: "text-indigo-700",
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      dot: "bg-indigo-500",
      description: "You reported the initial solution did not help. A technician is reviewing your feedback.",
    },
  };

  const statusKey = (result?.status || "PENDING").toUpperCase() as keyof typeof statusConfig;
  const sc = statusConfig[statusKey] || statusConfig.PENDING;

  return (
    <div
      className="min-h-screen pt-28 pb-20 relative"
      style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #EFF6FF 40%, #F4F9FD 100%)" }}
    >
      <div className="absolute inset-0 grid-pattern opacity-60" />
      <div
        className="hero-glow w-[450px] h-[450px] top-[-80px] left-[-80px]"
        style={{ background: "#93C5FD", opacity: 0.3 }}
      />
      <div
        className="hero-glow w-[350px] h-[350px] bottom-[-50px] right-[-50px]"
        style={{ background: "#60A5FA", opacity: 0.2 }}
      />

      <div className="container mx-auto max-w-3xl px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-[#102D47] text-3xl sm:text-4xl md:text-5xl font-extrabold mt-2 mb-3">
            Track My <span className="gradient-text">Ticket</span>
          </h1>
          <p className="text-slate-600 text-base sm:text-lg max-w-lg mx-auto">
            Enter your Ticket ID or Complaint ID to check the latest resolution status across our network.
          </p>
        </div>

        {/* Search Form */}
        <form
          onSubmit={handleSearch}
          className="glass-card p-6 sm:p-8 mb-8 bg-white border border-blue-100 shadow-xl shadow-blue-500/5 rounded-3xl"
        >
          <label className="block text-sm font-semibold text-[#102D47] mb-2">
            Ticket ID / Complaint ID
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              id="ticket-id-input"
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
              placeholder="e.g. TCK-20260818-123456 or a UUID"
              className="input-field flex-1"
            />
            <button
              type="submit"
              id="track-btn"
              disabled={loading}
              className="btn-primary px-7 py-3 text-sm font-bold flex-shrink-0 shadow-md shadow-blue-500/20 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                  Searching…
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                  Search
                </>
              )}
            </button>
          </div>

          {error && (
            <p className="text-red-600 text-sm mt-3 flex items-center gap-2 font-medium">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              {error}
            </p>
          )}
        </form>

        {/* Result Display */}
        {result && (
          <div className="space-y-6">
            {/* Status Banner */}
            <div className={`flex items-start gap-4 p-6 rounded-3xl border shadow-sm ${sc.border} ${sc.bg}`}>
              <div className={`status-dot ${sc.dot} w-3.5 h-3.5 mt-1.5 flex-shrink-0`} />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <p className={`font-extrabold text-base sm:text-lg ${sc.color}`}>{sc.label}</p>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${sc.border} ${sc.color} bg-white/90 shadow-xs`}>
                    {sc.badgeText}
                  </span>
                </div>
                <p className={`text-xs sm:text-sm mb-2 ${sc.color} opacity-90`}>{sc.description}</p>
                {result.created_at && mounted && (
                  <p className="text-slate-500 text-xs font-medium" suppressHydrationWarning>
                    Submitted: {new Date(result.created_at).toLocaleString()}
                  </p>
                )}
                {result.resolved_at && mounted && (
                  <p className="text-emerald-700 text-xs font-bold mt-0.5" suppressHydrationWarning>
                    Technician Solved: {new Date(result.resolved_at).toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            {/* Details Grid */}
            <div className="glass-card p-6 grid sm:grid-cols-2 grid-cols-1 gap-5 bg-white border border-blue-100 rounded-2xl shadow-sm">
              <div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Ticket ID</p>
                <p className="text-[#102D47] font-mono font-bold text-sm sm:text-base">{result.ticketId || result.complaint_id}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Category</p>
                <p className="text-[#102D47] text-sm sm:text-base font-semibold">{result.category}</p>
              </div>
              {result.city && (
                <div>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Location</p>
                  <p className="text-[#102D47] text-sm font-medium">{[result.city, result.state].filter(Boolean).join(", ")}</p>
                </div>
              )}
              {result.email && (
                <div>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Contact Email</p>
                  <p className="text-[#102D47] text-sm font-medium">{result.email}</p>
                </div>
              )}
            </div>

            {/* Original Complaint */}
            <div className="glass-card p-6 bg-[#F8FBFE] border border-blue-100 rounded-2xl shadow-xs">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Your Submitted Complaint</p>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed">{result.complaint}</p>
            </div>

            {/* Customer Negative Feedback (if present) */}
            {result.feedback && (
              <div className="glass-card p-6 bg-amber-50/50 border border-amber-200 rounded-2xl shadow-xs">
                <p className="text-amber-800 text-xs font-bold uppercase tracking-wider mb-1">Customer Feedback Submitted</p>
                <p className="text-amber-900 text-sm italic">"{result.feedback}"</p>
              </div>
            )}

            {/* Resolution Box */}
            <div className="glass-card p-6 sm:p-8 bg-white border border-blue-100 rounded-3xl shadow-sm">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-blue-50">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${result.status === "SOLVED" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-blue-50 text-blue-600 border border-blue-100"}`}>
                  {result.status === "SOLVED" ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
                    </svg>
                  )}
                </div>
                <h3 className="text-[#102D47] text-lg font-bold">
                  {result.status === "SOLVED"
                    ? "Official Technician Resolution"
                    : result.status === "RESOLVED"
                    ? "AI Resolution"
                    : "Current Status & Next Steps"}
                </h3>
              </div>
              <div className="ai-response prose max-w-none text-slate-700">
                <ReactMarkdown>
                  {result.support_message || result.ai_solution || "Your issue is currently being handled by our support technician."}
                </ReactMarkdown>
              </div>
            </div>

            {/* Footer action */}
            <div className="text-center pt-2">
              <a href="/complaint" className="btn-outline text-sm px-6 py-3">
                Submit Another Complaint
              </a>
            </div>
          </div>
        )}

        {/* Empty state with Share Animation */}
        {!result && !loading && !error && (
          <div className="glass-card p-8 sm:p-12 text-center bg-white border border-blue-100 rounded-3xl shadow-sm flex flex-col items-center">
            <div className="w-44 sm:w-56 h-44 sm:h-56 mb-4 flex items-center justify-center">
              <LottieAnimation
                animationPath="/animations/share.json"
                className="w-full h-full"
              />
            </div>
            <h4 className="text-[#102D47] text-lg font-bold mb-1">Real-Time Ticket Dispatch</h4>
            <p className="text-slate-600 text-sm font-medium max-w-sm mx-auto">
              Enter your Ticket ID above to see live updates, technician assignments, and AI resolution details.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-40 text-center text-slate-500">
        Loading Tracker…
      </div>
    }>
      <TrackContent />
    </Suspense>
  );
}
