/**
 * AGENT PORTAL - TELECOM AI COMPLAINT TRIAGE SYSTEM
 * Logic & Interactive Drawer / Queue Management
 */

// Escalated Complaints array (Populated from backend API / real escalation requests)
let tickets = [];

// Active ticket state & current navigation filters
let activeTicketId = null;
let currentTab = 'all-escalated';
let currentSearchQuery = '';
let currentEscalationFilter = 'all';
let negativeFeedbackItems = [];
let activeNegFeedbackId = null;

// Authorized Admin Personnel Registry (Loaded from admin_credentials.json with fallback)
let authorizedPersonnel = [
  {
    username: "Telecom",
    hash: "d894288549e34aba1a611a9819213b491cee8ae2fb6c464a9bfcf8a4e6b0b123",
    name: "System Administrator",
    role: "Operations Director (L4)",
    id: "#ADM-0001"
  }
];

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

  // Auto-refresh queue every 3 seconds so new escalations and negative feedback appear live
  setInterval(() => {
    const isDrawerOpen = document.getElementById('ticket-detail-drawer')?.classList.contains('active');
    const isModalOpen = document.getElementById('neg-feedback-modal')?.classList.contains('active');
    if (!isDrawerOpen && !isModalOpen) {
      fetchTicketsFromBackend(true);
      fetchNegativeFeedback(true);
    }
  }, 3000);
}

async function fetchTicketsFromBackend(isSilent = false) {
  try {
    const res = await fetch('/api/admin/tickets');
    if (res.ok) {
      const data = await res.json();
      if (data.tickets && Array.isArray(data.tickets)) {
        tickets = data.tickets;
      }
    }
  } catch (err) {
    if (!isSilent) console.log('No backend tickets loaded yet:', err);
  }
  renderAllEscalatedTable();
  updateMetricsUI();
}

async function fetchNegativeFeedback(isSilent = false) {
  try {
    const res = await fetch('/api/admin/negative-feedback');
    if (res.ok) {
      const data = await res.json();
      if (data.items && Array.isArray(data.items)) {
        negativeFeedbackItems = data.items;
      }
    }
  } catch (err) {
    if (!isSilent) console.log('No negative feedback loaded yet:', err);
  }
  renderNegativeFeedbackTable();
  updateNegFeedbackBadge();
}

function updateNegFeedbackBadge() {
  const count = negativeFeedbackItems.filter(i => i.status === 'pending').length || negativeFeedbackItems.length;
  const badge = document.getElementById('nav-neg-feedback-count');
  if (badge) badge.innerText = count;

  const heroNeg = document.getElementById('hero-neg-feedback');
  if (heroNeg) heroNeg.innerText = count;
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
  const activeTickets = tickets.filter(t => t.status === 'ESCALATED' || t.status === 'OPEN');
  const totalAssigned = activeTickets.length;

  const badge = document.getElementById('nav-escalated-total');
  if (badge) badge.innerText = totalAssigned;

  const heroActive = document.getElementById('hero-active-escalations');
  if (heroActive) heroActive.innerText = totalAssigned;

  const metricAssigned = document.getElementById('metric-assigned');
  if (metricAssigned) metricAssigned.innerText = totalAssigned;
  const metricEscalated = document.getElementById('metric-escalated');
  if (metricEscalated) metricEscalated.innerText = totalAssigned;
}

