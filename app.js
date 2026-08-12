/**
 * AGENT PORTAL - TELECOM AI COMPLAINT TRIAGE SYSTEM
 * Logic & Interactive Drawer / Queue Management
 */

// Initial Seed Data: Escalated Complaints requiring Human Agent Attention
let tickets = [
  {
    id: "#10291",
    customer: "Robert Vance",
    accountId: "#ACC-99214",
    tier: "Enterprise VIP",
    location: "Seattle - Sector 4B",
    category: "Network",
    issueSummary: "Fiber Link Disruption & High Packet Loss",
    priority: "HIGH",
    riskScore: 94,
    aging: "1h 45m",
    status: "ESCALATED",
    assignedTo: "Sarah Connor (Agent #AGT-8824)",
    complaintText: "My fiber internet has been completely down for over 6 hours during critical business operations. I've tried restarting the ONT terminal twice. Support chatbot kept asking generic reboot questions without routing to engineers. I demand immediate resolution or SLA breach refund!",
    sentiment: "Highly Frustrated (-0.89)",
    whyEscalated: [
      "AI confidence score (62%) below mandatory human SLA threshold (85%)",
      "Repeated complaint detected (2nd report in 48 hours)",
      "High priority Enterprise VIP SLA account",
      "No suitable automated self-healing script available for physical ONT fiber splice"
    ],
    aiSummary: "Customer Robert Vance is experiencing severe fiber link loss in Sector 4B. Automated diagnostic telemetry shows optical signal loss (-32dBm) at local node TX-992. This correlates with an ongoing regional trenching incident by municipal contractors.",
    aiRecommendation: `1. Confirm Node TX-992 regional outage status with field ops.\n2. Issue automated standard SLA credit ($45.00) to account.\n3. Dispatch emergency field repair team to Sector 4B node splice box.\n4. Send proactive SMS update to customer with estimated ETR (2.5 hours).`,
    ragSources: [
      "Network Troubleshooting Guide v4.2 (§3.1)",
      "Enterprise VIP SLA Escalation Policy (2026)",
      "Node TX-992 Telemetry Logs"
    ],
    timeline: [
      { time: "10:15 AM", event: "Ticket created via Mobile App & AI Triage Engine initialized" },
      { time: "10:16 AM", event: "Automated Line Diagnostic executed: Signal Loss Detected (-32dBm)" },
      { time: "10:17 AM", event: "AI flagged Risk Score 94% -> Auto-escalated to Human Queue (L2 Agent)" }
    ],
    notes: [
      { text: "System check confirms municipal construction hit main fiber trunk on 4th Ave.", meta: "AI System • 10:20 AM" }
    ]
  },
  {
    id: "#10287",
    customer: "Elena Rostova",
    accountId: "#ACC-44109",
    tier: "Business Pro",
    location: "Austin - Sector 2A",
    category: "Billing",
    issueSummary: "Unrecognized Roaming Data Surcharge ($680)",
    priority: "HIGH",
    riskScore: 89,
    aging: "2h 10m",
    status: "ESCALATED",
    assignedTo: "Sarah Connor (Agent #AGT-8824)",
    complaintText: "I was billed $680 for international roaming while on a domestic flight between Dallas and Austin! I turned off roaming before takeoff. The automated billing system refused my refund dispute twice.",
    sentiment: "Angry / Dispute (-0.82)",
    whyEscalated: [
      "Billing dispute amount ($680) exceeds AI auto-refund authorization cap ($100)",
      "Customer escalation threat to regulatory agency (FCC)",
      "High confidence AI rating of tower cell misallocation near international border corridor"
    ],
    aiSummary: "Customer was incorrectly connected to a transient maritime/satellite cellular relay tower during transit. CDR logs confirm device IP remained within domestic US airspace.",
    aiRecommendation: `1. Revert $680 roaming surcharge from current billing cycle.\n2. Apply $20 goodwill bill credit for automated chatbot resolution loop.\n3. Flag Tower Relay #SAT-88 for RF cell boundary recalibration.`,
    ragSources: [
      "International Roaming & Border Buffer Policy v2.8",
      "Automated Refund Limits Matrix (§4.1)"
    ],
    timeline: [
      { time: "09:40 AM", event: "Billing Dispute Submitted by customer" },
      { time: "09:42 AM", event: "AI CDR Log Analysis: Confirmed Domestic Airspace Flight Trajectory" },
      { time: "09:45 AM", event: "Escalated to Human Agent due to $680 threshold limit" }
    ],
    notes: []
  },
  {
    id: "#10276",
    customer: "Marcus Chen",
    accountId: "#ACC-77301",
    tier: "Residential Gigabit",
    location: "Chicago - Sector 1C",
    category: "Service",
    issueSummary: "eSIM Activation Failure & Provisioning Timeout",
    priority: "MEDIUM",
    riskScore: 81,
    aging: "0h 50m",
    status: "ESCALATED",
    assignedTo: "Sarah Connor (Agent #AGT-8824)",
    complaintText: "Purchased new iPhone 16 Pro and scanned QR code for eSIM transfer. Service line has been 'Activating...' for 14 hours with no cell signal. I cannot receive 2FA security codes for my bank.",
    sentiment: "Anxious / Blocked (-0.75)",
    whyEscalated: [
      "HLR/HSS provisioning queue stuck in pending lock state",
      "Customer unable to perform self-service 2FA verification"
    ],
    aiSummary: "EID profile mismatch detected between legacy physical SIM card registration and pending eSIM profile in HLR database.",
    aiRecommendation: `1. Purge stale provisioning session in HLR Console.\n2. Re-issue fresh eSIM profile QR code to customer's registered email.\n3. Guide customer to restart device after profile download.`,
    ragSources: [
      "eSIM Provisioning & HLR Troubleshooting Manual",
      "Device Migration Protocol 2026"
    ],
    timeline: [
      { time: "11:05 AM", event: "eSIM Activation request initiated" },
      { time: "11:20 AM", event: "Provisioning daemon timeout (Error Code ERR_HLR_LOCKED)" }
    ],
    notes: []
  },
  {
    id: "#10264",
    customer: "Sophia Al-Mansoor",
    accountId: "#ACC-11982",
    tier: "Business Pro",
    location: "Miami - Sector 3",
    category: "Hardware",
    issueSummary: "5G Gateway Modem Firmware Boot Loop",
    priority: "HIGH",
    riskScore: 91,
    aging: "3h 15m",
    status: "ESCALATED",
    assignedTo: "Sarah Connor (Agent #AGT-8824)",
    complaintText: "After last night's remote firmware update, our corporate 5G Gateway power light keeps flashing red and rebooting every 90 seconds. Our retail store cannot process credit cards!",
    sentiment: "Frustrated / Business Impact (-0.91)",
    whyEscalated: [
      "Firmware flash failure corrupted bootloader image",
      "Critical POS payment terminal downtime"
    ],
    aiSummary: "5G Gateway Serial #GW-9948 bricked following firmware push v5.4.1. Remote factory reset commands failed due to unbootable kernel partition.",
    aiRecommendation: `1. Authorize emergency same-day courier replacement gateway.\n2. Provide backup LTE dongle code for immediate POS connectivity.`,
    ragSources: [
      "Hardware Replacement SLA Policy",
      "5G Gateway v5.4 Firmware Errata Note"
    ],
    timeline: [
      { time: "08:30 AM", event: "Automated alert: Gateway #GW-9948 heartbeats missed" },
      { time: "08:45 AM", event: "Customer reported boot loop via priority hotline" }
    ],
    notes: []
  },
  {
    id: "#10255",
    customer: "David Miller",
    accountId: "#ACC-33829",
    tier: "Residential Standard",
    location: "Denver - Sector 5A",
    category: "Network",
    issueSummary: "Intermittent Ping Spikes in Gaming Traffic",
    priority: "MEDIUM",
    riskScore: 74,
    aging: "4h 05m",
    status: "ESCALATED",
    assignedTo: "Sarah Connor (Agent #AGT-8824)",
    complaintText: "Ping fluctuates from 20ms to 400ms every few minutes between 7 PM and 11 PM. Support bot ran traceroute and said lines are clean, but latency spikes remain constant.",
    sentiment: "Dissatisfied (-0.62)",
    whyEscalated: [
      "Intermittent peak-hour bufferbloat requires manual QoS traffic shaper rule inspection"
    ],
    aiSummary: "Local neighborhood node DEN-05 experiencing 92% capacity utilization during peak gaming hours.",
    aiRecommendation: `1. Adjust subscriber dynamic QoS profile to prioritize UDP gaming ports.\n2. Schedule node bandwidth upgrade for Sector 5A.`,
    ragSources: [
      "Peak Hour Traffic Shaper Ruleset",
      "Node DEN-05 Utilization Metrics"
    ],
    timeline: [
      { time: "07:15 AM", event: "Ticket logged via Web Portal" }
    ],
    notes: []
  },
  {
    id: "#10240",
    customer: "Amara Okezie",
    accountId: "#ACC-88210",
    tier: "Residential Gigabit",
    location: "Atlanta - Sector 1A",
    category: "Billing",
    issueSummary: "Double Charge on Autopay Cycle",
    priority: "MEDIUM",
    riskScore: 78,
    aging: "1h 10m",
    status: "ESCALATED",
    assignedTo: "Sarah Connor (Agent #AGT-8824)",
    complaintText: "My credit card was charged twice ($89.99 x 2) on August 1st. Bank shows two identical pending merchant charges.",
    sentiment: "Confused / Annoyed (-0.71)",
    whyEscalated: [
      "Autopay transaction batching duplicate anomaly requiring manual ledger correction"
    ],
    aiSummary: "Payment gateway batch glitch duplicated transaction #TXN-9918.",
    aiRecommendation: `1. Void duplicate transaction #TXN-9918B.\n2. Send confirmation receipt to customer.`,
    ragSources: [
      "Payment Gateway Audit Protocol"
    ],
    timeline: [
      { time: "10:45 AM", event: "Customer reported duplicate credit card charge" }
    ],
    notes: []
  },
  {
    id: "#10231",
    customer: "Jameson Blake",
    accountId: "#ACC-66120",
    tier: "Enterprise VIP",
    location: "New York - Sector 8C",
    category: "Service",
    issueSummary: "Static IP Routing Drop on Corporate VPN",
    priority: "HIGH",
    riskScore: 96,
    aging: "0h 35m",
    status: "ESCALATED",
    assignedTo: "Sarah Connor (Agent #AGT-8824)",
    complaintText: "Static IPv4 subnet (64.210.12.0/28) stopped advertising via BGP to our secondary datacenter.",
    sentiment: "Critical Emergency (-0.95)",
    whyEscalated: [
      "BGP route table drop impacting corporate IPsec tunnel",
      "AI confidence low due to custom edge router configuration"
    ],
    aiSummary: "Upstream BGP peer dropped static subnet advertisement following maintenance window.",
    aiRecommendation: `1. Re-issue BGP prefix advertisement command on Edge Router NY-CORE-02.\n2. Contact customer NOC with BGP session state status.`,
    ragSources: [
      "Enterprise BGP Routing Architecture Manual"
    ],
    timeline: [
      { time: "11:20 AM", event: "High Priority BGP Drop Alert triggered" }
    ],
    notes: []
  },
  {
    id: "#10219",
    customer: "Claire DeWitt",
    accountId: "#ACC-55291",
    tier: "Residential Standard",
    location: "San Jose - Sector 3B",
    category: "Service",
    issueSummary: "Plan Downgrade Request Not Applied",
    priority: "LOW",
    riskScore: 65,
    aging: "5h 20m",
    status: "ESCALATED",
    assignedTo: "Sarah Connor (Agent #AGT-8824)",
    complaintText: "I submitted a plan downgrade request last month from 1Gbps to 300Mbps, but my August bill still lists the 1Gbps rate.",
    sentiment: "Mildly Annoyed (-0.45)",
    whyEscalated: [
      "Scheduled contract change date was set to mid-cycle instead of end-of-cycle"
    ],
    aiSummary: "Contract change order pending manual billing sync.",
    aiRecommendation: `1. Adjust bill pro-rata for price difference ($30.00).\n2. Update billing cycle contract effective date.`,
    ragSources: [
      "Subscription Modification Rules"
    ],
    timeline: [
      { time: "06:40 AM", event: "Ticket entered system" }
    ],
    notes: []
  }
];

// Current active ticket selected in detail drawer
let activeTicketId = null;
let currentTab = 'dashboard';
let currentFilterPriority = 'all';

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  renderDashboardTable();
  renderMyQueueTable();
  renderAllEscalatedTable();
  updateMetricsUI();
  setupEventListeners();
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
        document.getElementById('page-subtitle').innerText = 'Personal assigned exception queue (#AGT-8824)';
      } else if (tabId === 'all-escalated') {
        document.getElementById('page-title').innerText = 'All System Escalations';
        document.getElementById('page-subtitle').innerText = 'Full registry of automated exception triage cases';
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
      ticket.notes.push({
        text: text,
        meta: `Sarah Connor • ${timeStr}`
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
        ticket.timeline.push({
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          event: `Resolved by Agent Sarah Connor with response: "${document.getElementById('modal-response-text').value}"`
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
        ticket.timeline.push({
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          event: `Agent requested customer input: "${document.getElementById('modal-response-text').value}"`
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
        ticket.timeline.push({
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          event: `Escalated to Tier 3 Network Ops Lead by Sarah Connor`
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
  renderDashboardTable();
  renderMyQueueTable();
  renderAllEscalatedTable();
  updateMetricsUI();
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
