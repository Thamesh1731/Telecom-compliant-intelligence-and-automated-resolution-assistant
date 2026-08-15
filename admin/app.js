/**
 * AGENT PORTAL - TELECOM AI COMPLAINT TRIAGE SYSTEM
 * Logic & Interactive Drawer / Queue Management
 */

// Escalated Complaints array (Populated from backend API / real escalation requests)
let tickets = [];

// Active ticket state & current navigation filters
let activeTicketId = null;
let currentTab = 'dashboard';
let currentFilterPriority = 'all';
let negativeFeedbackItems = [];
let activeNegFeedbackId = null;

// Authorized Admin Personnel Registry (Only users with permission can enter)
const AUTHORIZED_PERSONNEL = [
  { username: 'admin', pass: 'admin', name: 'System Administrator', role: 'Operations Director (L4)', id: '#ADM-0001' },
  { username: 'sarah.connor', pass: 'nexus2026', name: 'Sarah Connor', role: 'L2 Senior Resolution Agent', id: '#AGT-8824' },
  { username: 'alex.mercer', pass: 'nexus2026', name: 'Alex Mercer', role: 'L3 System Administrator', id: '#SYS-9901' },
  { username: 'elena.vance', pass: 'nexus2026', name: 'Elena Vance', role: 'Tier 3 Incident Manager', id: '#AGT-4102' },
  { username: 'marcus.wright', pass: 'nexus2026', name: 'Marcus Wright', role: 'L2 Resolution Agent', id: '#AGT-5510' }
];

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

