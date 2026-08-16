/**
 * AGENT PORTAL - TELECOM AI COMPLAINT TRIAGE SYSTEM
 * Logic & Interactive Drawer / Queue Management
 */

// Escalated Complaints array (Populated from backend API / real escalation requests)
let tickets = [];

// Active ticket state & current navigation filters
let activeTicketId = null;
let currentTab = 'dashboard';
let currentSearchQuery = '';
let currentEscalationFilter = 'all';
let negativeFeedbackItems = [];
let activeNegFeedbackId = null;

// Authorized Admin Personnel Registry (Loaded from admin_credentials.json)
let authorizedPersonnel = [];

async function loadCredentials() {
  try {
    const res = await fetch('admin_credentials.json');
    if (res.ok) {
      authorizedPersonnel = await res.json();
    }
  } catch (err) {
    console.error('Failed to load credentials:', err);
  }
}

async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);                    
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

let activeAdmin = null;

function formatUsernameToName(str) {
  if (!str) return 'Admin User';
  const clean = str.trim().toLowerCase();
  if (clean === 'admin') return 'System Administrator';
  return clean
    .split(/[\._\-\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// DOM Elements Initialization
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

async function initApp() {
  await loadCredentials();
  setupAuthEventListeners();
  const session = checkAuthSession();

  if (session) {
    activeAdmin = session;
    unlockPortal(session);
  } else {
    lockPortal();
  }

  fetchTicketsFromBackend();
  fetchNegativeFeedback();
  setupEventListeners();
}

async function fetchTicketsFromBackend() {
  try {
    const res = await fetch('/api/admin/tickets');
    if (res.ok) {
      const data = await res.json();
      if (data.tickets && Array.isArray(data.tickets) && data.tickets.length > 0) {
        tickets = data.tickets;
      }
    }
  } catch (err) {
    console.log('No backend tickets loaded yet:', err);
  }
  renderDashboardTable();
  renderAllEscalatedTable();
  updateMetricsUI();
}

async function fetchNegativeFeedback() {
  try {
    const res = await fetch('/api/admin/negative-feedback');
    if (res.ok) {
      const data = await res.json();
      if (data.items && Array.isArray(data.items)) {
        negativeFeedbackItems = data.items;
      }
    }
  } catch (err) {
    console.log('No negative feedback loaded yet:', err);
  }
  renderNegativeFeedbackTable();
  updateNegFeedbackBadge();
}

function updateNegFeedbackBadge() {
  const count = negativeFeedbackItems.length;
  const badge = document.getElementById('nav-neg-feedback-count');
  if (badge) badge.innerText = count;
}

/**
 * Auth Session Management
 */
function checkAuthSession() {
  try {
    const saved = localStorage.getItem('nexus_admin_session');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Session read error:', e);
  }
  return null;
}

function unlockPortal(sessionData) {
  const overlay = document.getElementById('admin-login-overlay');
  const container = document.getElementById('app-container');

  if (overlay) overlay.classList.add('hidden');
  if (container) container.classList.remove('locked');

  updateSidebarProfile(sessionData);

  // Sync ticket assigned agent to active user if logged in
  if (sessionData && tickets) {
    tickets.forEach(t => {
      t.assignedTo = `${sessionData.name} (${sessionData.id})`;
    });
  }
}

function lockPortal() {
  const overlay = document.getElementById('admin-login-overlay');
  const container = document.getElementById('app-container');

  if (overlay) overlay.classList.remove('hidden');
  if (container) container.classList.add('locked');
}

function updateSidebarProfile(admin) {
  if (!admin) return;

  const nameEl = document.getElementById('sidebar-agent-name');
  const roleEl = document.getElementById('sidebar-agent-role');
  const idEl = document.getElementById('sidebar-agent-id');

  if (nameEl) nameEl.innerText = admin.name || formatUsernameToName(admin.username);
  if (roleEl) roleEl.innerText = admin.role || 'System Administrator';
  if (idEl) idEl.innerText = `ID: ${admin.id || '#AGT-8824'}`;
}

function setupAuthEventListeners() {
  // Password Visibility Toggle
  const toggleBtn = document.getElementById('toggle-password-btn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const pwdInput = document.getElementById('admin-password');
      const eyeIcon = document.getElementById('password-eye-icon');
      if (pwdInput.type === 'password') {
        pwdInput.type = 'text';
        eyeIcon.className = 'fa-solid fa-eye-slash';
      } else {
        pwdInput.type = 'password';
        eyeIcon.className = 'fa-solid fa-eye';
      }
    });
  }

  // Login Form Submit with Permission Checking
  const loginForm = document.getElementById('admin-login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const usernameInput = document.getElementById('admin-username').value.trim();
      const passwordInput = document.getElementById('admin-password').value.trim();
      const feedback = document.getElementById('login-feedback');
      const submitBtn = document.getElementById('login-submit-btn');
      const btnText = document.getElementById('login-btn-text');

      if (!usernameInput || !passwordInput) {
        feedback.className = 'login-feedback error';
        feedback.innerText = '✕ Please enter both username and password';
        return;
      }

      const hashedPass = await sha256(passwordInput);

      // Check credentials strictly against authorized personnel registry
      const matchedAccount = authorizedPersonnel.find(a => 
        a.username.toLowerCase() === usernameInput.toLowerCase() && 
        a.hash === hashedPass
      );

      // Trigger Cyber Scanning visual
      submitBtn.classList.add('authenticating');
      btnText.innerText = 'VERIFYING PERMISSIONS & CLEARANCE...';
      feedback.className = 'login-feedback';
      feedback.innerText = '';

      setTimeout(() => {
        submitBtn.classList.remove('authenticating');
        btnText.innerText = 'AUTHENTICATE SYSTEM ACCESS';

        if (matchedAccount) {
          const session = {
            username: matchedAccount.username,
            name: matchedAccount.name,
            role: matchedAccount.role,
            id: matchedAccount.id
          };

          activeAdmin = session;
          localStorage.setItem('nexus_admin_session', JSON.stringify(session));

          feedback.className = 'login-feedback success';
          feedback.innerText = `✓ PERMISSION VERIFIED • WELCOME ${session.name.toUpperCase()}`;

          setTimeout(() => {
            unlockPortal(session);
            refreshAllViews();
            showToast(`Permission Granted: ${session.name} (${session.role}) logged in`, 'success');
          }, 400);

        } else {
          feedback.className = 'login-feedback error';
          feedback.innerText = '✕ ACCESS DENIED: User does not have portal permission or password invalid';
        }
      }, 700);
    });
  }

  // Logout Button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      activeAdmin = null;
      localStorage.removeItem('nexus_admin_session');
      lockPortal();
      showToast('Admin session logged out successfully', 'info');

      // Clear password field for security
      document.getElementById('admin-password').value = '';
      const feedback = document.getElementById('login-feedback');
      feedback.className = 'login-feedback';
      feedback.innerText = '';
    });
  }
}

