import React, { useState } from 'react';
import BlurText from '../../../components/BlurText';
import SpotLightCard from '../../../components/SpotLightCard';
import { submitComplaintTicket } from '../api/complaintServices';

export default function ComplaintForm() {
  const [formData, setFormData] = useState({
    complaint: '',
    city: '',
    state: 'Tamil Nadu',
    zipCode: '',
    filingOnBehalf: 'No',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [complaintStatus, setComplaintStatus] = useState('Open');

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Open':
        return 'text-amber-400 bg-amber-900/30 border-amber-500/50 shadow-[0_0_10px_rgba(251,191,36,0.15)]';
      case 'Pending':
        return 'text-cyan-400 bg-cyan-900/30 border-cyan-500/50 shadow-[0_0_10px_rgba(34,211,238,0.15)]';
      case 'Resolved':
        return 'text-emerald-400 bg-emerald-900/30 border-emerald-500/50 shadow-[0_0_10px_rgba(52,211,153,0.15)]';
      case 'Closed':
        return 'text-slate-400 bg-slate-800/50 border-slate-600/50 shadow-[0_0_10px_rgba(148,163,184,0.15)]';
      default:
        return 'text-slate-400 bg-slate-800/50 border-slate-600/50';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitComplaintTicket(formData);
      setSubmitted(true);
      setComplaintStatus('Pending');
      setAiResponse("AI Diagnostic Agent: Analyzing network telemetry... Tower 4A indicates a localized disruption. ETA for resolution: 2 hours.");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 font-sans">

      {/* Header featuring BlurText */}
      <div className="text-center max-w-2xl mb-8 flex flex-col items-center">
        <BlurText
          text="Telecom Complaint Intelligence"
          delay={100}
          animateBy="words"
          direction="top"
          className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 text-slate-100 justify-center"
        />

        <BlurText
          text="Automated multi-agent routing & diagnostic resolution assistant"
          delay={120}
          animateBy="words"
          direction="top"
          className="text-slate-400 text-sm sm:text-base justify-center"
        />
      </div>

      {/* SpotLight Card Wrapper */}
      <SpotLightCard
        className="w-full max-w-xl bg-slate-900/90 backdrop-blur-md border border-slate-800 shadow-2xl p-6 sm:p-8 relative overflow-hidden !bg-slate-900"
        spotlightColor="rgba(0, 229, 255, 0.15)"
      >
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {(submitted || aiResponse) && (
          <div className="mb-6 p-4 rounded-xl bg-slate-800/50 border border-cyan-500/50 shadow-[0_0_15px_rgba(0,229,255,0.15)] flex items-start space-x-3 backdrop-blur-md">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-cyan-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="text-sm text-cyan-50 leading-relaxed font-medium">
              {aiResponse}
            </div>
          </div>
        )}

        {complaintStatus !== 'Open' && (
          <div className="flex items-center mb-6">
            <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider mr-3">Ticket Status:</span>
            <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border backdrop-blur-md transition-all duration-300 ${getStatusStyles(complaintStatus)}`}>
              <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
              <span className="text-sm font-bold tracking-wide">{complaintStatus}</span>
            </div>
          </div>
        )}

        {submitted ? (
          <div className="bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 p-6 rounded-xl text-center space-y-3">
            <h3 className="text-lg font-bold">Ticket Submitted Successfully!</h3>
            <p className="text-sm text-emerald-400/80">
              Your issue has been logged. Our multi-agent diagnostic tool is evaluating network status for ZIP: <span className="font-mono underline">{formData.zipCode}</span>.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setAiResponse(null);
                setComplaintStatus('Open');
                setFormData({
                  complaint: '',
                  city: '',
                  state: 'Tamil Nadu',
                  zipCode: '',
                  filingOnBehalf: 'No',
                });
              }}
              className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition"
            >
              Submit Another Complaint
            </button>
          </div>
        ) : (
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
                placeholder="Describe your issue (e.g., My internet has been down since yesterday...)"
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
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
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
                    checked={formData.filingOnBehalf === 'Yes'}
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
                    checked={formData.filingOnBehalf === 'No'}
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
                {isSubmitting ? 'Analyzing via Multi-Agent System...' : 'Submit Complaint'}
              </button>
            </div>
          </form>
        )}
      </SpotLightCard>
    </div>
  );
}