import React, { useState } from "react";
import BlurText from "../../../components/BlurText";
import SpotLightCard from "../../../components/SpotLightCard";
import { submitComplaintTicket, getComplaintStatus, submitNegativeFeedback } from "../api/complaintServices";

export default function ComplaintForm() {
  const [formData, setFormData] = useState({
    complaint: "",
    city: "",
    state: "Tamil Nadu",
    zipCode: "",
    filingOnBehalf: "No",
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

  const getStatusStyles = (status) => {
    switch (status) {
      case "Open":
        return "text-amber-400 bg-amber-900/30 border-amber-500/50 shadow-[0_0_10px_rgba(251,191,36,0.15)]";
      case "Pending":
        return "text-cyan-400 bg-cyan-900/30 border-cyan-500/50 shadow-[0_0_10px_rgba(34,211,238,0.15)]";
      case "Resolved":
        return "text-emerald-400 bg-emerald-900/30 border-emerald-500/50 shadow-[0_0_10px_rgba(52,211,153,0.15)]";
      case "Closed":
        return "text-slate-400 bg-slate-800/50 border-slate-600/50 shadow-[0_0_10px_rgba(148,163,184,0.15)]";
      case "QUEUED":
      case "PROCESSING":
        return "text-cyan-400 bg-cyan-900/30 border-cyan-500/50 shadow-[0_0_10px_rgba(34,211,238,0.15)]";
      case "FAILED":
        return "text-red-400 bg-red-900/30 border-red-500/50 shadow-[0_0_10px_rgba(248,113,113,0.15)]";
      default:
        return "text-slate-400 bg-slate-800/50 border-slate-600/50";
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

  const handleReset = () => {
    setResult(null);
    setError(null);
    setFeedbackChoice(null);
    setNegativeFeedbackText("");
    setNegativeFeedbackSubmitted(false);
    setNegativeFeedbackError(null);
    setFormData({
      complaint: "",
      city: "",
      state: "Tamil Nadu",
      zipCode: "",
      filingOnBehalf: "No",
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
      });
      setNegativeFeedbackSubmitted(true);
    } catch (err) {
      setNegativeFeedbackError(err.message || "Failed to submit feedback.");
    } finally {
      setIsSubmittingNegative(false);
    }
  };

  // -----------------------------------------------------------------------
  // Result panel shown after successful API response
  // -----------------------------------------------------------------------
  const ResultPanel = ({ data }) => (
    <div className="space-y-5">
      {/* Ticket Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-1">
            Ticket ID
          </p>
          <p className="font-mono text-cyan-300 text-sm font-bold">{data.ticketId}</p>
        </div>
        <div
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border backdrop-blur-md self-start ${getStatusStyles(
            data.status
          )}`}
        >
          <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
          <span className="text-xs font-bold tracking-wide">{data.status}</span>
        </div>
      </div>

      {/* Category + Confidence */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
          <p className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-1">
            Category
          </p>
          <p className="text-slate-200 text-sm font-medium">
            {data.predictedCategory || data.category || "Unknown"}
          </p>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
          <p className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-1">
            Confidence
          </p>
          <p className="text-slate-200 text-sm font-medium">
            {data.confidence != null
              ? `${(data.confidence * 100).toFixed(1)}%`
              : "—"}
          </p>
        </div>
      </div>

      {/* AI Resolution */}
      {data.resolution && (
        <div className="rounded-xl bg-slate-800/50 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,229,255,0.1)] p-4">
          <div className="flex items-center space-x-2 mb-3">
            <svg
              className="w-4 h-4 text-cyan-400 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span className="text-xs uppercase tracking-wider font-bold text-cyan-400">
              AI Resolution
            </span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
            {data.resolution}
          </p>
        </div>
      )}

      {/* Customer Resolution Feedback Module */}
      {(data.resolution || data.solution) && (
      <div className="rounded-xl bg-slate-900/90 border border-slate-700/60 p-4 space-y-3 shadow-lg">
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span className="text-xs uppercase tracking-wider font-bold text-cyan-400">
            Did this solution solve your problem?
          </span>
        </div>

        {/* YES → Thank you */}
        {feedbackChoice === 'yes' && (
          <div className="p-3 rounded-lg border bg-emerald-950/40 border-emerald-500/50 text-emerald-300 text-sm font-semibold flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Thank you for your feedback!
          </div>
        )}

        {/* NO → Feedback textarea + submit */}
        {feedbackChoice === 'no' && !negativeFeedbackSubmitted && (
          <form onSubmit={handleNegativeFeedbackSubmit} className="space-y-3">
            <p className="text-xs text-slate-400">
              We're sorry the solution didn't work. Please describe what went wrong so our technical team can review and provide a correct resolution.
            </p>
            <textarea
              rows="3"
              value={negativeFeedbackText}
              onChange={(e) => setNegativeFeedbackText(e.target.value)}
              placeholder="Please describe what went wrong or what the actual issue is..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-xs transition"
            />

            {negativeFeedbackError && (
              <p className="text-xs text-red-400">{negativeFeedbackError}</p>
            )}

            <button
              type="submit"
              disabled={isSubmittingNegative || !negativeFeedbackText.trim()}
              className="w-full py-2.5 px-4 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold rounded-lg text-xs transition cursor-pointer"
            >
              {isSubmittingNegative ? "Submitting..." : "Submit Feedback"}
            </button>
          </form>
        )}

        {/* NO → Submitted confirmation */}
        {feedbackChoice === 'no' && negativeFeedbackSubmitted && (
          <div className="p-3 rounded-lg border bg-cyan-950/40 border-cyan-500/50 text-cyan-300 text-sm font-semibold flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Your feedback has been sent to our technical team for review.
          </div>
        )}

        {/* Initial Yes / No buttons */}
        {feedbackChoice === null && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setFeedbackChoice('yes')}
              className="flex-1 py-2.5 px-4 bg-emerald-950/50 hover:bg-emerald-900/70 border border-emerald-500/40 text-emerald-300 font-bold rounded-lg text-sm transition cursor-pointer flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Yes
            </button>
            <button
              type="button"
              onClick={() => setFeedbackChoice('no')}
              className="flex-1 py-2.5 px-4 bg-rose-950/50 hover:bg-rose-900/70 border border-rose-500/40 text-rose-300 font-bold rounded-lg text-sm transition cursor-pointer flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              No
            </button>
          </div>
        )}
      </div>
      )}

      {/* Escalation */}
      {data.escalationRequired && (
        <div className="rounded-xl bg-red-950/40 border border-red-500/40 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <svg
              className="w-4 h-4 text-red-400 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span className="text-xs uppercase tracking-wider font-bold text-red-400">
              Escalation Required
            </span>
          </div>
          {data.escalationReason && (
            <p className="text-xs text-red-300/80 leading-relaxed">
              {data.escalationReason}
            </p>
          )}
        </div>
      )}

      {/* Retrieved Knowledge Metadata */}
      {data.retrievedSections && data.retrievedSections.length > 0 && (
        <div className="rounded-xl bg-slate-800/30 border border-slate-700/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <svg
                className="w-4 h-4 text-slate-400 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
                Retrieved Knowledge
              </span>
            </div>
            <span className="text-xs text-slate-500">
              {data.retrievedCount} chunk{data.retrievedCount !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="space-y-2">
            {[
              ...new Map(
                data.retrievedSections.map((s) => [s.document_id, s])
              ).values(),
            ].map((section, i) => (
              <div
                key={i}
                className="flex items-start justify-between text-xs py-1.5 border-b border-slate-700/30 last:border-0"
              >
                <div>
                  <span className="font-mono text-cyan-500/80">
                    {section.document_id}
                  </span>
                  {section.document_title && (
                    <span className="text-slate-400 ml-2">
                      — {section.document_title}
                    </span>
                  )}
                </div>
                {section.final_score != null && (
                  <span className="text-slate-600 ml-2 flex-shrink-0">
                    {(section.final_score * 100).toFixed(0)}%
                  </span>
                )}
              </div>
            ))}
          </div>
          {data.isAmbiguous && (
            <p className="mt-2 text-xs text-amber-400/70 italic">
              ⚠ Query was ambiguous — multiple documents contributed to this resolution.
            </p>
          )}
        </div>
      )}

      <button
        onClick={handleReset}
        className="w-full py-3 px-4 border border-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer"
      >
        Submit Another Complaint
      </button>
    </div>
  );

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-transparent text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 font-sans">
      {/* Header */}
      <div className="text-center max-w-2xl mb-8 flex flex-col items-center">
        <BlurText
          text="Telecom Complaint Intelligence"
          delay={100}
          animateBy="words"
          direction="top"
          className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 text-slate-100 justify-center"
        />
        <BlurText
          text="Automated multi-agent routing and diagnostic resolution assistant"
          delay={120}
          animateBy="words"
          direction="top"
          className="text-slate-400 text-sm sm:text-base justify-center"
        />
      </div>

      {/* Card */}
      <SpotLightCard
        className="w-full max-w-xl bg-slate-900/90 backdrop-blur-md border border-slate-800 shadow-2xl p-6 sm:p-8 relative overflow-hidden !bg-slate-900"
        spotlightColor="rgba(0, 229, 255, 0.15)"
      >
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Loading */}
        {isSubmitting && (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20"></div>
              <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin"></div>
            </div>
            <p className="text-sm text-slate-400 animate-pulse">
              Analyzing via Multi-Agent RAG System...
            </p>
            <p className="text-xs text-slate-600">
              Classifying → Retrieving → Generating Resolution
            </p>
          </div>
        )}

        {/* Error */}
        {!isSubmitting && error && (
          <div className="space-y-4">
            <div className="rounded-xl bg-red-950/40 border border-red-500/40 p-4">
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
                  <p className="text-sm font-semibold text-red-300 mb-1">Error</p>
                  <p className="text-sm text-red-300/80">{error}</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="w-full py-3 px-4 border border-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Result */}
        {!isSubmitting && !error && result && <ResultPanel data={result} />}

        {/* Form */}
        {!isSubmitting && !error && !result && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">
                Complaint Description
              </label>
              <textarea
                name="complaint"
                rows="3"
                required
                value={formData.complaint}
                onChange={handleChange}
                placeholder="Describe your issue (e.g. My internet has been down since yesterday)"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Chennai"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm transition"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">
                  State
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm transition"
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
              <label className="block text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">
                ZIP Code (For Tower Outage Diagnostics)
              </label>
              <input
                type="text"
                name="zipCode"
                required
                maxLength="6"
                value={formData.zipCode}
                onChange={handleChange}
                placeholder="e.g. 600001"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm font-mono transition"
              />
            </div>

            <div className="pt-2">
              <label className="block text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">
                Filing on behalf of someone?
              </label>
              <div className="flex items-center space-x-6 text-sm text-slate-300">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="filingOnBehalf"
                    value="Yes"
                    checked={formData.filingOnBehalf === "Yes"}
                    onChange={handleChange}
                    className="text-cyan-500 focus:ring-cyan-500 bg-slate-950 border-slate-800"
                  />
                  <span>Yes</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="filingOnBehalf"
                    value="No"
                    checked={formData.filingOnBehalf === "No"}
                    onChange={handleChange}
                    className="text-cyan-500 focus:ring-cyan-500 bg-slate-950 border-slate-800"
                  />
                  <span>No</span>
                </label>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-lg shadow-lg shadow-cyan-500/20 transition-all duration-200 disabled:opacity-50 text-sm tracking-wide cursor-pointer"
              >
                Submit Complaint
              </button>
            </div>
          </form>
        )}
      </SpotLightCard>
    </div>
  );
}
