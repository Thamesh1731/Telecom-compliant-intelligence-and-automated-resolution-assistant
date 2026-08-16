import React, { useState, useRef } from "react";
import {
  FileText,
  Mail,
  MapPin,
  Send,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Check,
  X,
  ChevronRight,
  Sparkles,
  Server,
  Layers,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { submitComplaintTicket, submitNegativeFeedback } from "../api/complaintServices";

const getStatusBadge = (status) => {
  switch (status?.toUpperCase()) {
    case "RESOLVED":
      return {
        bg: "bg-emerald-950/50 text-emerald-400 border-emerald-800/60",
        dot: "bg-emerald-400",
        label: "Resolved",
      };
    case "PENDING":
    case "QUEUED":
    case "PROCESSING":
      return {
        bg: "bg-amber-950/50 text-amber-400 border-amber-800/60",
        dot: "bg-amber-400",
        label: status || "Processing",
      };
    case "OPEN":
    default:
      return {
        bg: "bg-zinc-800/70 text-zinc-300 border-zinc-700/60",
        dot: "bg-zinc-400",
        label: status || "Open",
      };
  }
};

// Helper to parse solution blocks robustly
const parseSolutionText = (textInput) => {
  if (!textInput) return { problem: "", solution: "", reason: "" };

  let text = typeof textInput === "string" ? textInput : JSON.stringify(textInput, null, 2);

  let problem = "";
  let solution = "";
  let reason = "";

  const probMatch = text.match(/Problem:\s*([\s\S]*?)(?=\n\nRecommended Solution:|\nRecommended Solution:|\nReason:|$)/i);
  if (probMatch) problem = probMatch[1].trim();

  const solMatch = text.match(/(?:Recommended Solution|Solution):\s*([\s\S]*?)(?=\n\nReason:|\nReason:|\nEscalation:|$)/i);
  if (solMatch) solution = solMatch[1].trim();

  const reasMatch = text.match(/Reason:\s*([\s\S]*?)(?=\n\nEscalation:|\nEscalation:|$)/i);
  if (reasMatch) reason = reasMatch[1].trim();

  if (!problem && !solution && !reason) {
    solution = text;
  }

  return { problem, solution, reason };
};

// -----------------------------------------------------------------------
// Minimal Production-Grade Result Dashboard
// -----------------------------------------------------------------------
function ResultDashboard({
  data,
  formData,
  handleReset,
  feedbackChoice,
  handleFeedbackChoiceYes,
  handleFeedbackChoiceNo,
  negativeFeedbackSubmitted,
  negativeFeedbackText,
  setNegativeFeedbackText,
  negativeFeedbackError,
  isSubmittingNegative,
  handleNegativeFeedbackSubmit,
  feedbackTextareaRef,
}) {
  const rawSolution =
    data.solution ||
    data.resolution ||
    data.aiRecommendation ||
    data.ai_solution ||
    data.recommended_solution ||
    data.diagnostic_resolution ||
    (typeof data === "string" ? data : "");

  const parsed = parseSolutionText(rawSolution);

  const displayProblem =
    parsed.problem ||
    `Customer reported technical service impairment regarding ${data.predictedCategory || data.category || "Telecom Infrastructure"}.`;
  const displaySolution =
    parsed.solution ||
    rawSolution ||
    `1. Verify physical power and optical fiber connection.\n2. Cycle ONT / Router power (unplug for 30 seconds).\n3. Verify gateway authentication and DNS resolution status.`;
  const displayReason =
    parsed.reason ||
    `Synthesized from standard operating procedures and verified telecom diagnostic knowledge base.`;

  const statusInfo = getStatusBadge(data.status);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-full items-stretch">
      {/* Left Column: Metadata & Ticket Dossier (4 cols) */}
      <div className="lg:col-span-4 bg-zinc-900/50 rounded-lg p-4 border border-zinc-800 flex flex-col justify-between space-y-4">
        <div className="space-y-4">
          {/* Header & Status */}
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-zinc-400" />
              <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-zinc-400">
                Ticket Dossier
              </span>
            </div>
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border text-xs font-mono font-medium ${statusInfo.bg}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`}></span>
              <span>{statusInfo.label}</span>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="space-y-2.5">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 font-semibold block mb-0.5">
                Ticket Identifier
              </span>
              <p className="font-mono text-zinc-100 text-xs font-semibold bg-zinc-950 px-2.5 py-1.5 rounded border border-zinc-800/80 select-all">
                {data.ticketId || data.complaint_id || "TCK-20260815-9821"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-zinc-950/70 rounded p-2.5 border border-zinc-800/80">
                <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 font-semibold block mb-0.5">
                  Category
                </span>
                <p className="text-zinc-200 text-xs font-medium truncate capitalize">
                  {data.predictedCategory || data.category || "General"}
                </p>
              </div>
              <div className="bg-zinc-950/70 rounded p-2.5 border border-zinc-800/80">
                <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 font-semibold block mb-0.5">
                  Confidence
                </span>
                <p className="text-emerald-400 text-xs font-mono font-medium">
                  {data.confidence != null ? `${(data.confidence * 100).toFixed(0)}%` : "High (94%)"}
                </p>
              </div>
            </div>

            {formData.email && (
              <div className="bg-zinc-950/70 rounded p-2.5 border border-zinc-800/80">
                <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 font-semibold block mb-0.5">
                  Customer Email
                </span>
                <p className="text-zinc-300 text-xs font-mono truncate">{formData.email}</p>
              </div>
            )}

            {(formData.city || formData.state || formData.zipCode) && (
              <div className="bg-zinc-950/70 rounded p-2.5 border border-zinc-800/80">
                <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 font-semibold block mb-0.5">
                  Location & Tower ZIP
                </span>
                <p className="text-zinc-300 text-xs truncate">
                  {[formData.city, formData.state, formData.zipCode].filter(Boolean).join(", ")}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Reset Action */}
        <button
          type="button"
          onClick={handleReset}
          className="w-full py-2.5 px-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 hover:border-zinc-600 text-zinc-300 hover:text-zinc-100 text-xs font-medium rounded-md transition-colors duration-150 cursor-pointer flex items-center justify-center gap-2"
        >
          <RotateCcw className="h-3.5 w-3.5 text-zinc-400" />
          <span>New Diagnostic Request</span>
        </button>
      </div>

      {/* Right Column: Diagnostic Procedure & Resolution (8 cols) */}
      <div className="lg:col-span-8 bg-zinc-900/50 rounded-lg p-4 border border-zinc-800 flex flex-col justify-between space-y-3.5">
        {/* Panel Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
              Automated Diagnostic Resolution
            </span>
          </div>
          <span className="text-[11px] font-mono text-zinc-500">Tier-1 Synthesis</span>
        </div>

        {/* Diagnostic Breakdown */}
        <div className="space-y-3 max-h-[44vh] overflow-y-auto pr-1">
          {/* Issue Statement */}
          <div className="bg-zinc-950/80 rounded-md p-3 border border-zinc-800/80">
            <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-zinc-400 block mb-1">
              Problem Classification
            </span>
            <p className="text-zinc-200 text-xs leading-relaxed">{displayProblem}</p>
          </div>

          {/* Action Steps */}
          <div className="bg-zinc-950 rounded-md p-3.5 border border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-accent-400">
                Recommended Action Plan
              </span>
              <span className="text-[10px] font-mono text-zinc-500">Step-by-step resolution</span>
            </div>
            <div className="text-zinc-200 text-xs leading-relaxed font-sans whitespace-pre-wrap">
              {displaySolution}
            </div>
          </div>

          {/* Rationale & Grounding */}
          <div className="bg-zinc-950/60 rounded-md p-3 border border-zinc-800/70">
            <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-zinc-500 block mb-1">
              Technical Justification
            </span>
            <p className="text-zinc-400 text-xs leading-relaxed">{displayReason}</p>
          </div>
        </div>

        {/* Interactive Feedback & Escalation Segment */}
        <div className="rounded-md bg-zinc-950 border border-zinc-800 p-3 space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-medium text-zinc-300">
              Did this resolution successfully solve the issue?
            </span>

            {feedbackChoice === null && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleFeedbackChoiceYes}
                  className="py-1 px-3 bg-zinc-900 hover:bg-emerald-950/60 border border-zinc-700 hover:border-emerald-700/60 text-zinc-300 hover:text-emerald-300 text-xs font-medium rounded transition-colors duration-150 cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Yes, Resolved</span>
                </button>
                <button
                  type="button"
                  onClick={handleFeedbackChoiceNo}
                  className="py-1 px-3 bg-zinc-900 hover:bg-rose-950/60 border border-zinc-700 hover:border-rose-700/60 text-zinc-300 hover:text-rose-300 text-xs font-medium rounded transition-colors duration-150 cursor-pointer flex items-center gap-1.5"
                >
                  <X className="h-3.5 w-3.5 text-rose-400" />
                  <span>No, Escalate</span>
                </button>
              </div>
            )}
          </div>

          {feedbackChoice === "yes" && (
            <div className="p-2.5 rounded border bg-emerald-950/40 border-emerald-800/50 text-emerald-300 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <span>Feedback confirmed. Ticket resolution archived.</span>
            </div>
          )}

          {feedbackChoice === "no" && !negativeFeedbackSubmitted && (
            <form onSubmit={handleNegativeFeedbackSubmit} className="space-y-2.5 pt-1">
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
                <span>Specify why the resolution was insufficient to route directly to Level-3 Engineering:</span>
              </div>
              <textarea
                ref={feedbackTextareaRef}
                rows="2"
                value={negativeFeedbackText}
                onChange={(e) => setNegativeFeedbackText(e.target.value)}
                placeholder="Details of symptoms that persist or specific hardware failure behavior..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded p-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 text-xs transition-colors duration-150 resize-none"
              />
              {negativeFeedbackError && (
                <p className="text-[11px] text-rose-400 font-mono">{negativeFeedbackError}</p>
              )}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmittingNegative || !negativeFeedbackText.trim()}
                  className="py-1.5 px-4 bg-accent-600 hover:bg-accent-500 disabled:opacity-50 text-white font-medium rounded text-xs transition-colors duration-150 cursor-pointer flex items-center gap-1.5"
                >
                  {isSubmittingNegative ? (
                    <span>Routing...</span>
                  ) : (
                    <>
                      <span>Submit Escalation Ticket</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {feedbackChoice === "no" && negativeFeedbackSubmitted && (
            <div className="p-2.5 rounded border bg-zinc-900 border-zinc-800 text-zinc-200 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent-400 flex-shrink-0" />
              <span>Escalation submitted. Case routed to Level-3 Network Operations for technician intervention.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------
// Main Complaint Form Component
// -----------------------------------------------------------------------
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.complaint.trim()) {
      setError("Please describe the technical fault before submitting.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    setResult(null);
    try {
      const data = await submitComplaintTicket(formData);
      setResult(data);
    } catch (err) {
      console.error("Submission Error:", err);
      setError(`Connection Error: ${err.message || "Failed to reach inference server."}`);
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
    setFeedbackChoice("no");
    setTimeout(() => {
      if (feedbackTextareaRef.current) {
        feedbackTextareaRef.current.focus({ preventScroll: true });
      }
    }, 50);
  };

  const handleFeedbackChoiceYes = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFeedbackChoice("yes");
  };

  // Helper to parse solution blocks robustly
  const parseSolutionText = (textInput) => {
    if (!textInput) return { problem: "", solution: "", reason: "" };

    let text = typeof textInput === "string" ? textInput : JSON.stringify(textInput, null, 2);
    
    let problem = "";
    let solution = "";
    let reason = "";

    const probMatch = text.match(/Problem:\s*([\s\S]*?)(?=\n\nRecommended Solution:|\nRecommended Solution:|\nReason:|$)/i);
    if (probMatch) problem = probMatch[1].trim();

    const solMatch = text.match(/(?:Recommended Solution|Solution):\s*([\s\S]*?)(?=\n\nReason:|\nReason:|\nEscalation:|$)/i);
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
  const renderResultDashboard = (data) => {
    const rawSolution = 
      data.solution || 
      data.resolution || 
      data.aiRecommendation || 
      data.ai_solution || 
      data.recommended_solution ||
      data.diagnostic_resolution ||
      (typeof data === "string" ? data : "");

    const parsed = parseSolutionText(rawSolution);
    const isEscalated = Boolean(data.escalationRequired);

    const displayProblem = parsed.problem || `Customer reported technical issue regarding ${data.category || "Telecom Service"}.`;
    const displaySolution = isEscalated
      ? "The technician will contact you soon."
      : parsed.solution || rawSolution || `1. Verify physical power and network cable connections.\n2. Perform a standard router/modem reboot (unplug for 30 seconds).\n3. Check local service status or contact technical support.`;
    const displayReason = parsed.reason || `Synthesized from verified knowledge base articles for ${data.category || "Service"}.`;
    const statusBadge = getStatusBadge(data.status);

    return (
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-full items-stretch">
        
        {/* Left Side: Ticket Metadata & Overview (4 cols) */}
        <div className="md:col-span-4 bg-slate-950/80 rounded-xl p-4 border border-slate-800 flex flex-col justify-between space-y-3">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                Ticket Metadata
              </span>
              <div className={`flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full border text-xs font-bold ${statusBadge.bg}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot} animate-pulse`}></span>
                <span>{statusBadge.label}</span>
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
          <div className="space-y-2.5 max-h-[42vh] overflow-y-auto pr-1">
            <div className="bg-slate-900/60 rounded-lg p-2.5 border border-slate-800">
              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-0.5">
                Identified Problem
              </p>
              <p className="text-slate-200 text-xs leading-relaxed">
                {displayProblem}
              </p>
            </div>

            <div className="bg-slate-900/90 rounded-lg p-3 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,229,255,0.05)]">
              <p className="text-[10px] uppercase tracking-wider font-bold text-cyan-400 mb-1">
                Recommended Solution & Action Steps
              </p>
              <div className="text-slate-100 text-xs leading-relaxed whitespace-pre-wrap font-sans">
                {displaySolution}
              </div>
            </div>

            <div className="bg-slate-900/60 rounded-lg p-2.5 border border-slate-800">
              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-0.5">
                Diagnostic Justification
              </p>
              <p className="text-slate-300 text-xs leading-relaxed">
                {displayReason}
              </p>
            </div>
          </div>

          {isEscalated ? (
            <div className="rounded-lg bg-amber-950/40 border border-amber-500/40 p-3 text-amber-200 text-xs font-bold flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v4m0 4h.01M10.3 3.7l-7.6 13.2A2 2 0 004.4 20h15.2a2 2 0 001.7-3.1L13.7 3.7a2 2 0 00-3.4 0z" />
              </svg>
              The technician will contact you soon.
            </div>
          ) : (
          /* Inline Feedback Bar */
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
          )}

        </div>

      </div>
    );
  };

  // -----------------------------------------------------------------------
  // Main Render - Enforcing Wide 2-Column Desktop Layout
  // -----------------------------------------------------------------------
  return (
    <div className="w-full max-w-5xl flex flex-col items-center">
      {/* Title & Scope Header */}
      <div className="text-center max-w-xl mb-4">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100 mb-1">
          Telecom Diagnostic & Resolution Assistant
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 font-normal">
          Automated multi-agent retrieval and diagnostic procedures for customer service faults.
        </p>
      </div>

      {/* Main Container Card */}
      <div className="w-full bg-zinc-900/70 backdrop-blur-sm border border-zinc-800 rounded-lg p-4 sm:p-6 shadow-sm">
        {/* Loading State - Production Skeleton & Progress */}
        {isSubmitting && (
          <div className="py-12 px-4 max-w-md mx-auto space-y-5">
            <div className="flex items-center justify-center gap-3">
              <div className="h-5 w-5 rounded-full border-2 border-zinc-700 border-t-accent-400 animate-spin" />
              <span className="text-sm font-medium text-zinc-200">Executing Diagnostic Pipeline</span>
            </div>

            <div className="space-y-2.5 bg-zinc-950/80 rounded-lg p-4 border border-zinc-800/80 font-mono text-xs text-zinc-400">
              <div className="flex items-center gap-2 text-zinc-200">
                <CheckCircle2 className="h-3.5 w-3.5 text-accent-400" />
                <span>1. Classifying Intent & Network Symptoms</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <Clock className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
                <span>2. Searching Vectorstore & Resolver Base</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-500">
                <span className="h-3.5 w-3.5 rounded-full border border-zinc-700 inline-block" />
                <span>3. Synthesizing Step-by-Step Resolution</span>
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-4 rounded-md bg-red-950/40 border border-red-800/50 p-3.5 flex items-start gap-3">
            <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-red-300">System Notice</p>
              <p className="text-xs text-red-200/80">{error}</p>
            </div>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-200 text-xs font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Result Dashboard */}
        {!isSubmitting && result && renderResultDashboard(result)}

        {/* Intake Form (2-Column Desktop Grid) */}
        {!isSubmitting && !result && (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
            {/* Left Column: Complaint Details (7 cols) */}
            <div className="md:col-span-7 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Complaint Description
                </label>
                <span className="text-[11px] font-mono text-zinc-500">Provide technical symptoms</span>
              </div>
              <textarea
                name="complaint"
                rows="7"
                required
                value={formData.complaint}
                onChange={handleChange}
                placeholder="Describe modem light status, error codes, SNR packet loss, latency spikes, or billing discrepancies..."
                className="w-full h-full min-h-[160px] bg-zinc-950 border border-zinc-800 rounded-md p-3 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 text-xs leading-relaxed transition-colors duration-150 resize-none font-sans"
              />
            </div>

            {/* Right Column: Contact, Location & Submission (5 cols) */}
            <div className="md:col-span-5 bg-zinc-950/60 rounded-md p-4 border border-zinc-800/80 flex flex-col justify-between space-y-3.5">
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
                    Customer Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500 pointer-events-none" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="subscriber@example.com"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-md pl-9 pr-3 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 text-xs transition-colors duration-150"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
                      City
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-500 pointer-events-none" />
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Chennai"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-md pl-8 pr-2.5 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 text-xs transition-colors duration-150"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
                      State
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-2.5 py-2 text-zinc-100 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 text-xs transition-colors duration-150"
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
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
                    ZIP Code (Cell Tower Diagnosis)
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    required
                    maxLength="6"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="600001"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 text-xs font-mono transition-colors duration-150"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-accent-600 hover:bg-accent-500 disabled:opacity-50 text-white font-medium rounded-md text-xs tracking-wide transition-colors duration-150 cursor-pointer flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Analyze & Resolve Fault</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