function initApp() {
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
  renderMyQueueTable();
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
    loginForm.addEventListener('submit', (e) => {
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

      // Check credentials strictly against authorized personnel registry
      const matchedAccount = AUTHORIZED_PERSONNEL.find(a => 
        a.username.toLowerCase() === usernameInput.toLowerCase() && 
        a.pass === passwordInput
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
  document.getElementById('nav-queue-count').innerText = totalAssigned;
  document.getElementById('nav-escalated-total').innerText = totalAssigned;

  // Queue Tree Numbers
  document.getElementById('queue-tree-total').innerText = totalAssigned;
  document.getElementById('queue-tree-high').innerText = highPriority;
  document.getElementById('queue-tree-med').innerText = medPriority;
  document.getElementById('queue-tree-low').innerText = lowPriority;
}

/**
 * Render Dashboard Escalated Complaints Table
 */
function renderDashboardTable() {
  const tbody = document.getElementById('dashboard-tickets-body');
  tbody.innerHTML = '';

  const activeTickets = tickets.filter(t => t.status === 'ESCALATED');

  if (activeTickets.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 24px; color: var(--text-muted);">🎉 All escalated exceptions resolved! Zero pending items in queue.</td></tr>`;
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
 * Render My Queue Table
 */
function renderMyQueueTable() {
  const tbody = document.getElementById('my-queue-body');
  tbody.innerHTML = '';

  let filtered = tickets.filter(t => t.status === 'ESCALATED');

  if (currentFilterPriority !== 'all') {
    filtered = filtered.filter(t => t.priority === currentFilterPriority.toUpperCase());
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 24px; color: var(--text-muted);">No tickets matching filter criteria.</td></tr>`;
    return;
  }

  filtered.forEach(t => {
    const tr = document.createElement('tr');
    tr.onclick = () => openTicketDetail(t.id);

    tr.innerHTML = `
      <td><span class="ticket-id">${t.id}</span></td>
      <td>
        <span class="customer-name">${escapeHtml(t.customer)}</span>
        <span class="customer-sub">${t.location}</span>
      </td>
      <td><span class="category-badge"><i class="fa-solid ${getCategoryIcon(t.category)}"></i> ${t.category}</span></td>
      <td>${getPriorityBadgeHtml(t.priority)}</td>
      <td>${getRiskMeterHtml(t.riskScore)}</td>
      <td><span class="badge badge-subtle"><i class="fa-solid fa-clock"></i> ${t.aging}</span></td>
      <td><span class="reason-pill">${escapeHtml(t.issueSummary)}</span></td>
      <td>
        <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); openTicketDetail('${t.id}')">
          Handle Exception
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

  tickets.forEach(t => {
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

  // Header
  document.getElementById('drawer-ticket-id').innerText = ticket.id;
  document.getElementById('drawer-issue-title').innerText = ticket.issueSummary;
  document.getElementById('drawer-priority-badge').className = `badge ${getPriorityBadgeClass(ticket.priority)}`;
  document.getElementById('drawer-priority-badge').innerText = `${ticket.priority} PRIORITY`;
  document.getElementById('drawer-risk-badge').innerText = `RISK: ${ticket.riskScore}%`;

  // Customer Card
  document.getElementById('drawer-customer-name').innerText = ticket.customer;
  document.getElementById('drawer-account-id').innerText = ticket.accountId;
  document.getElementById('drawer-customer-tier').innerText = ticket.tier;
  document.getElementById('drawer-customer-location').innerText = ticket.location;
  document.getElementById('drawer-complaint-text').innerText = `"${ticket.complaintText}"`;

  // AI Analysis Grid
  document.getElementById('drawer-category').innerText = ticket.category;
  document.getElementById('drawer-sentiment').innerText = ticket.sentiment;
  document.getElementById('drawer-priority').innerText = ticket.priority;
  document.getElementById('drawer-risk').innerText = `${ticket.riskScore}%`;

  // Why Escalated List
  const reasonsList = document.getElementById('drawer-escalation-reasons');
  reasonsList.innerHTML = '';
  ticket.whyEscalated.forEach(r => {
    const li = document.createElement('li');
    li.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${escapeHtml(r)}`;
    reasonsList.appendChild(li);
  });

  // AI Summary & Recommendation
  document.getElementById('drawer-ai-summary').innerText = ticket.aiSummary;
  document.getElementById('drawer-ai-recommendation').innerText = ticket.aiRecommendation;

  // RAG Sources
  const ragBox = document.getElementById('drawer-rag-sources');
  ragBox.innerHTML = '';
  ticket.ragSources.forEach(s => {
    const span = document.createElement('span');
    span.className = 'rag-chip';
    span.innerHTML = `<i class="fa-solid fa-book-bookmark"></i> ${escapeHtml(s)}`;
    ragBox.appendChild(span);
  });

  // Timeline
  const timelineBox = document.getElementById('drawer-timeline');
  timelineBox.innerHTML = '';
  ticket.timeline.forEach(item => {
    const div = document.createElement('div');
    div.className = 'timeline-item';
    div.innerHTML = `
      <span class="timeline-time">${item.time}</span>
      <span class="timeline-event">${escapeHtml(item.event)}</span>
    `;
    timelineBox.appendChild(div);
  });

  // Notes
  renderNotesList(ticket);

  // Show Drawer
  document.getElementById('drawer-overlay').classList.add('active');
  document.getElementById('ticket-detail-drawer').classList.add('active');
}

function closeTicketDrawer() {
  document.getElementById('drawer-overlay').classList.remove('active');
  document.getElementById('ticket-detail-drawer').classList.remove('active');
  activeTicketId = null;
}

function renderNotesList(ticket) {
  const notesContainer = document.getElementById('drawer-notes-list');
  notesContainer.innerHTML = '';
  if (!ticket.notes || ticket.notes.length === 0) {
    notesContainer.innerHTML = '<div class="note-item empty-note">No internal notes added yet.</div>';
    return;
  }

  ticket.notes.forEach(n => {
    const div = document.createElement('div');
    div.className = 'note-item';
    div.innerHTML = `
      <div>${escapeHtml(n.text)}</div>
      <div class="note-meta"><i class="fa-solid fa-user-pen"></i> ${escapeHtml(n.meta)}</div>
    `;
    notesContainer.appendChild(div);
  });
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
      } else if (tabId === 'my-queue') {
        document.getElementById('page-title').innerText = 'My Work Queue';
        const currentAgentId = activeAdmin ? activeAdmin.id : '#AGT-8824';
        const currentAgentName = activeAdmin ? activeAdmin.name : 'Agent';
        document.getElementById('page-subtitle').innerText = `Personal assigned exception queue for ${currentAgentName} (${currentAgentId})`;
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
      // Switch to queue
      document.querySelector('[data-tab="my-queue"]').click();
    });
  });

  // Queue Tree Branch Pills
  document.querySelectorAll('.branch-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.branch-pill').forEach(p => p.classList.remove('active-filter'));
      pill.classList.add('active-filter');
      currentFilterPriority = pill.getAttribute('data-priority').toLowerCase();
      renderMyQueueTable();
    });
  });

  // View All Queue Button on Dashboard
  document.getElementById('view-all-queue-btn').addEventListener('click', () => {
    document.querySelector('[data-tab="my-queue"]').click();
  });

  // Add Internal Note
  document.getElementById('add-note-btn').addEventListener('click', () => {
    if (!activeTicketId) return;
    const input = document.getElementById('new-note-text');
    const text = input.value.trim();
    if (!text) return;

    const ticket = tickets.find(t => t.id === activeTicketId);
    if (ticket) {
      if (!ticket.notes) ticket.notes = [];
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const currentAgentName = activeAdmin ? activeAdmin.name : 'Agent';
      ticket.notes.push({
        text: text,
        meta: `${currentAgentName} • ${timeStr}`
      });
      input.value = '';
      renderNotesList(ticket);
      showToast('Internal note added to ticket history', 'success');
    }
  });

  // Modal Actions
  const modal = document.getElementById('action-modal');
  const closeModals = () => modal.classList.remove('active');

  document.getElementById('close-modal-btn').addEventListener('click', closeModals);
  document.getElementById('modal-cancel-btn').addEventListener('click', closeModals);

  // Action Buttons in Drawer
  document.getElementById('action-resolve-btn').addEventListener('click', () => {
    if (!activeTicketId) return;
    document.getElementById('modal-title').innerText = `Resolve Ticket ${activeTicketId}`;
    document.getElementById('modal-description').innerText = 'Submit human decision and close this escalated exception.';
    document.getElementById('modal-response-text').value = 'Issue investigated and resolved per AI recommendation. Field team dispatched / credit issued.';
    modal.classList.add('active');

    document.getElementById('modal-submit-btn').onclick = () => {
      const ticket = tickets.find(t => t.id === activeTicketId);
      if (ticket) {
        ticket.status = 'RESOLVED';
        const currentAgentName = activeAdmin ? activeAdmin.name : 'Agent';
        ticket.timeline.push({
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          event: `Resolved by ${currentAgentName} with response: "${document.getElementById('modal-response-text').value}"`
        });
        showToast(`Ticket ${ticket.id} marked as RESOLVED`, 'success');
        closeModals();
        closeTicketDrawer();
        refreshAllViews();
      }
    };
  });

  document.getElementById('action-request-info-btn').addEventListener('click', () => {
    if (!activeTicketId) return;
    document.getElementById('modal-title').innerText = `Request Info for Ticket ${activeTicketId}`;
    document.getElementById('modal-description').innerText = 'Send targeted request to customer for missing hardware or line details.';
    document.getElementById('modal-response-text').value = 'Please provide your ONT device serial number located on the back panel sticker.';
    modal.classList.add('active');

    document.getElementById('modal-submit-btn').onclick = () => {
      const ticket = tickets.find(t => t.id === activeTicketId);
      if (ticket) {
        const currentAgentName = activeAdmin ? activeAdmin.name : 'Agent';
        ticket.timeline.push({
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          event: `Agent (${currentAgentName}) requested customer input: "${document.getElementById('modal-response-text').value}"`
        });
        showToast(`Information request dispatched to customer`, 'warning');
        closeModals();
        openTicketDetail(ticket.id); // re-render timeline
      }
    };
  });

  document.getElementById('action-escalate-further-btn').addEventListener('click', () => {
    if (!activeTicketId) return;
    document.getElementById('modal-title').innerText = `Escalate Ticket ${activeTicketId} to Tier 3`;
    document.getElementById('modal-description').innerText = 'Transfer ticket to Tier 3 Field Operations Specialist / Network Lead.';
    document.getElementById('modal-response-text').value = 'Requires specialized optical fiber splice equipment at main Sector switch.';
    modal.classList.add('active');

    document.getElementById('modal-submit-btn').onclick = () => {
      const ticket = tickets.find(t => t.id === activeTicketId);
      if (ticket) {
        ticket.priority = 'HIGH';
        ticket.riskScore = 99;
        const currentAgentName = activeAdmin ? activeAdmin.name : 'Agent';
        ticket.timeline.push({
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          event: `Escalated to Tier 3 Network Ops Lead by ${currentAgentName}`
        });
        showToast(`Ticket ${ticket.id} escalated to Tier 3 Lead`, 'danger');
        closeModals();
        closeTicketDrawer();
        refreshAllViews();
      }
    };
  });

  // Global Search Filter
  document.getElementById('global-search').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    filterTablesBySearch(query);
  });

  // Priority Header Filter Dropdown
  document.getElementById('priority-filter').addEventListener('change', (e) => {
    const p = e.target.value;
    currentFilterPriority = p;
    renderMyQueueTable();
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

function filterTablesBySearch(query) {
  const rows = document.querySelectorAll('.data-table tbody tr');
  rows.forEach(row => {
    const text = row.innerText.toLowerCase();
    if (text.includes(query)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
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