function formatCategoryName(cat) {
  if (!cat || cat === 'General') return 'Account / Subscription';
  const clean = String(cat).trim();
  const map = {
    'internet': 'Internet / Broadband',
    'broadband': 'Internet / Broadband',
    'cable_tv': 'Cable TV',
    'cable': 'Cable TV',
    'number_calling': 'Number / Calling',
    'calling': 'Number / Calling',
    'number_porting': 'Number Porting',
    'porting': 'Number Porting',
    'account_subscription': 'Account / Subscription',
    'subscription': 'Account / Subscription',
    'coverage_outage': 'Coverage & Outage',
    'outage': 'Coverage & Outage',
    'network': 'Network / Coverage',
    'installation_technician': 'Technician & Installation',
    'technician': 'Technician & Installation',
    'security_fraud': 'Security & Fraud',
    'fraud': 'Security & Fraud',
    'device_handset': 'Device / Handset',
    'device': 'Device / Handset',
    'billing': 'Billing / Account',
    'payment': 'Billing & Payment',
    'roaming': 'Roaming & International',
    'sim': 'SIM / Mobile Service'
  };
  if (map[clean.toLowerCase()]) return map[clean.toLowerCase()];
  return clean.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function getCategoryIcon(cat) {
  const c = String(cat || '').toLowerCase();
  if (c.includes('internet') || c.includes('broadband') || c.includes('wifi')) return 'fa-wifi';
  if (c.includes('tv') || c.includes('cable')) return 'fa-tv';
  if (c.includes('call') || c.includes('voice')) return 'fa-phone-volume';
  if (c.includes('port')) return 'fa-arrow-right-arrow-left';
  if (c.includes('bill') || c.includes('account') || c.includes('subscri')) return 'fa-file-invoice-dollar';
  if (c.includes('cover') || c.includes('outage') || c.includes('network')) return 'fa-tower-cell';
  if (c.includes('tech') || c.includes('install')) return 'fa-screwdriver-wrench';
  if (c.includes('sec') || c.includes('fraud')) return 'fa-shield-halved';
  if (c.includes('device') || c.includes('phone') || c.includes('handset')) return 'fa-mobile-screen';
  return 'fa-tags';
}

function getFilteredTickets(activeOnly = false) {
  let filtered = activeOnly
    ? tickets.filter(t => t.status === 'ESCALATED' || t.status === 'OPEN')
    : [...tickets];

  if (currentEscalationFilter === 'escalated') {
    filtered = filtered.filter(t => t.status === 'ESCALATED' || t.status === 'OPEN');
  } else if (currentEscalationFilter === 'resolved') {
    filtered = filtered.filter(t => t.status === 'RESOLVED');
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
  if (!tbody) return;
  tbody.innerHTML = '';

  const activeTickets = getFilteredTickets(true);

  if (activeTickets.length === 0) {
    const hasOpenTickets = tickets.some(t => t.status === 'ESCALATED' || t.status === 'OPEN');
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
    const firstReason = (t.whyEscalated && t.whyEscalated[0]) ? t.whyEscalated[0] : 'Low AI Confidence';
    const customerName = t.customer || t.customerEmail || 'Customer Submission';
    const categoryName = formatCategoryName(t.category || t.predictedCategory);

    tr.innerHTML = `
      <td><span class="ticket-id">${escapeHtml(t.id)}</span></td>
      <td>
        <span class="customer-name">${escapeHtml(customerName)}</span>
        <span class="customer-sub">${escapeHtml(t.tier || 'Residential / Business')}</span>
      </td>
      <td>
        <span class="category-badge"><i class="fa-solid ${getCategoryIcon(categoryName)}"></i> ${escapeHtml(categoryName)}</span>
      </td>
      <td>${priorityBadge}</td>
      <td>${riskMeter}</td>
      <td><span class="reason-pill" title="${escapeHtml(firstReason)}">${escapeHtml(firstReason)}</span></td>
      <td>
        <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); openTicketDetail('${escapeHtml(t.id)}')">
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
  if (!tbody) return;
  tbody.innerHTML = '';

  const filteredTickets = getFilteredTickets(false);
  if (filteredTickets.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="padding: 0;">
      <div class="empty-state-card">
        <img src="assets/no-results.png" class="empty-state-img" alt="No Escalations">
        <div class="empty-state-title">No Active Escalations</div>
        <div class="empty-state-subtitle">All customer complaints are resolved or autonomously handled by AI triage.</div>
      </div>
    </td></tr>`;
    return;
  }

  filteredTickets.forEach(t => {
    const tr = document.createElement('tr');
    tr.onclick = () => openTicketDetail(t.id);

    const isResolved = t.status === 'RESOLVED';
    const customerName = t.customer || t.customerEmail || 'Customer Submission';
    const accountId = t.accountId || (t.id ? `#ACC-${t.id.replace(/\D/g, '').slice(-5) || '10293'}` : '#ACC-10293');
    const categoryName = formatCategoryName(t.category || t.predictedCategory);
    const reasonText = (t.whyEscalated && t.whyEscalated[0]) ? t.whyEscalated[0] : (t.escalationReason || 'Automated Escalation');

    tr.innerHTML = `
      <td><span class="ticket-id">${escapeHtml(t.id)}</span></td>
      <td>
        <span class="customer-name">${escapeHtml(customerName)}</span>
        <span class="customer-sub">${escapeHtml(accountId)}</span>
      </td>
      <td>
        <span class="category-badge"><i class="fa-solid ${getCategoryIcon(categoryName)}"></i> ${escapeHtml(categoryName)}</span>
      </td>
      <td><span class="reason-pill" title="${escapeHtml(reasonText)}">${escapeHtml(reasonText)}</span></td>
      <td>
        <span class="badge ${isResolved ? 'badge-low' : 'badge-high'}">
          ${escapeHtml(t.status || 'OPEN')}
        </span>
      </td>
      <td>
        <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); openTicketDetail('${escapeHtml(t.id)}')">
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
  const issueTitleEl = document.getElementById('drawer-issue-title');
  if (issueTitleEl) issueTitleEl.innerText = ticket.issueSummary || ticket.complaintText || 'Escalated Complaint';
  document.getElementById('drawer-customer-name').innerText = ticket.customer || ticket.customerEmail || 'Customer Submission';
  document.getElementById('drawer-customer-email').innerText = ticket.customerEmail || 'Not provided';
  document.getElementById('drawer-complaint-text').innerText = ticket.complaintText || 'No complaint text provided.';

  const reasonsList = document.getElementById('drawer-escalation-reasons');
  reasonsList.innerHTML = '';
  const reasons = (ticket.whyEscalated && ticket.whyEscalated.length > 0) ? ticket.whyEscalated : ['Automated Exception Triggered'];
  reasons.forEach(r => {
    const li = document.createElement('li');
    li.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> <span>${escapeHtml(r)}</span>`;
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
      sessionStorage.setItem('signalcx_active_tab', tabId);
      const targetTab = document.getElementById(`tab-${tabId}`);
      if (targetTab) targetTab.classList.add('active');

      // Update Page Headers
      if (tabId === 'all-escalated') {
        document.getElementById('page-title').innerText = 'All System Escalations';
        document.getElementById('page-subtitle').innerText = 'Full registry of automated exception triage cases';
      } else if (tabId === 'negative-feedback') {
        document.getElementById('page-title').innerText = 'Negative Feedback Queue';
        document.getElementById('page-subtitle').innerText = 'Customer-reported resolution failures awaiting technician review';
        fetchNegativeFeedback();
      }
    });
  });

  // Top Header Refresh Button
  const topRefreshBtn = document.getElementById('refresh-btn');
  if (topRefreshBtn) {
    topRefreshBtn.addEventListener('click', () => {
      showToast('Refreshing queue...', 'info');
      fetchTicketsFromBackend();
      fetchNegativeFeedback();
    });
  }

  // Restore active tab after refresh
  const savedTab = sessionStorage.getItem('signalcx_active_tab');
  if (savedTab) {
    const savedBtn = document.querySelector(`.nav-btn[data-tab="${savedTab}"]`);
    if (savedBtn) savedBtn.click();
  }

  // Drawer Close Button & Overlay
  document.getElementById('close-drawer-btn').addEventListener('click', closeTicketDrawer);
  document.getElementById('drawer-overlay').addEventListener('click', closeTicketDrawer);

  // Quick Metric Card Filters
  document.querySelectorAll('.metric-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelector('[data-tab="all-escalated"]').click();
    });
  });

  // View All Queue Button on Dashboard (if present)
  const viewAllBtn = document.getElementById('view-all-queue-btn');
  if (viewAllBtn) {
    viewAllBtn.addEventListener('click', () => {
      document.querySelector('[data-tab="all-escalated"]').click();
    });
  }

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
    tbody.innerHTML = `<tr><td colspan="5" style="padding: 0;">
      <div class="empty-state-card">
        <img src="assets/no-results.png" class="empty-state-img" alt="No Feedback Exceptions">
        <div class="empty-state-title">No Negative Feedback Pending</div>
        <div class="empty-state-subtitle">100% of customer resolutions are accepted. Zero unresolved exceptions waiting for review.</div>
      </div>
    </td></tr>`;
    return;
  }

  negativeFeedbackItems.forEach(item => {
    const tr = document.createElement('tr');
    tr.style.cursor = 'pointer';
    tr.onclick = () => openNegativeFeedbackDetail(item.feedback_id);

    const complaintText = item.complaint && item.complaint.length > 70
      ? item.complaint.substring(0, 70) + '...'
      : (item.complaint || 'N/A');
    const solutionText = item.ai_solution && item.ai_solution.length > 70
      ? item.ai_solution.substring(0, 70) + '...'
      : (item.ai_solution || 'N/A');
    const feedbackText = item.feedback && item.feedback.length > 70
      ? item.feedback.substring(0, 70) + '...'
      : (item.feedback || 'N/A');

    tr.innerHTML = `
      <td><span class="ticket-id">${escapeHtml(item.feedback_id)}</span></td>
      <td><span class="reason-pill" title="${escapeHtml(item.complaint)}">${escapeHtml(complaintText)}</span></td>
      <td><span class="reason-pill" title="${escapeHtml(item.ai_solution)}">${escapeHtml(solutionText)}</span></td>
      <td><span class="reason-pill" style="color: #f87171;" title="${escapeHtml(item.feedback)}">${escapeHtml(feedbackText)}</span></td>
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