/**
 * Update Metric Cards & Badge Counters
 */
function updateMetricsUI() {
  const activeTickets = tickets.filter(t => t.status === 'ESCALATED');
  
  const totalAssigned = activeTickets.length;
  const highPriority = activeTickets.filter(t => t.priority === 'HIGH').length;
  const medPriority = activeTickets.filter(t => t.priority === 'MEDIUM').length;
  const lowPriority = activeTickets.filter(t => t.priority === 'LOW').length;
  
  // Aging defined as > 2 hours
  const agingCount = activeTickets.filter(t => {
    const hours = parseInt(t.aging.split('h')[0]) || 0;
    return hours >= 2;
  }).length;

  // DOM Updates
  document.getElementById('metric-assigned').innerText = totalAssigned;
  document.getElementById('metric-high').innerText = highPriority;
  document.getElementById('metric-escalated').innerText = totalAssigned;
  document.getElementById('metric-aging').innerText = agingCount;

  document.getElementById('dash-escalated-count').innerText = totalAssigned;
  document.getElementById('nav-escalated-total').innerText = totalAssigned;
}

function getFilteredTickets(activeOnly = false) {
  let filtered = activeOnly
    ? tickets.filter(t => t.status === 'ESCALATED')
    : [...tickets];

  if (currentEscalationFilter === 'low-confidence') {
    filtered = filtered.filter(t => t.riskScore < 85 || JSON.stringify(t.whyEscalated || []).toLowerCase().includes('confidence'));
  } else if (currentEscalationFilter === 'repeat') {
    filtered = filtered.filter(t => JSON.stringify(t.whyEscalated || []).toLowerCase().includes('repeat'));
  } else if (currentEscalationFilter === 'high-risk') {
    filtered = filtered.filter(t => Number(t.riskScore) >= 90);
  }

  if (currentSearchQuery) {
    filtered = filtered.filter(t => JSON.stringify(t).toLowerCase().includes(currentSearchQuery));
  }

  return filtered;
}

