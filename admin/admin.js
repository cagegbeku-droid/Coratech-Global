/**
 * CORATECH GLOBAL - ADMIN CMS CORE LOGIC
 * Dynamic Single Page Application for Inventory, Content & Client Operations
 */

// =========================================================================
// 1. STATE & AUTH CONFIGURATION
// =========================================================================

const adminState = {
  token: localStorage.getItem("coratech_admin_token") || null,
  user: null,
  hardware: [],
  portfolio: [],
  services: [],
  tickets: [],
  appointments: [],
  contacts: [],
  newsletter: [],
  settings: {},
  currentTab: "overview",
  hwSearch: "",
  hwFilter: "all",
  portSearch: "",
  portFilter: "all",
  ticketSearch: "",
  ticketFilter: "all"
};

// =========================================================================
// 2. INITIALIZATION
// =========================================================================

document.addEventListener("DOMContentLoaded", () => {
  initAuthSession();
  initEventListeners();
  initDropzones();
  checkServerHealth();
  setInterval(checkServerHealth, 15000);
});

// Check existing session
async function initAuthSession() {
  if (adminState.token) {
    try {
      const res = await apiRequest("/api/auth/me");
      if (res.success) {
        adminState.user = res.user;
        showDashboard();
        return;
      }
    } catch (err) {
      console.warn("Session expired or invalid:", err);
    }
  }
  showLogin();
}

function showLogin() {
  document.getElementById("login-view").style.display = "flex";
  document.getElementById("dashboard-view").style.display = "none";
}

function showDashboard() {
  document.getElementById("login-view").style.display = "none";
  document.getElementById("dashboard-view").style.display = "flex";

  if (adminState.user) {
    document.getElementById("sidebar-user-name").textContent = adminState.user.name || "Administrator";
    document.getElementById("sidebar-user-role").textContent = adminState.user.role || "Super Admin";
    document.getElementById("set-admin-name").value = adminState.user.name || "Coratech Administrator";
    document.getElementById("set-admin-email").value = adminState.user.email || "admin@coratechglobal.com";
  }

  loadAllData();
}

// =========================================================================
// 3. API CONFIGURATION & REQUEST HELPER WITH JWT AUTH
// =========================================================================

function getApiBaseUrl() {
  // If opened via file:/// or a static server running on another port (e.g., Live Server port 5500)
  if (window.location.protocol === "file:" || (window.location.port && window.location.port !== "3000")) {
    return localStorage.getItem("coratech_api_base_url") || "http://localhost:3000";
  }
  return "";
}

function resolveMediaUrl(url) {
  if (!url) return "";
  if (url.startsWith("data:") || url.startsWith("blob:") || url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  const baseUrl = getApiBaseUrl();
  if (url.startsWith("/uploads/")) {
    return baseUrl ? `${baseUrl}${url}` : `..${url}`;
  }
  if (url.startsWith("assets/")) {
    return `../${url}`;
  }
  return url;
}

async function apiRequest(endpoint, method = "GET", body = null) {
  const baseUrl = getApiBaseUrl();
  const url = endpoint.startsWith("http") ? endpoint : `${baseUrl}${endpoint}`;

  const headers = {};
  if (adminState.token) {
    headers["Authorization"] = `Bearer ${adminState.token}`;
  }

  const options = { method, headers };

  if (body) {
    if (body instanceof FormData) {
      options.body = body;
    } else {
      headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(body);
    }
  }

  let response;
  try {
    response = await fetch(url, options);
  } catch (netErr) {
    console.error("Network connection error to:", url, netErr);
    const isLocal = url.includes("localhost") || url.includes("127.0.0.1") || url.startsWith("/");
    const hint = isLocal
      ? " Backend server appears to be offline. Please start it with 'npm start' in your project terminal."
      : " Please check your internet connection.";
    throw new Error(`Failed to connect to API server (${url}).${hint}`);
  }

  let data;
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch (parseErr) {
      data = { error: "Failed to parse server JSON response." };
    }
  } else {
    const text = await response.text();
    if (!response.ok) {
      throw new Error(`Server returned error (${response.status}): ${text.slice(0, 120)}`);
    }
    data = { success: true, text };
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      adminState.token = null;
      localStorage.removeItem("coratech_admin_token");
      showLogin();
      showAdminToast("Session expired. Please log in again.", "error");
    }
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data;
}

// =========================================================================
// 4. DATA SYNCHRONIZATION
// =========================================================================

async function loadAllData() {
  try {
    const [hwRes, portRes, srvRes, tickRes, aptRes, contRes, newsRes, setRes] = await Promise.all([
      apiRequest("/api/hardware"),
      apiRequest("/api/portfolio"),
      apiRequest("/api/services"),
      apiRequest("/api/tickets"),
      apiRequest("/api/appointments"),
      apiRequest("/api/contacts"),
      apiRequest("/api/newsletter"),
      apiRequest("/api/settings")
    ]);

    adminState.hardware = hwRes.data || [];
    adminState.portfolio = portRes.data || [];
    adminState.services = srvRes.data || [];
    adminState.tickets = tickRes.data || [];
    adminState.appointments = aptRes.data || [];
    adminState.contacts = contRes.data || [];
    adminState.newsletter = newsRes.data || [];
    adminState.settings = setRes.data || {};

    updateBadgesAndKPIs();
    renderHardwareTable();
    renderPortfolioTable();
    renderServicesCards();
    renderTicketsTable();
    renderAppointmentsTable();
    renderContactsAndNewsletter();
    populateSettingsForm();
  } catch (err) {
    showAdminToast(err.message, "error");
  }
}

