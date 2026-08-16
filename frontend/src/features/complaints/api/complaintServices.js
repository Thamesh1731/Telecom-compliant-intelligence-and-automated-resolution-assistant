/**
 * complaintServices.js
 * Submits a complaint to the FastAPI backend for AI-powered resolution.
 * Uses VITE_API_BASE_URL from the frontend .env file.
 */

const getApiBaseUrl = () => {
  if (typeof window === "undefined") return "http://54.91.159.187:8000";
  const host = window.location.hostname;
  if (host.includes("s3-website")) {
    return "http://54.91.159.187:8000";
  }
  if (host.includes("cloudfront.net")) {
    return "";
  }
  return import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
};

const API_BASE_URL = getApiBaseUrl();

/**
 * Submit a complaint ticket to the backend RAG pipeline.
 *
 * @param {Object} formData - { complaint, city, state, zipCode, filingOnBehalf }
 * @returns {Promise<Object>} - Structured response from the backend
 */
export const submitComplaintTicket = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/api/complaints`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    let errorDetail = "An error occurred while processing your complaint.";
    try {
      const errorData = await response.json();
      errorDetail = errorData.detail || errorDetail;
    } catch {
      // Ignore JSON parse errors on error responses
    }
    throw new Error(errorDetail);
  }

  return response.json();
};

/**
 * Submit negative feedback when the AI solution did not resolve the issue.
 *
 * @param {Object} data - { complaint_id, complaint, ai_solution, feedback, email }
 * @returns {Promise<Object>} - Confirmation from backend
 */
export const submitNegativeFeedback = async (data) => {
  const response = await fetch(`${API_BASE_URL}/api/negative-feedback`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorDetail = "An error occurred while submitting feedback.";
    try {
      const errorData = await response.json();
      errorDetail = errorData.detail || errorDetail;
    } catch {
      // Ignore parse errors
    }
    throw new Error(errorDetail);
  }

  return response.json();
};