/**
 * Render Dashboard Escalated Complaints Table
 */
function renderDashboardTable() {
  const tbody = document.getElementById('dashboard-tickets-body');
  tbody.innerHTML = '';

  const activeTickets = getFilteredTickets(true);

  if (activeTickets.length === 0) {
    const hasOpenTickets = tickets.some(t => t.status === 'ESCALATED');
    const message = hasOpenTickets
      ? 'No open escalations match the current filters.'
      : 'No open escalations. Technician workload is clear.';
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 32px; color: var(--text-muted);">${message}</td></tr>`;
    return;
  }

  activeTickets.forEach(t => {
    const tr = document.createElement('tr');
    tr.onclick = () => openTicketDetail(t.id);

    const priorityBadge = getPriorityBadgeHtml(t.priority);
    const riskMeter = getRiskMeterHtml(t.riskScore);
    const firstReason = t.whyEscalated[0] || 'Low AI Confidence';

    tr.innerHTML = `
      <td><span class="ticket-id">${t.id}</span></td>
      <td>
        <span class="customer-name">${escapeHtml(t.customer)}</span>
        <span class="customer-sub">${t.tier}</span>
      </td>
      <td>
        <span class="category-badge"><i class="fa-solid ${getCategoryIcon(t.category)}"></i> ${t.category}</span>
      </td>
      <td>${priorityBadge}</td>
      <td>${riskMeter}</td>
      <td><span class="reason-pill" title="${escapeHtml(firstReason)}">${escapeHtml(firstReason)}</span></td>
      <td>
        <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); openTicketDetail('${t.id}')">
          <i class="fa-solid fa-folder-open"></i> Review Context
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

/**
 * Render All Escalated Table
 */
function renderAllEscalatedTable() {
  const tbody = document.getElementById('all-escalated-body');
  tbody.innerHTML = '';

  const filteredTickets = getFilteredTickets(false);
  if (filteredTickets.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 32px; color: var(--text-muted);">No complaints match the current filters.</td></tr>`;
    return;
  }

  filteredTickets.forEach(t => {
    const tr = document.createElement('tr');
    tr.onclick = () => openTicketDetail(t.id);

    const isResolved = t.status === 'RESOLVED';

    tr.innerHTML = `
      <td><span class="ticket-id">${t.id}</span></td>
      <td>
        <span class="customer-name">${escapeHtml(t.customer)}</span>
        <span class="customer-sub">${t.accountId}</span>
      </td>
      <td><span class="category-badge">${t.category}</span></td>
      <td>${getPriorityBadgeHtml(t.priority)}</td>
      <td>${getRiskMeterHtml(t.riskScore)}</td>
      <td><span class="reason-pill">${escapeHtml(t.whyEscalated[0])}</span></td>
      <td>
        <span class="badge ${isResolved ? 'badge-low' : 'badge-high'}">
          ${t.status}
        </span>
      </td>
      <td>
        <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); openTicketDetail('${t.id}')">
          View Details
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

/**
 * Slide-Over Ticket Drawer Details Inspector
 */
function openTicketDetail(ticketId) {
  const ticket = tickets.find(t => t.id === ticketId);
  if (!ticket) return;

  activeTicketId = ticket.id;
  document.getElementById('drawer-ticket-id').innerText = ticket.id;
  document.getElementById('drawer-issue-title').innerText = ticket.issueSummary;
  document.getElementById('drawer-priority-badge').className = `badge ${getPriorityBadgeClass(ticket.priority)}`;
  document.getElementById('drawer-priority-badge').innerText = `${ticket.priority} PRIORITY`;
  document.getElementById('drawer-risk-badge').innerText = `RISK: ${ticket.riskScore}%`;
  document.getElementById('drawer-customer-name').innerText = ticket.customer;
  document.getElementById('drawer-customer-email').innerText = ticket.customerEmail || 'Not provided';
  document.getElementById('drawer-complaint-text').innerText = `"${ticket.complaintText}"`;
  const reasonsList = document.getElementById('drawer-escalation-reasons');
  reasonsList.innerHTML = '';
  (ticket.whyEscalated || ['Technician review required']).forEach(r => {
    const li = document.createElement('li');
    li.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${escapeHtml(r)}`;
    reasonsList.appendChild(li);
  });
  document.getElementById('drawer-technician-response').value = '';
  document.getElementById('drawer-overlay').classList.add('active');
  document.getElementById('ticket-detail-drawer').classList.add('active');
}

function closeTicketDrawer() {
  document.getElementById('drawer-overlay').classList.remove('active');
  document.getElementById('ticket-detail-drawer').classList.remove('active');
  activeTicketId = null;
}

/**
 * Event Listeners & Interactions
 */
function setupEventListeners() {
  // Navigation Tabs
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));

      btn.classList.add('active');
      const tabId = btn.getAttribute('data-tab');
      currentTab = tabId;
      document.getElementById(`tab-${tabId}`).classList.add('active');

      // Update Page Headers
      if (tabId === 'dashboard') {
        document.getElementById('page-title').innerText = 'Agent Dashboard';
        document.getElementById('page-subtitle').innerText = 'Immediate view of complaints requiring human intelligence';
      } else if (tabId === 'all-escalated') {
        document.getElementById('page-title').innerText = 'All System Escalations';
        document.getElementById('page-subtitle').innerText = 'Full registry of automated exception triage cases';
      } else if (tabId === 'negative-feedback') {
        document.getElementById('page-title').innerText = 'Negative Feedback Queue';
        document.getElementById('page-subtitle').innerText = 'Customer-reported resolution failures awaiting technician review';
        fetchNegativeFeedback();
      }
    });
  });

  // Drawer Close Button & Overlay
  document.getElementById('close-drawer-btn').addEventListener('click', closeTicketDrawer);
  document.getElementById('drawer-overlay').addEventListener('click', closeTicketDrawer);

  // Quick Metric Card Filters
  document.querySelectorAll('.metric-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelector('[data-tab="all-escalated"]').click();
    });
  });

  // View All Queue Button on Dashboard
  document.getElementById('view-all-queue-btn').addEventListener('click', () => {
    document.querySelector('[data-tab="all-escalated"]').click();
  });

  // Escalation filter chips
  document.querySelectorAll('.chip-filters .chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.chip-filters .chip').forEach(item => item.classList.remove('active'));
      chip.classList.add('active');
      currentEscalationFilter = chip.dataset.filter || 'all';
      renderDashboardTable();
      renderAllEscalatedTable();
    });
  });

  document.getElementById('drawer-send-resolution-btn').addEventListener('click', async () => {
    if (!activeTicketId) return;
    const responseBox = document.getElementById('drawer-technician-response');
    const sendButton = document.getElementById('drawer-send-resolution-btn');
    const responseText = responseBox.value.trim();
    if (!responseText || sendButton.disabled) return;

    sendButton.disabled = true;
    const originalButtonHtml = sendButton.innerHTML;
    sendButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i><span>Sending...</span>';
    try {
      const response = await fetch('/api/admin/resolve-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticket_id: activeTicketId, resolved_solution: responseText })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        showToast(data.detail || 'Failed to send technician response.', 'danger');
        return;
      }
      showToast(data.message, data.email_status === 'sent' ? 'success' : 'warning');
      closeTicketDrawer();
      refreshAllViews();
    } catch (error) {
      showToast('Network error sending technician response.', 'danger');
    } finally {
      sendButton.disabled = false;
      sendButton.innerHTML = originalButtonHtml;
    }
  });

  // Global Search Filter
  document.getElementById('global-search').addEventListener('input', (e) => {
    currentSearchQuery = e.target.value.trim().toLowerCase();
    renderDashboardTable();
    renderAllEscalatedTable();
  });

  // Refresh Button
  document.getElementById('refresh-btn').addEventListener('click', () => {
    showToast('Queue refreshed from AI Triage Engine', 'info');
    refreshAllViews();
  });
}