function updateBadgesAndKPIs() {
  document.getElementById("badge-count-hardware").textContent = adminState.hardware.length;
  document.getElementById("badge-count-portfolio").textContent = adminState.portfolio.length;
  document.getElementById("badge-count-tickets").textContent = adminState.tickets.length;
  document.getElementById("badge-count-appointments").textContent = adminState.appointments.length;

  document.getElementById("kpi-hardware-count").textContent = adminState.hardware.length;
  document.getElementById("kpi-portfolio-count").textContent = adminState.portfolio.length;
  document.getElementById("kpi-tickets-count").textContent = adminState.tickets.length;
  document.getElementById("kpi-appointments-count").textContent = adminState.appointments.length;
}

// =========================================================================
// 5. EVENT LISTENERS
// =========================================================================

function initEventListeners() {
  // Login Form
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value;
      const submitBtn = document.getElementById("btn-login-submit");

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Authenticating...`;

      try {
        const res = await apiRequest("/api/auth/login", "POST", { email, password });
        if (res.success) {
          adminState.token = res.token;
          adminState.user = res.user;
          localStorage.setItem("coratech_admin_token", res.token);
          showAdminToast(`Welcome back, ${res.user.name || "Administrator"}!`, "success");
          showDashboard();
        }
      } catch (err) {
        showAdminToast(err.message, "error");
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<i class="fa-solid fa-right-to-bracket"></i> Secure Admin Access`;
      }
    });
  }

  // Password visibility toggle
  const togglePwdBtn = document.getElementById("toggle-pwd-btn");
  if (togglePwdBtn) {
    togglePwdBtn.addEventListener("click", () => {
      const pwdInput = document.getElementById("login-password");
      const eyeIcon = document.getElementById("pwd-eye-icon");
      if (pwdInput.type === "password") {
        pwdInput.type = "text";
        eyeIcon.className = "fa-solid fa-eye-slash";
      } else {
        pwdInput.type = "password";
        eyeIcon.className = "fa-solid fa-eye";
      }
    });
  }

  // Logout Buttons
  const logoutBtns = [document.getElementById("btn-logout"), document.getElementById("topbar-logout-btn")];
  logoutBtns.forEach((btn) => {
    if (btn) {
      btn.addEventListener("click", () => {
        adminState.token = null;
        adminState.user = null;
        localStorage.removeItem("coratech_admin_token");
        showAdminToast("Logged out successfully.", "success");
        showLogin();
      });
    }
  });

  // Mobile Sidebar Toggle
  const mobileToggle = document.getElementById("mobile-sidebar-toggle");
  const sidebar = document.getElementById("admin-sidebar");
  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });
  }

  // Tab Switching
  document.querySelectorAll(".nav-tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab");
      switchTab(tabId);
      if (window.innerWidth <= 820 && sidebar) {
        sidebar.classList.remove("open");
      }
    });
  });

  // Hardware Search & Filter
  const hwSearch = document.getElementById("admin-hw-search");
  const hwFilter = document.getElementById("admin-hw-filter");
  if (hwSearch) {
    hwSearch.addEventListener("input", (e) => {
      adminState.hwSearch = e.target.value;
      renderHardwareTable();
    });
  }
  if (hwFilter) {
    hwFilter.addEventListener("change", (e) => {
      adminState.hwFilter = e.target.value;
      renderHardwareTable();
    });
  }

  // Portfolio Search & Filter
  const portSearch = document.getElementById("admin-port-search");
  const portFilter = document.getElementById("admin-port-filter");
  if (portSearch) {
    portSearch.addEventListener("input", (e) => {
      adminState.portSearch = e.target.value;
      renderPortfolioTable();
    });
  }
  if (portFilter) {
    portFilter.addEventListener("change", (e) => {
      adminState.portFilter = e.target.value;
      renderPortfolioTable();
    });
  }

  // Ticket Search & Filter
  const tickSearch = document.getElementById("admin-ticket-search");
  const tickFilter = document.getElementById("admin-ticket-filter");
  if (tickSearch) {
    tickSearch.addEventListener("input", (e) => {
      adminState.ticketSearch = e.target.value;
      renderTicketsTable();
    });
  }
  if (tickFilter) {
    tickFilter.addEventListener("change", (e) => {
      adminState.ticketFilter = e.target.value;
      renderTicketsTable();
    });
  }

  // Form Submissions
  initFormSubmissions();

  // Admin Theme Toggle
  const themeBtn = document.getElementById("admin-theme-toggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "dark";
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      const icon = document.getElementById("admin-theme-icon");
      if (icon) icon.className = next === "light" ? "fa-solid fa-moon" : "fa-solid fa-sun";
    });
  }

  // Server Status Indicator Click (Manual check / retry)
  const serverIndicator = document.getElementById("server-status-indicator");
  if (serverIndicator) {
    serverIndicator.addEventListener("click", async () => {
      showAdminToast("Checking backend server connection...", "info", 1500);
      await checkServerHealth(true);
    });
  }
}

