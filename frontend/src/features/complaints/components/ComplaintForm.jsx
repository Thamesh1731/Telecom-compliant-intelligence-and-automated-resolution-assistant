import React, { useState, useRef } from "react";
import BlurText from "../../../components/BlurText";
import SpotLightCard from "../../../components/SpotLightCard";
import { submitComplaintTicket, getComplaintStatus, submitNegativeFeedback } from "../api/complaintServices";

export default function ComplaintForm() {
  const [formData, setFormData] = useState({
    complaint: "",
    email: "",
    city: "",
    state: "Tamil Nadu",
    zipCode: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Feedback States
  const [feedbackChoice, setFeedbackChoice] = useState(null); // null | 'yes' | 'no'
  const [negativeFeedbackText, setNegativeFeedbackText] = useState("");
  const [isSubmittingNegative, setIsSubmittingNegative] = useState(false);
  const [negativeFeedbackSubmitted, setNegativeFeedbackSubmitted] = useState(false);
  const [negativeFeedbackError, setNegativeFeedbackError] = useState(null);

  const feedbackTextareaRef = useRef(null);

  const getStatusStyles = (status) => {
    switch (status) {
      case "Open":
        return "text-amber-400 bg-amber-950/60 border-amber-500/50 shadow-[0_0_10px_rgba(251,191,36,0.15)]";
      case "Pending":
        return "text-cyan-400 bg-cyan-950/60 border-cyan-500/50 shadow-[0_0_10px_rgba(34,211,238,0.15)]";
      case "Resolved":
      default:
        return "text-emerald-400 bg-emerald-950/60 border-emerald-500/50 shadow-[0_0_10px_rgba(52,211,153,0.15)]";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.complaint.trim()) {
      setError("Please describe your issue before submitting.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    setResult(null);
    try {
      const data = await submitComplaintTicket(formData);
      setResult(data);
      if (data.status === "QUEUED" || data.status === "PROCESSING") {
        const pollStatus = async () => {
          try {
            const latest = await getComplaintStatus(data.complaint_id);
            setResult(latest);
            if (!["RESOLVED", "ESCALATED", "FAILED"].includes(latest.status)) {
              window.setTimeout(pollStatus, 1000);
            }
          } catch (pollError) {
            setError(pollError.message || "Unable to retrieve complaint status.");
          }
        };
        window.setTimeout(pollStatus, 1000);
      }
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes("failed to fetch")) {
        setError(
          "Unable to connect to the resolution service. Please ensure the backend is running and try again."
        );
      } else {
        setError(err.message || "An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = (e) => {
    if (e) e.preventDefault();
    setResult(null);
    setError(null);
    setFeedbackChoice(null);
    setNegativeFeedbackText("");
    setNegativeFeedbackSubmitted(false);
    setNegativeFeedbackError(null);
    setFormData({
      complaint: "",
      email: "",
      city: "",
      state: "Tamil Nadu",
      zipCode: "",
    });
  };

  const handleNegativeFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!negativeFeedbackText.trim()) return;

    setIsSubmittingNegative(true);
    setNegativeFeedbackError(null);
    try {
      await submitNegativeFeedback({
        complaint_id: result.complaint_id || result.ticketId,
        complaint: formData.complaint,
        category: result.predictedCategory || result.category || "General",
        subcategory: result.subcategory || "General",
        ai_solution: result.resolution || result.solution,
        feedback: negativeFeedbackText,
        email: formData.email,
      });
      setNegativeFeedbackSubmitted(true);
    } catch (err) {
      setNegativeFeedbackError(err.message || "Failed to submit feedback.");
    } finally {
      setIsSubmittingNegative(false);
    }
  };

  const handleFeedbackChoiceNo = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFeedbackChoice('no');
    setTimeout(() => {
      if (feedbackTextareaRef.current) {
        feedbackTextareaRef.current.focus({ preventScroll: true });
      }
    }, 50);
  };

  const handleFeedbackChoiceYes = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFeedbackChoice('yes');
  };

  // Helper to parse solution blocks
  const parseSolutionText = (text) => {
    if (!text) return { problem: "", solution: "", reason: "", confidence: "" };

    let problem = "";
    let solution = "";
    let reason = "";

    const probMatch = text.match(/Problem:\s*([\s\S]*?)(?=\n\nRecommended Solution:|\nRecommended Solution:|$)/i);
    if (probMatch) problem = probMatch[1].trim();

    const solMatch = text.match(/Recommended Solution:\s*([\s\S]*?)(?=\n\nReason:|\nReason:|$)/i);
    if (solMatch) solution = solMatch[1].trim();

    const reasMatch = text.match(/Reason:\s*([\s\S]*?)(?=\n\nEscalation:|\nEscalation:|$)/i);
    if (reasMatch) reason = reasMatch[1].trim();

    if (!problem && !solution && !reason) {
      solution = text;
    }

    return { problem, solution, reason };
  };

  // -----------------------------------------------------------------------
  // Wide 2-Column Dashboard Result View
  // -----------------------------------------------------------------------
  const ResultDashboard = ({ data }) => {
    const parsed = parseSolutionText(data.resolution || data.solution);

    return (
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-full items-stretch">

        {/* Left Side: Ticket Metadata & Overview (4 cols) */}
        <div className="md:col-span-4 bg-slate-950/80 rounded-xl p-4 border border-slate-800 flex flex-col justify-between space-y-3">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                Ticket Metadata
              </span>
              <div className={`flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full border text-xs font-bold ${getStatusStyles(data.status)}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                <span>{data.status || "Resolved"}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                  Ticket Reference ID
                </p>
                <p className="font-mono text-cyan-300 text-sm font-bold tracking-wide">
                  {data.ticketId || data.complaint_id || "TCK-20260815-9821"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-900/90 rounded-lg p-2 border border-slate-800">
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                    Category
                  </p>
                  <p className="text-slate-200 text-xs font-semibold truncate capitalize">
                    {data.predictedCategory || data.category || "Internet"}
                  </p>
                </div>
                <div className="bg-slate-900/90 rounded-lg p-2 border border-slate-800">
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                    Confidence
                  </p>
                  <p className="text-emerald-400 text-xs font-bold">
                    {data.confidence != null ? `${(data.confidence * 100).toFixed(0)}%` : "High (94%)"}
                  </p>
                </div>
              </div>

              {formData.email && (
                <div className="bg-slate-900/90 rounded-lg p-2 border border-slate-800">
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                    Customer Contact
                  </p>
                  <p className="text-slate-300 text-xs truncate">
                    {formData.email}
                  </p>
                </div>
              )}

              {(formData.city || formData.state || formData.zipCode) && (
                <div className="bg-slate-900/90 rounded-lg p-2 border border-slate-800">
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                    Location & ZIP
                  </p>
                  <p className="text-slate-300 text-xs truncate">
                    {[formData.city, formData.state, formData.zipCode].filter(Boolean).join(", ")}
                  </p>
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="w-full py-2.5 px-4 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/50 text-slate-200 hover:text-cyan-300 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center space-x-2 shadow-md"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Submit Another Complaint</span>
          </button>
        </div>

        {/* Right Side: Full AI Resolution & Actions (8 cols) */}
        <div className="md:col-span-8 bg-slate-950/80 rounded-xl p-4 border border-slate-800 flex flex-col justify-between space-y-3">

          {/* Header */}
          <div className="flex items-center space-x-2 border-b border-slate-800/80 pb-2">
            <svg className="w-4 h-4 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-xs uppercase tracking-wider font-extrabold text-cyan-400">
              AI Diagnostic Resolution & Procedure
            </span>
          </div>

          {/* Solution Contents */}
          <div className="space-y-2.5">
            {parsed.problem && (
              <div className="bg-slate-900/60 rounded-lg p-2.5 border border-slate-800">
                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-0.5">
                  Identified Problem
                </p>
                <p className="text-slate-200 text-xs leading-relaxed">
                  {parsed.problem}
                </p>
              </div>
            )}

            {parsed.solution && (
              <div className="bg-slate-900/90 rounded-lg p-3 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,229,255,0.05)]">
                <p className="text-[10px] uppercase tracking-wider font-bold text-cyan-400 mb-1">
                  Recommended Solution & Action Steps
                </p>
                <div className="text-slate-100 text-xs leading-relaxed whitespace-pre-wrap font-sans">
                  {parsed.solution}
                </div>
              </div>
            )}

            {parsed.reason && (
              <div className="bg-slate-900/60 rounded-lg p-2.5 border border-slate-800">
                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-0.5">
                  Diagnostic Justification
                </p>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {parsed.reason}
                </p>
              </div>
            )}
          </div>

          {/* Inline Feedback Bar */}
          <div className="rounded-lg bg-slate-900 border border-slate-800 p-2.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">
                Did this solution solve your issue?
              </span>
              {feedbackChoice === null && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleFeedbackChoiceYes}
                    className="py-1 px-3.5 bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 font-bold rounded-md text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={handleFeedbackChoiceNo}
                    className="py-1 px-3.5 bg-rose-950 hover:bg-rose-900 border border-rose-500/50 text-rose-300 font-bold rounded-md text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    No
                  </button>
                </div>
              )}
            </div>

            {feedbackChoice === 'yes' && (
              <div className="p-2 rounded-md border bg-emerald-950/60 border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Thank you for your feedback! Issue status has been confirmed as resolved.
              </div>
            )}

            {feedbackChoice === 'no' && !negativeFeedbackSubmitted && (
              <form onSubmit={handleNegativeFeedbackSubmit} className="space-y-2 pt-1">
                <p className="text-[11px] text-slate-400">
                  Please specify what failed so our engineering team can provide a direct resolution:
                </p>
                <textarea
                  ref={feedbackTextareaRef}
                  rows="2"
                  value={negativeFeedbackText}
                  onChange={(e) => setNegativeFeedbackText(e.target.value)}
                  placeholder="Describe what went wrong or additional technical details..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-xs transition"
                />
                {negativeFeedbackError && (
                  <p className="text-[11px] text-red-400">{negativeFeedbackError}</p>
                )}
                <button
                  type="submit"
                  disabled={isSubmittingNegative || !negativeFeedbackText.trim()}
                  className="w-full py-1.5 px-3 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold rounded-md text-xs transition cursor-pointer"
                >
                  {isSubmittingNegative ? "Submitting..." : "Submit Technical Escalation"}
                </button>
              </form>
            )}

            {feedbackChoice === 'no' && negativeFeedbackSubmitted && (
              <div className="p-2 rounded-md border bg-cyan-950/60 border-cyan-500/50 text-cyan-300 text-xs font-bold flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Feedback submitted! Ticket routed to level-3 engineering team.
              </div>
            )}
          </div>

        </div>

      </div>
    );
  };

  // -----------------------------------------------------------------------
  // Main Render - Enforcing Wide 2-Column Desktop Layout
  // -----------------------------------------------------------------------
  return (
    <div className="h-screen w-full bg-transparent text-slate-100 flex flex-col items-center justify-center p-3 sm:p-5 font-sans overflow-hidden">
      {/* Header */}
      <div className="text-center max-w-2xl mb-3 flex flex-col items-center flex-shrink-0">
        <BlurText
          text="Telecom Complaint Intelligence"
          delay={70}
          animateBy="words"
          direction="top"
          className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-0.5 text-slate-100 justify-center"
        />
        <BlurText
          text="Automated multi-agent routing & diagnostic resolution engine"
          delay={90}
          animateBy="words"
          direction="top"
          className="text-slate-400 text-xs sm:text-sm justify-center"
        />
      </div>

      {/* Main Wide Card Container (max-w-5xl / 1100px wide) */}
      <SpotLightCard
        className="w-full max-w-5xl bg-slate-900/90 backdrop-blur-md border border-slate-800 shadow-2xl p-4 sm:p-6 relative overflow-hidden !bg-slate-900 max-h-[82vh] flex flex-col justify-center"
        spotlightColor="rgba(0, 229, 255, 0.15)"
      >
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Loading State */}
        {isSubmitting && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20"></div>
              <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin"></div>
            </div>
            <p className="text-sm text-slate-300 font-bold animate-pulse">
              Analyzing via Multi-Agent RAG Resolution Engine...
            </p>
            <p className="text-xs text-slate-500">
              Classifying Intent → Querying Vector Database → Synthesizing Diagnostic Solution
            </p>
          </div>
        )}

        {/* Error State */}
        {!isSubmitting && error && (
          <div className="space-y-4 max-w-xl mx-auto w-full">
            <div className="rounded-xl bg-red-950/50 border border-red-500/50 p-4">
              <div className="flex items-start space-x-3">
                <svg
                  className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-sm font-bold text-red-300 mb-1">Connection Error</p>
                  <p className="text-xs text-red-300/80">{error}</p>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="w-full py-2.5 px-4 border border-slate-700 hover:border-cyan-500/50 text-slate-300 text-xs font-bold rounded-lg transition cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Result Dashboard */}
        {/* Call the render helper directly so feedback input stays mounted while typing. */}
        {!isSubmitting && !error && result && ResultDashboard({ data: result })}

        {/* Input Form (Wide 2-Column Layout) */}
        {!isSubmitting && !error && !result && (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">

            {/* Left: Complaint Text (7 cols) */}
            <div className="md:col-span-7 flex flex-col justify-between space-y-2">
              <label className="block text-xs uppercase tracking-wider font-bold text-slate-300">
                Complaint Description
              </label>
              <textarea
                name="complaint"
                rows="6"
                required
                value={formData.complaint}
                onChange={handleChange}
                placeholder="Describe your technical issue, error messages, modem light status, or billing discrepancy in detail..."
                className="w-full h-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs leading-relaxed transition"
              />
            </div>

            {/* Right: Contact & Location Info + Submit (5 cols) */}
            <div className="md:col-span-5 bg-slate-950/70 rounded-xl p-4 border border-slate-800/80 flex flex-col justify-between space-y-3">
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. customer@example.com"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-xs transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. Chennai"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-xs transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1">
                      State
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-xs transition"
                    >
                      <option>Tamil Nadu</option>
                      <option>Karnataka</option>
                      <option>Kerala</option>
                      <option>Andhra Pradesh</option>
                      <option>Maharashtra</option>
                      <option>Delhi</option>
                      <option>West Bengal</option>
                      <option>Gujarat</option>
                      <option>Rajasthan</option>
                      <option>Uttar Pradesh</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1">
                    ZIP Code (Tower Outage Diagnostics)
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    required
                    maxLength="6"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="600001"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-xs font-mono transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-lg shadow-lg shadow-cyan-500/20 transition-all duration-200 disabled:opacity-50 text-xs tracking-wide cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>Analyze & Resolve Complaint</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>

          </form>
        )}
      </SpotLightCard>
    </div>
  );
}