function refreshAllViews() {
  fetchTicketsFromBackend();
  fetchNegativeFeedback();
}

/**
 * UI Helper Utilities
 */
function getPriorityBadgeHtml(priority) {
  const pClass = getPriorityBadgeClass(priority);
  return `<span class="badge ${pClass}"><i class="fa-solid fa-shield-halved"></i> ${priority}</span>`;
}

function getPriorityBadgeClass(priority) {
  if (priority === 'HIGH') return 'badge-high';
  if (priority === 'MEDIUM') return 'badge-medium';
  return 'badge-low';
}

function getRiskMeterHtml(score) {
  let colorClass = 'critical';
  if (score < 80) colorClass = 'moderate';
  if (score < 70) colorClass = 'low';

  return `
    <div class="risk-meter">
      <span class="risk-val ${colorClass}">${score}%</span>
      <div class="risk-bar-container">
        <div class="risk-bar-fill ${colorClass}" style="width: ${score}%"></div>
      </div>
    </div>
  `;
}

function getCategoryIcon(cat) {
  switch (cat) {
    case 'Network': return 'fa-wifi';
    case 'Billing': return 'fa-file-invoice-dollar';
    case 'Service': return 'fa-gears';
    case 'Hardware': return 'fa-microchip';
    default: return 'fa-triangle-exclamation';
  }
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = 'fa-info-circle';
  if (type === 'success') icon = 'fa-circle-check';
  if (type === 'warning') icon = 'fa-triangle-exclamation';
  if (type === 'danger') icon = 'fa-circle-xmark';

  toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}