// Server Health Monitoring
async function checkServerHealth(showToast = false) {
  const indicator = document.getElementById("server-status-indicator");
  const textEl = document.getElementById("server-status-text");
  if (!indicator || !textEl) return;

  const baseUrl = getApiBaseUrl();
  const target = baseUrl ? `${baseUrl}/api/settings` : "/api/settings";

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    const res = await fetch(target, { method: "GET", signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      indicator.className = "server-status-pill online";
      const dot = indicator.querySelector(".status-dot");
      if (dot) dot.className = "status-dot online";
      const hostLabel = baseUrl ? baseUrl.replace(/https?:\/\//, "") : "Port 3000";
      textEl.textContent = `Server: Online (${hostLabel})`;
      indicator.title = "Connected to Coratech backend server. Click to refresh status.";
      if (showToast) showAdminToast("Backend server is online and reachable!", "success");
    } else {
      throw new Error(`HTTP ${res.status}`);
    }
  } catch (e) {
    indicator.className = "server-status-pill offline";
    const dot = indicator.querySelector(".status-dot");
    if (dot) dot.className = "status-dot offline";
    textEl.textContent = "Server: Offline (npm start)";
    indicator.title = "Cannot connect to Node.js backend. Run 'npm start' in terminal. Click to retry.";
    if (showToast) {
      showAdminToast(
        "Backend server is offline! Start it by running 'npm start' in your project terminal.",
        "error",
        5000
      );
    }
  }
}

// Tab Switching Helper
function switchTab(tabId) {
  adminState.currentTab = tabId;
  document.querySelectorAll(".nav-tab-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-tab") === tabId);
  });
  document.querySelectorAll(".admin-tab-pane").forEach((pane) => {
    pane.classList.toggle("active", pane.id === `tab-${tabId}`);
  });

  const titleMap = {
    overview: "Dashboard Overview",
    hardware: "Laptops & Hardware Store Manager",
    portfolio: "Portfolio & Case Studies Manager",
    services: "Services & Scope Configuration",
    tickets: "Support Tickets HelpDesk",
    appointments: "Client Consultation Bookings & Leads",
    settings: "System Settings & Security"
  };
  document.getElementById("page-title").textContent = titleMap[tabId] || "Admin CMS";
}

// =========================================================================
// 6. HARDWARE & LAPTOP CATALOG CONTROLLER
// =========================================================================

function renderHardwareTable() {
  const tbody = document.getElementById("hardware-table-body");
  if (!tbody) return;

  const filtered = adminState.hardware.filter((item) => {
    const matchesCat = adminState.hwFilter === "all" || item.category === adminState.hwFilter;
    const q = adminState.hwSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.model.toLowerCase().includes(q) ||
      item.categoryLabel.toLowerCase().includes(q) ||
      (item.specs && Object.values(item.specs).some((s) => s.toLowerCase().includes(q)));
    return matchesCat && matchesSearch;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-muted);">
          <i class="fa-solid fa-laptop-slash" style="font-size: 2rem; margin-bottom: 8px; display: block;"></i>
          No laptops found matching your criteria.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map((item) => `
    <tr>
      <td>
        <img src="${resolveMediaUrl(item.image)}" alt="${item.model}" class="table-thumb-img">
      </td>
      <td>
        <strong>${item.model}</strong>
        <div style="font-size: 0.78rem; color: var(--text-muted);">${item.badgeCert} • ${item.condition}</div>
      </td>
      <td>
        <span class="badge badge-cyan">${item.categoryLabel}</span>
      </td>
      <td style="font-size: 0.82rem; font-family: var(--font-mono); color: var(--text-secondary); max-width: 260px;">
        ${item.specs.cpu ? `${item.specs.cpu} • ` : ""}${item.specs.ram || ""} • ${item.specs.storage || ""}
      </td>
      <td>
        <strong style="color: var(--accent-cyan); font-size: 1rem;">GH₵ ${item.priceUsd.toLocaleString()}</strong>
      </td>
      <td>
        ${item.inStock !== false
          ? `<span class="badge badge-success"><i class="fa-solid fa-check"></i> In Stock</span>`
          : `<span class="badge badge-rose"><i class="fa-solid fa-xmark"></i> Out of Stock</span>`}
      </td>
      <td style="text-align: right;">
        <button class="btn-table-action" onclick="openEditHardwareModal('${item.id}')" title="Edit Laptop">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button class="btn-table-action delete" onclick="deleteHardware('${item.id}', '${escapeHtml(item.model)}')" title="Delete">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    </tr>
  `).join("");
}

function openCreateHardwareModal() {
  document.getElementById("form-hardware").reset();
  document.getElementById("hw-edit-id").value = "";
  document.getElementById("hw-modal-title").innerHTML = `<i class="fa-solid fa-plus-circle text-cyan"></i> Add New Laptop / Hardware`;
  document.getElementById("hw-image-url").value = "assets/hardware_laptop.jpg";
  document.getElementById("hw-dropzone-content").style.display = "flex";
  document.getElementById("hw-dropzone-preview").style.display = "none";
  document.getElementById("hw-instock").checked = true;
  document.getElementById("hw-featured").checked = false;
  document.getElementById("modal-hardware").classList.add("open");
}

function openEditHardwareModal(hwId) {
  const item = adminState.hardware.find((h) => h.id === hwId);
  if (!item) return;

  document.getElementById("hw-edit-id").value = item.id;
  document.getElementById("hw-modal-title").innerHTML = `<i class="fa-solid fa-pen-to-square text-cyan"></i> Edit Laptop: ${escapeHtml(item.model)}`;
  document.getElementById("hw-model").value = item.model;
  document.getElementById("hw-category").value = item.category;
  document.getElementById("hw-price").value = item.priceUsd;
  document.getElementById("hw-condition").value = item.condition;
  document.getElementById("hw-cert").value = item.badgeCert;
  document.getElementById("hw-warranty").value = item.warranty;

  document.getElementById("hw-spec-cpu").value = item.specs.cpu || "";
  document.getElementById("hw-spec-ram").value = item.specs.ram || "";
  document.getElementById("hw-spec-storage").value = item.specs.storage || "";
  document.getElementById("hw-spec-display").value = item.specs.display || "";
  document.getElementById("hw-spec-gpu").value = item.specs.gpu || "";
  document.getElementById("hw-spec-battery").value = item.specs.battery || "";

  document.getElementById("hw-instock").checked = item.inStock !== false;
  document.getElementById("hw-featured").checked = !!item.featured;

  document.getElementById("hw-image-url").value = item.image;
  const previewImg = document.getElementById("hw-preview-img");
  previewImg.src = resolveMediaUrl(item.image);
  document.getElementById("hw-dropzone-content").style.display = "none";
  document.getElementById("hw-dropzone-preview").style.display = "inline-block";

  document.getElementById("modal-hardware").classList.add("open");
}

function closeHardwareModal() {
  document.getElementById("modal-hardware").classList.remove("open");
}

async function deleteHardware(id, modelName) {
  if (!confirm(`Are you sure you want to delete "${modelName}"? This action cannot be undone.`)) return;

  try {
    const res = await apiRequest(`/api/hardware/${id}`, "DELETE");
    if (res.success) {
      showAdminToast(`Laptop "${modelName}" deleted.`, "success");
      adminState.hardware = adminState.hardware.filter((h) => h.id !== id);
      updateBadgesAndKPIs();
      renderHardwareTable();
    }
  } catch (err) {
    showAdminToast(err.message, "error");
  }
}

// =========================================================================
// 7. PORTFOLIO & CASE STUDIES CONTROLLER
// =========================================================================

function renderPortfolioTable() {
  const tbody = document.getElementById("portfolio-table-body");
  if (!tbody) return;

  const filtered = adminState.portfolio.filter((item) => {
    const matchesCat = adminState.portFilter === "all" || item.category === adminState.portFilter;
    const q = adminState.portSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.categoryLabel.toLowerCase().includes(q) ||
      (Array.isArray(item.techStack) && item.techStack.some((t) => t.toLowerCase().includes(q)));
    return matchesCat && matchesSearch;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 40px; color: var(--text-muted);">
          <i class="fa-solid fa-folder-open" style="font-size: 2rem; margin-bottom: 8px; display: block;"></i>
          No case studies found matching your criteria.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map((proj) => `
    <tr>
      <td>
        <img src="${resolveMediaUrl(proj.image)}" alt="${proj.title}" class="table-thumb-img">
      </td>
      <td>
        <strong>${proj.title}</strong>
        <p style="font-size: 0.78rem; color: var(--text-secondary); max-width: 320px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${proj.description}</p>
      </td>
      <td>
        <span class="badge badge-purple">${proj.categoryLabel}</span>
      </td>
      <td>
        <span class="badge badge-amber"><i class="fa-solid fa-trophy"></i> ${proj.metric}</span>
      </td>
      <td>
        <div style="display: flex; flex-wrap: wrap; gap: 4px; max-width: 220px;">
          ${(Array.isArray(proj.techStack) ? proj.techStack : []).map(t => `<span class="badge badge-outline" style="font-size: 0.7rem;">${t}</span>`).join("")}
        </div>
      </td>
      <td style="text-align: right;">
        <button class="btn-table-action" onclick="openEditPortfolioModal('${proj.id}')" title="Edit Case Study">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button class="btn-table-action delete" onclick="deletePortfolio('${proj.id}', '${escapeHtml(proj.title)}')" title="Delete">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    </tr>
  `).join("");
}

function openCreatePortfolioModal() {
  document.getElementById("form-portfolio").reset();
  document.getElementById("port-edit-id").value = "";
  document.getElementById("port-modal-title").innerHTML = `<i class="fa-solid fa-folder-plus text-purple"></i> Add New Case Study`;
  document.getElementById("port-image-url").value = "assets/cloud_infra.jpg";
  document.getElementById("port-dropzone-content").style.display = "flex";
  document.getElementById("port-dropzone-preview").style.display = "none";
  document.getElementById("modal-portfolio").classList.add("open");
}

function openEditPortfolioModal(projId) {
  const proj = adminState.portfolio.find((p) => p.id === projId);
  if (!proj) return;

  document.getElementById("port-edit-id").value = proj.id;
  document.getElementById("port-modal-title").innerHTML = `<i class="fa-solid fa-pen-to-square text-purple"></i> Edit: ${escapeHtml(proj.title)}`;
  document.getElementById("port-title").value = proj.title;
  document.getElementById("port-category").value = proj.category;
  document.getElementById("port-metric").value = proj.metric;
  document.getElementById("port-techstack").value = Array.isArray(proj.techStack) ? proj.techStack.join(", ") : proj.techStack;
  document.getElementById("port-description").value = proj.description;

  if (proj.caseStudy) {
    document.getElementById("port-problem").value = proj.caseStudy.problem || "";
    document.getElementById("port-solution").value = proj.caseStudy.solution || "";
    document.getElementById("port-outcome").value = proj.caseStudy.outcome || "";
  }

  document.getElementById("port-image-url").value = proj.image;
  const previewImg = document.getElementById("port-preview-img");
  previewImg.src = resolveMediaUrl(proj.image);
  document.getElementById("port-dropzone-content").style.display = "none";
  document.getElementById("port-dropzone-preview").style.display = "inline-block";

  document.getElementById("modal-portfolio").classList.add("open");
}

function closePortfolioModal() {
  document.getElementById("modal-portfolio").classList.remove("open");
}

async function deletePortfolio(id, title) {
  if (!confirm(`Are you sure you want to delete case study "${title}"?`)) return;

  try {
    const res = await apiRequest(`/api/portfolio/${id}`, "DELETE");
    if (res.success) {
      showAdminToast(`Case study deleted.`, "success");
      adminState.portfolio = adminState.portfolio.filter((p) => p.id !== id);
      updateBadgesAndKPIs();
      renderPortfolioTable();
    }
  } catch (err) {
    showAdminToast(err.message, "error");
  }
}

// =========================================================================
// 8. SERVICES CONTROLLER
// =========================================================================

function renderServicesCards() {
  const container = document.getElementById("services-admin-grid");
  if (!container) return;

  container.innerHTML = adminState.services.map((srv) => `
    <div class="service-admin-card">
      <div>
        <h4><i class="${srv.icon}"></i> ${srv.title}</h4>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 12px;">${srv.summary}</p>
        <div style="background: var(--bg-tertiary); padding: 10px; border-radius: var(--radius-sm); font-size: 0.78rem; font-family: var(--font-mono); color: var(--accent-cyan);">
          ${srv.fullDetails ? srv.fullDetails.techStack : ""}
        </div>
      </div>
      <div style="margin-top: 16px; display: flex; justify-content: flex-end;">
        <button class="btn btn-outline-cyan btn-sm" onclick="openEditServiceModal('${srv.id}')">
          <i class="fa-solid fa-pen-to-square"></i> Edit Scope & Tech Stack
        </button>
      </div>
    </div>
  `).join("");
}

function openEditServiceModal(srvId) {
  const srv = adminState.services.find((s) => s.id === srvId);
  if (!srv) return;

  document.getElementById("srv-edit-id").value = srv.id;
  document.getElementById("srv-title").value = srv.title;
  document.getElementById("srv-summary").value = srv.summary;
  document.getElementById("srv-scope").value = srv.fullDetails ? srv.fullDetails.scope : "";
  document.getElementById("srv-techstack").value = srv.fullDetails ? srv.fullDetails.techStack : "";
  document.getElementById("modal-service").classList.add("open");
}

function closeServiceModal() {
  document.getElementById("modal-service").classList.remove("open");
}

// =========================================================================
// 9. TICKETS DESK CONTROLLER
// =========================================================================

function renderTicketsTable() {
  const tbody = document.getElementById("tickets-table-body");
  if (!tbody) return;

  const filtered = adminState.tickets.filter((t) => {
    const matchesFilter = adminState.ticketFilter === "all" || t.status === adminState.ticketFilter;
    const q = adminState.ticketSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      t.id.toLowerCase().includes(q) ||
      t.name.toLowerCase().includes(q) ||
      t.email.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-muted);">
          <i class="fa-solid fa-ticket-simple" style="font-size: 2rem; margin-bottom: 8px; display: block;"></i>
          No support tickets found.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map((t) => {
    const isCompleted = t.status === "Completed" || t.step === 3;
    const isUrgent = t.priority === "Critical 24/7" || t.status === "Urgent Dispatch";
    const badgeClass = isCompleted ? "badge-success" : (isUrgent ? "badge-rose" : "badge-amber");

    return `
      <tr>
        <td><strong class="text-cyan font-mono">${t.id}</strong></td>
        <td>
          <strong>${escapeHtml(t.name)}</strong>
          <div style="font-size: 0.78rem; color: var(--text-muted);">${escapeHtml(t.email)}</div>
        </td>
        <td>
          <div style="font-weight: 600; font-size: 0.85rem;">${escapeHtml(t.category)}</div>
          <div style="font-size: 0.78rem; color: var(--text-secondary); max-width: 240px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(t.desc)}</div>
        </td>
        <td>
          <span class="badge ${t.priority.includes('Critical') ? 'badge-rose' : (t.priority === 'High' ? 'badge-amber' : 'badge-outline')}">
            ${t.priority}
          </span>
        </td>
        <td>
          <span class="badge ${badgeClass}">${t.status} (Step ${t.step || 1}/3)</span>
        </td>
        <td style="font-size: 0.8rem; color: var(--text-muted);">${t.createdAt}</td>
        <td style="text-align: right;">
          <button class="btn btn-outline-cyan btn-sm" onclick="openTicketUpdateModal('${t.id}')">
            <i class="fa-solid fa-wrench"></i> Update
          </button>
          <button class="btn-table-action delete" onclick="deleteTicket('${t.id}')" title="Delete Ticket">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  }).join("");
}

function openTicketUpdateModal(ticketId) {
  const t = adminState.tickets.find((item) => item.id.toUpperCase() === ticketId.toUpperCase());
  if (!t) return;

  document.getElementById("ticket-update-id").value = t.id;
  document.getElementById("ticket-diag-id").textContent = t.id;
  document.getElementById("ticket-diag-client").textContent = `Client: ${t.name} (${t.email})`;
  document.getElementById("ticket-diag-issue").textContent = `Issue: ${t.category} — "${t.desc}"`;
  document.getElementById("ticket-status-select").value = t.status || "In Progress";
  document.getElementById("ticket-step-select").value = t.step ? String(t.step) : "1";
  document.getElementById("ticket-notes").value = t.notes || "";

  document.getElementById("modal-ticket").classList.add("open");
}

function closeTicketModal() {
  document.getElementById("modal-ticket").classList.remove("open");
}

async function deleteTicket(id) {
  if (!confirm(`Delete ticket ${id}?`)) return;

  try {
    const res = await apiRequest(`/api/tickets/${id}`, "DELETE");
    if (res.success) {
      showAdminToast(`Ticket ${id} removed.`, "success");
      adminState.tickets = adminState.tickets.filter((t) => t.id.toUpperCase() !== id.toUpperCase());
      updateBadgesAndKPIs();
      renderTicketsTable();
    }
  } catch (err) {
    showAdminToast(err.message, "error");
  }
}

// =========================================================================
// 10. APPOINTMENTS & INQUIRIES CONTROLLER
// =========================================================================

function renderAppointmentsTable() {
  const tbody = document.getElementById("appointments-table-body");
  if (!tbody) return;

  if (adminState.appointments.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 25px; color: var(--text-muted);">No consultation bookings yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = adminState.appointments.map((apt) => `
    <tr>
      <td><strong class="text-emerald font-mono">${apt.id}</strong></td>
      <td><strong>${escapeHtml(apt.name)}</strong></td>
      <td>
        <a href="https://wa.me/${apt.phone.replace(/[^0-9]/g, '')}" target="_blank" class="text-cyan" style="text-decoration: none;">
          <i class="fa-brands fa-whatsapp"></i> ${apt.phone}
        </a>
      </td>
      <td>${escapeHtml(apt.service)}</td>
      <td><span class="badge badge-outline">${apt.type}</span></td>
      <td><strong>${apt.date}</strong> at ${apt.time}</td>
      <td>
        <span class="badge ${apt.status === 'Confirmed' ? 'badge-success' : 'badge-amber'}">${apt.status}</span>
      </td>
      <td style="text-align: right;">
        <button class="btn btn-outline-cyan btn-sm" onclick="toggleAppointmentStatus('${apt.id}')">
          <i class="fa-solid fa-check"></i> ${apt.status === 'Confirmed' ? 'Mark Done' : 'Confirm'}
        </button>
        <button class="btn-table-action delete" onclick="deleteAppointment('${apt.id}')">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    </tr>
  `).join("");
}

async function toggleAppointmentStatus(id) {
  const apt = adminState.appointments.find((a) => a.id === id);
  if (!apt) return;

  const nextStatus = apt.status === "Confirmed" ? "Completed" : "Confirmed";
  try {
    const res = await apiRequest(`/api/appointments/${id}`, "PATCH", { status: nextStatus });
    if (res.success) {
      showAdminToast(`Appointment marked as ${nextStatus}.`, "success");
      apt.status = nextStatus;
      renderAppointmentsTable();
    }
  } catch (err) {
    showAdminToast(err.message, "error");
  }
}

async function deleteAppointment(id) {
  if (!confirm(`Delete appointment ${id}?`)) return;

  try {
    const res = await apiRequest(`/api/appointments/${id}`, "DELETE");
    if (res.success) {
      showAdminToast("Appointment deleted.", "success");
      adminState.appointments = adminState.appointments.filter((a) => a.id !== id);
      updateBadgesAndKPIs();
      renderAppointmentsTable();
    }
  } catch (err) {
    showAdminToast(err.message, "error");
  }
}

function renderContactsAndNewsletter() {
  const contactsContainer = document.getElementById("contacts-list-container");
  const newsContainer = document.getElementById("newsletter-list-container");

  if (contactsContainer) {
    if (adminState.contacts.length === 0) {
      contactsContainer.innerHTML = `<p style="color: var(--text-muted); font-size: 0.88rem;">No direct contact messages received yet.</p>`;
    } else {
      contactsContainer.innerHTML = adminState.contacts.map((c) => `
        <div style="background: var(--bg-secondary); padding: 14px; border-radius: var(--radius-sm); margin-bottom: 10px; border: 1px solid var(--border-subtle);">
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <strong>${escapeHtml(c.name)} (${escapeHtml(c.email)})</strong>
            <span style="font-size: 0.75rem; color: var(--text-muted);">${new Date(c.createdAt).toLocaleDateString()}</span>
          </div>
          <div style="font-size: 0.85rem; color: var(--accent-cyan); font-weight: 600;">${escapeHtml(c.subject)}</div>
          <p style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 4px;">${escapeHtml(c.message)}</p>
        </div>
      `).join("");
    }
  }

  if (newsContainer) {
    if (adminState.newsletter.length === 0) {
      newsContainer.innerHTML = `<p style="color: var(--text-muted); font-size: 0.88rem;">No subscribers yet.</p>`;
    } else {
      newsContainer.innerHTML = `
        <table class="admin-data-table">
          <thead><tr><th>Email Address</th><th>Date</th></tr></thead>
          <tbody>
            ${adminState.newsletter.map(n => `
              <tr>
                <td><strong>${escapeHtml(n.email)}</strong></td>
                <td style="font-size: 0.8rem; color: var(--text-muted);">${new Date(n.subscribedAt).toLocaleDateString()}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `;
    }
  }
}

function exportNewsletterCsv() {
  if (adminState.newsletter.length === 0) {
    showAdminToast("No subscriber records to export.", "error");
    return;
  }
  let csv = "Email,SubscribedAt\n";
  adminState.newsletter.forEach((n) => {
    csv += `"${n.email}","${n.subscribedAt}"\n`;
  });
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `coratech-newsletter-subscribers-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
}

// =========================================================================
// 11. SETTINGS CONTROLLER
// =========================================================================

function populateSettingsForm() {
  if (!adminState.settings) return;

  if (adminState.settings.whatsappNumber) {
    document.getElementById("set-whatsapp").value = adminState.settings.whatsappNumber;
  }

  const rates = adminState.settings.currencyRates;
  if (rates) {
    if (rates.USD) document.getElementById("curr-usd").value = rates.USD.rate;
    if (rates.NGN) document.getElementById("curr-ngn").value = rates.NGN.rate;
    if (rates.GBP) document.getElementById("curr-gbp").value = rates.GBP.rate;
    if (rates.EUR) document.getElementById("curr-eur").value = rates.EUR.rate;
  }
}

// =========================================================================
// 12. FORM SUBMISSIONS BINDINGS
// =========================================================================

function initFormSubmissions() {
  // Hardware Save Form
  const hwForm = document.getElementById("form-hardware");
  if (hwForm) {
    hwForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const saveBtn = document.getElementById("hw-save-btn");
      saveBtn.disabled = true;
      saveBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Saving...`;

      const editId = document.getElementById("hw-edit-id").value;
      const model = document.getElementById("hw-model").value.trim();
      const category = document.getElementById("hw-category").value;
      const priceUsd = parseFloat(document.getElementById("hw-price").value);
      const condition = document.getElementById("hw-condition").value;
      const badgeCert = document.getElementById("hw-cert").value.trim();
      const warranty = document.getElementById("hw-warranty").value.trim();
      const image = document.getElementById("hw-image-url").value.trim();

      const specs = {
        cpu: document.getElementById("hw-spec-cpu").value.trim(),
        ram: document.getElementById("hw-spec-ram").value.trim(),
        storage: document.getElementById("hw-spec-storage").value.trim(),
        display: document.getElementById("hw-spec-display").value.trim(),
        gpu: document.getElementById("hw-spec-gpu").value.trim(),
        battery: document.getElementById("hw-spec-battery").value.trim()
      };

      const inStock = document.getElementById("hw-instock").checked;
      const featured = document.getElementById("hw-featured").checked;

      const payload = { model, category, priceUsd, condition, badgeCert, warranty, image, specs, inStock, featured };

      try {
        if (editId) {
          const res = await apiRequest(`/api/hardware/${editId}`, "PUT", payload);
          if (res.success) {
            showAdminToast("Laptop updated successfully!", "success");
            const idx = adminState.hardware.findIndex((h) => h.id === editId);
            if (idx !== -1) adminState.hardware[idx] = res.data;
          }
        } else {
          const res = await apiRequest("/api/hardware", "POST", payload);
          if (res.success) {
            showAdminToast("New laptop added to inventory!", "success");
            adminState.hardware.unshift(res.data);
          }
        }
        closeHardwareModal();
        updateBadgesAndKPIs();
        renderHardwareTable();
      } catch (err) {
        showAdminToast(err.message, "error");
      } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Save Device`;
      }
    });
  }

  // Portfolio Save Form
  const portForm = document.getElementById("form-portfolio");
  if (portForm) {
    portForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const saveBtn = document.getElementById("port-save-btn");
      saveBtn.disabled = true;
      saveBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Saving...`;

      const editId = document.getElementById("port-edit-id").value;
      const title = document.getElementById("port-title").value.trim();
      const category = document.getElementById("port-category").value;
      const metric = document.getElementById("port-metric").value.trim();
      const techStack = document.getElementById("port-techstack").value.split(",").map(s => s.trim()).filter(Boolean);
      const description = document.getElementById("port-description").value.trim();
      const image = document.getElementById("port-image-url").value.trim();

      const caseStudy = {
        problem: document.getElementById("port-problem").value.trim(),
        solution: document.getElementById("port-solution").value.trim(),
        outcome: document.getElementById("port-outcome").value.trim()
      };

      const payload = { title, category, metric, techStack, description, image, caseStudy };

      try {
        if (editId) {
          const res = await apiRequest(`/api/portfolio/${editId}`, "PUT", payload);
          if (res.success) {
            showAdminToast("Case study updated successfully!", "success");
            const idx = adminState.portfolio.findIndex((p) => p.id === editId);
            if (idx !== -1) adminState.portfolio[idx] = res.data;
          }
        } else {
          const res = await apiRequest("/api/portfolio", "POST", payload);
          if (res.success) {
            showAdminToast("New case study published!", "success");
            adminState.portfolio.unshift(res.data);
          }
        }
        closePortfolioModal();
        updateBadgesAndKPIs();
        renderPortfolioTable();
      } catch (err) {
        showAdminToast(err.message, "error");
      } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Save Case Study`;
      }
    });
  }

  // Service Edit Form
  const srvForm = document.getElementById("form-service");
  if (srvForm) {
    srvForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const editId = document.getElementById("srv-edit-id").value;
      const title = document.getElementById("srv-title").value.trim();
      const summary = document.getElementById("srv-summary").value.trim();
      const scope = document.getElementById("srv-scope").value.trim();
      const techStack = document.getElementById("srv-techstack").value.trim();

      try {
        const res = await apiRequest(`/api/services/${editId}`, "PUT", {
          title,
          summary,
          fullDetails: { scope, techStack }
        });
        if (res.success) {
          showAdminToast("Service scope updated!", "success");
          const idx = adminState.services.findIndex((s) => s.id === editId);
          if (idx !== -1) adminState.services[idx] = res.data;
          closeServiceModal();
          renderServicesCards();
        }
      } catch (err) {
        showAdminToast(err.message, "error");
      }
    });
  }

  // Ticket Update Form
  const ticketForm = document.getElementById("form-ticket-update");
  if (ticketForm) {
    ticketForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = document.getElementById("ticket-update-id").value;
      const status = document.getElementById("ticket-status-select").value;
      const step = parseInt(document.getElementById("ticket-step-select").value);
      const notes = document.getElementById("ticket-notes").value.trim();

      try {
        const res = await apiRequest(`/api/tickets/${id}`, "PATCH", { status, step, notes });
        if (res.success) {
          showAdminToast(`Ticket ${id} status updated!`, "success");
          const idx = adminState.tickets.findIndex((t) => t.id.toUpperCase() === id.toUpperCase());
          if (idx !== -1) adminState.tickets[idx] = res.data;
          closeTicketModal();
          renderTicketsTable();
        }
      } catch (err) {
        showAdminToast(err.message, "error");
      }
    });
  }

  // Password / Profile Change Form
  const pwdForm = document.getElementById("form-change-password");
  if (pwdForm) {
    pwdForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("set-admin-name").value.trim();
      const email = document.getElementById("set-admin-email").value.trim();
      const currentPassword = document.getElementById("set-current-pwd").value;
      const newPassword = document.getElementById("set-new-pwd").value;

      try {
        const res = await apiRequest("/api/auth/change-password", "POST", { name, email, currentPassword, newPassword });
        if (res.success) {
          showAdminToast("Admin profile and security settings saved!", "success");
          document.getElementById("set-current-pwd").value = "";
          document.getElementById("set-new-pwd").value = "";
        }
      } catch (err) {
        showAdminToast(err.message, "error");
      }
    });
  }

  // Site Settings & Currencies Form
  const setForm = document.getElementById("form-site-settings");
  if (setForm) {
    setForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const whatsappNumber = document.getElementById("set-whatsapp").value.trim();
      const usdRate = parseFloat(document.getElementById("curr-usd").value);
      const ngnRate = parseFloat(document.getElementById("curr-ngn").value);
      const gbpRate = parseFloat(document.getElementById("curr-gbp").value);
      const eurRate = parseFloat(document.getElementById("curr-eur").value);

      const currencyRates = {
        GHS: { symbol: "GH₵", rate: 1.0 },
        USD: { symbol: "$", rate: usdRate },
        NGN: { symbol: "₦", rate: ngnRate },
        GBP: { symbol: "£", rate: gbpRate },
        EUR: { symbol: "€", rate: eurRate }
      };

      try {
        const res = await apiRequest("/api/settings", "PUT", { whatsappNumber, currencyRates });
        if (res.success) {
          adminState.settings = res.data;
          showAdminToast("Global currency and contact settings updated live!", "success");
        }
      } catch (err) {
        showAdminToast(err.message, "error");
      }
    });
  }
}

// =========================================================================
// 13. DROPZONE & IMAGE UPLOAD ENGINE
// =========================================================================

function initDropzones() {
  setupSingleDropzone("hw-dropzone", "hw-file-input", "hw-image-url", "hw-dropzone-content", "hw-dropzone-preview", "hw-preview-img", "hw-remove-img");
  setupSingleDropzone("port-dropzone", "port-file-input", "port-image-url", "port-dropzone-content", "port-dropzone-preview", "port-preview-img", "port-remove-img");
}

function setupSingleDropzone(dropzoneId, fileInputId, urlInputId, contentId, previewContainerId, previewImgId, removeBtnId) {
  const dropzone = document.getElementById(dropzoneId);
  const fileInput = document.getElementById(fileInputId);
  const urlInput = document.getElementById(urlInputId);
  const content = document.getElementById(contentId);
  const previewContainer = document.getElementById(previewContainerId);
  const previewImg = document.getElementById(previewImgId);
  const removeBtn = document.getElementById(removeBtnId);

  if (!dropzone || !fileInput) return;

  dropzone.addEventListener("click", (e) => {
    if (e.target !== removeBtn) {
      fileInput.click();
    }
  });

  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.classList.add("dragover");
  });

  dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("dragover");
  });

  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0], urlInput, content, previewContainer, previewImg);
    }
  });

  fileInput.addEventListener("change", () => {
    if (fileInput.files && fileInput.files[0]) {
      handleFileUpload(fileInput.files[0], urlInput, content, previewContainer, previewImg);
    }
  });

  if (removeBtn) {
    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      urlInput.value = "";
      fileInput.value = "";
      previewContainer.style.display = "none";
      content.style.display = "flex";
    });
  }
}

async function handleFileUpload(file, urlInput, content, previewContainer, previewImg) {
  if (!file) return;

  // Validate that the file is an image
  if (!file.type.startsWith("image/") && !file.name.match(/\.(jpg|jpeg|png|webp|gif|svg|avif)$/i)) {
    showAdminToast("Please select a valid image file (JPG, PNG, WEBP, SVG, GIF).", "warning");
    return;
  }

  // 1. Instant Local Preview using FileReader (zero latency)
  const localReader = new FileReader();
  localReader.onload = (e) => {
    previewImg.src = e.target.result;
    content.style.display = "none";
    previewContainer.style.display = "inline-block";
  };
  localReader.readAsDataURL(file);

  showAdminToast("Uploading image...", "info", 2000);

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await apiRequest("/api/upload", "POST", formData);
    if (res.success) {
      urlInput.value = res.url;
      previewImg.src = resolveMediaUrl(res.url);
      showAdminToast("Image uploaded and stored successfully!", "success");
      return;
    }
  } catch (err) {
    console.warn("Server upload failed, converting to local Base64 data URL:", err);
    // 2. Resilient Base64 Fallback: Ensures user can continue saving without losing data
    const base64Reader = new FileReader();
    base64Reader.onload = (e) => {
      const base64Url = e.target.result;
      urlInput.value = base64Url;
      previewImg.src = base64Url;
      showAdminToast(
        "Backend server offline: Image saved in Base64 mode! (Run 'npm start' to enable permanent disk storage)",
        "warning",
        6000
      );
    };
    base64Reader.readAsDataURL(file);
  }
}

// =========================================================================
// 14. TOAST NOTIFICATION UTILITY
// =========================================================================

function showAdminToast(message, type = "info", duration = 3500) {
  const container = document.getElementById("admin-toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `admin-toast ${type}`;

  const iconClass =
    type === "success"
      ? "fa-solid fa-circle-check text-emerald"
      : type === "error"
      ? "fa-solid fa-circle-xmark text-rose"
      : "fa-solid fa-circle-info text-cyan";

  toast.innerHTML = `
    <i class="${iconClass}" style="font-size: 1.2rem;"></i>
    <span style="font-size: 0.88rem; font-weight: 500;">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "slideInRight 0.3s reverse forwards";
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