// ====================================================================
// NEGATIVE FEEDBACK MODULE
// ====================================================================

function renderNegativeFeedbackTable() {
  const tbody = document.getElementById('neg-feedback-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (negativeFeedbackItems.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 24px; color: var(--text-muted);">No negative feedback items pending. All resolutions accepted by customers!</td></tr>`;
    return;
  }

  negativeFeedbackItems.forEach(item => {
    const tr = document.createElement('tr');
    tr.style.cursor = 'pointer';
    tr.onclick = () => openNegativeFeedbackDetail(item.feedback_id);

    const categoryText = item.category || 'General';
    const complaintPreview = item.complaint && item.complaint.length > 50
      ? item.complaint.substring(0, 50) + '...'
      : (item.complaint || 'N/A');
    const solutionPreview = item.ai_solution && item.ai_solution.length > 50
      ? item.ai_solution.substring(0, 50) + '...'
      : (item.ai_solution || 'N/A');
    const feedbackPreview = item.feedback && item.feedback.length > 50
      ? item.feedback.substring(0, 50) + '...'
      : (item.feedback || 'N/A');

    const submittedDate = item.submitted_at
      ? new Date(item.submitted_at).toLocaleString()
      : 'Unknown';

    tr.innerHTML = `
      <td><span class="ticket-id">${escapeHtml(item.feedback_id)}</span></td>
      <td><span class="category-badge"><i class="fa-solid ${getCategoryIcon(categoryText)}"></i> ${escapeHtml(categoryText)}</span></td>
      <td><span class="reason-pill" title="${escapeHtml(item.complaint)}">${escapeHtml(complaintPreview)}</span></td>
      <td><span class="reason-pill" title="${escapeHtml(item.ai_solution)}">${escapeHtml(solutionPreview)}</span></td>
      <td><span class="reason-pill" style="color: #f87171;" title="${escapeHtml(item.feedback)}">${escapeHtml(feedbackPreview)}</span></td>
      <td><span class="badge badge-subtle"><i class="fa-solid fa-clock"></i> ${escapeHtml(submittedDate)}</span></td>
      <td>
        <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); openNegativeFeedbackDetail('${escapeHtml(item.feedback_id)}')">
          <i class="fa-solid fa-wrench"></i> Review & Resolve
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openNegativeFeedbackDetail(feedbackId) {
  const item = negativeFeedbackItems.find(i => i.feedback_id === feedbackId);
  if (!item) return;

  activeNegFeedbackId = feedbackId;

  const categoryText = item.category || 'General';
  const subcategoryText = item.subcategory ? `Subcategory: ${item.subcategory}` : '';

  document.getElementById('neg-modal-title').innerText = `Review: ${feedbackId}`;
  
  const catEl = document.getElementById('neg-modal-category');
  if (catEl) {
    catEl.innerHTML = `<i class="fa-solid ${getCategoryIcon(categoryText)}"></i> ${escapeHtml(categoryText)}`;
  }
  const subcatEl = document.getElementById('neg-modal-subcategory-badge');
  if (subcatEl) {
    subcatEl.innerText = subcategoryText;
  }

  document.getElementById('neg-modal-complaint').innerText = item.complaint || 'N/A';
  document.getElementById('neg-modal-ai-solution').innerText = item.ai_solution || 'N/A';
  document.getElementById('neg-modal-feedback').innerText = item.feedback || 'N/A';
  document.getElementById('neg-modal-solution-text').value = '';

  document.getElementById('neg-feedback-modal').classList.add('active');
}

function closeNegFeedbackModal() {
  document.getElementById('neg-feedback-modal').classList.remove('active');
  activeNegFeedbackId = null;
}

async function submitResolvedSolution() {
  if (!activeNegFeedbackId) return;

  const submitBtn = document.getElementById('neg-modal-submit-btn');
  if (submitBtn?.disabled) return;

  const solutionText = document.getElementById('neg-modal-solution-text').value.trim();
  if (!solutionText) {
    showToast('Please enter the correct resolution before submitting.', 'warning');
    return;
  }

  const originalButtonHtml = submitBtn ? submitBtn.innerHTML : '';
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';
  }

  try {
    const res = await fetch('/api/admin/resolve-feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        feedback_id: activeNegFeedbackId,
        resolved_solution: solutionText
      })
    });

    if (res.ok) {
      showToast(`Feedback ${activeNegFeedbackId} resolved and stored in resolver base.`, 'success');
      // Remove from local list
      negativeFeedbackItems = negativeFeedbackItems.filter(i => i.feedback_id !== activeNegFeedbackId);
      closeNegFeedbackModal();
      renderNegativeFeedbackTable();
      updateNegFeedbackBadge();
    } else {
      const errData = await res.json().catch(() => ({}));
      showToast(errData.detail || 'Failed to submit resolution.', 'danger');
    }
  } catch (err) {
    showToast('Network error submitting resolution.', 'danger');
  } finally {
    if (submitBtn && document.getElementById('neg-feedback-modal')?.classList.contains('active')) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalButtonHtml;
    }
  }
}

// Wire up negative feedback modal events after DOM load
document.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.getElementById('close-neg-modal-btn');
  const cancelBtn = document.getElementById('neg-modal-cancel-btn');
  const submitBtn = document.getElementById('neg-modal-submit-btn');
  const refreshBtn = document.getElementById('refresh-neg-feedback-btn');

  if (closeBtn) closeBtn.addEventListener('click', closeNegFeedbackModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeNegFeedbackModal);
  if (submitBtn) submitBtn.addEventListener('click', submitResolvedSolution);
  if (refreshBtn) refreshBtn.addEventListener('click', () => {
    showToast('Refreshing negative feedback queue...', 'info');
    fetchNegativeFeedback();
  });
});
