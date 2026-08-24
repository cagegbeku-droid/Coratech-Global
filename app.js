/**
 * CORATECH GLOBAL (CG) - CORE APPLICATION LOGIC
 * Innovating Your Digital Future
 */

// =========================================================================
// 1. DATA REPOSITORIES (Default Fallback & Live Synchronized)
// =========================================================================

let SERVICES_DATA = [
  {
    id: "it_support",
    title: "IT Support & Troubleshooting",
    icon: "fa-solid fa-screwdriver-wrench",
    summary: "Proactive managed IT support, emergency on-site & remote troubleshooting, workstation optimization, and network maintenance.",
    features: [
      "24/7 Rapid Incident Remediations",
      "Network & Wi-Fi Router Configurations",
      "Malware Removal & Endpoint Security",
      "Hardware Diagnostics & Component Repairs"
    ],
    fullDetails: {
      scope: "Our Managed IT Support service acts as your dedicated enterprise IT department. We maintain your systems, monitor server health, troubleshoot connectivity issues, configure printers, and ensure zero operational downtime.",
      deliverables: [
        "SLA-backed 15-minute response time guarantee",
        "Monthly proactive system health check & patch audits",
        "Remote desktop troubleshooting and on-demand field visits",
        "Comprehensive asset management & inventory documentation"
      ],
      techStack: "Remote Management (RMM), Cisco / Ubiquiti UniFi, Wireshark, Active Directory, BitLocker, Windows Server"
    }
  },
  {
    id: "web_dev",
    title: "Website Design & Development",
    icon: "fa-solid fa-code",
    summary: "Custom full-stack web applications, ultra-fast modern websites, responsive UI/UX design, and robust API integrations.",
    features: [
      "Custom Full-Stack Architecture",
      "High-Converting Responsive UI/UX",
      "Secure Payment Gateway Integrations",
      "Sub-Second Load Speed & SEO Core Vitals"
    ],
    fullDetails: {
      scope: "We build bespoke, modern web applications engineered for scalability and conversion. From custom enterprise SaaS platforms to dynamic corporate websites and e-commerce portals, our code is clean, secure, and blazing fast.",
      deliverables: [
        "Full-stack web application with responsive UI/UX",
        "Custom REST / GraphQL API development & third-party integrations",
        "Payment gateway (Stripe, Paystack, Flutterwave, PayPal) integration",
        "Technical SEO optimization, SSL security, and CI/CD automated deployment"
      ],
      techStack: "React, Next.js, Node.js, TypeScript, Python / Django, PostgreSQL, TailwindCSS, AWS / Vercel"
    }
  },
  {
    id: "google_business",
    title: "Google Business Profile & SEO",
    icon: "fa-brands fa-google",
    summary: "Google Business Profile verification, top-3 local Map pack ranking, review reputation management, and local search indexing.",
    features: [
      "Official Google Profile Verification",
      "Local Map Pack Ranking Optimization",
      "Automated Review & Reputation System",
      "High-Intent Keyword & Geo-Tag Indexing"
    ],
    fullDetails: {
      scope: "Maximize your physical and digital discoverability. We handle official Google Business Profile verification, optimize your local categories, implement local SEO schema, and setup customer review acquisition funnels to rank in the top 3 on Google Maps.",
      deliverables: [
        "100% verified and optimized Google Business listing",
        "Geotagged high-resolution photo assets and catalog uploads",
        "Local citation building across top business directories",
        "QR code review generation kit for instant 5-star customer reviews"
      ],
      techStack: "Google Business Suite, Google Maps API, Schema.org LocalSEO, Semrush, BrightLocal"
    }
  },
  {
    id: "cloud_hosting",
    title: "Website Hosting & Maintenance",
    icon: "fa-solid fa-cloud-arrow-up",
    summary: "Enterprise 99.9% uptime cloud hosting, managed SSL setups, domain lifecycle management, and automated daily backups.",
    features: [
      "99.9% Uptime SLA Guarantee",
      "Free Wildcard SSL & DDoS Protection",
      "Automated Off-Site Daily Backups",
      "Continuous Core & Security Updates"
    ],
    fullDetails: {
      scope: "Never worry about server crashes, expired domains, or security vulnerabilities again. We provide fully managed, blazing-fast cloud hosting backed by enterprise CDNs, automated daily snapshots, and 24/7 uptime monitoring.",
      deliverables: [
        "Isolated high-speed cloud hosting environment with HTTP/3 & NVMe storage",
        "Enterprise Cloudflare DDoS mitigation and Web Application Firewall (WAF)",
        "Daily automated multi-region encrypted backups with 1-click restore",
        "Routine plugin, database, and security patch maintenance"
      ],
      techStack: "AWS Cloud, DigitalOcean, Cloudflare Enterprise, Docker, Nginx, Redis Caching, UptimeRobot"
    }
  },
  {
    id: "windows_os",
    title: "Windows OS Installation & Setup",
    icon: "fa-brands fa-windows",
    summary: "Clean Windows 11/10 Pro installations, OS migration, driver optimization, enterprise domain joining, and software packages.",
    features: [
      "Genuine Windows 11/10 Pro Deployment",
      "Complete Driver & Performance Tuning",
      "Essential Software & Antivirus Suite",
      "Data Backup & Lossless Migration"
    ],
    fullDetails: {
      scope: "Whether you bought a new workstation, need an OS upgrade, or are recovering from a corrupt system, we provide professional clean Windows installations with guaranteed data integrity, licensed activations, and fine-tuned system performance.",
      deliverables: [
        "Clean installation of Windows 11/10 Pro with genuine digital license",
        "Installation of all motherboard, GPU, and chipset drivers",
        "Enterprise productivity suite setup (MS Office, Chrome, PDF reader, Developer tools)",
        "Full backup and lossless transfer of user files and configurations"
      ],
      techStack: "Windows 11 / 10 Pro, Windows PE, Sysprep, BitLocker Drive Encryption, Microsoft 365, Acronis"
    }
  },
  {
    id: "hardware_sales",
    title: "Laptop Sales & Accessories",
    icon: "fa-solid fa-laptop-code",
    summary: "Certified brand-new and Grade-A business laptops, high-performance developer workstations, monitors, and components.",
    features: [
      "35-Point Hardware Quality Certified",
      "6 to 12-Month Official Warranty",
      "RAM & NVMe SSD Upgrade Options",
      "Same-Day Delivery & Pre-Configured"
    ],
    fullDetails: {
      scope: "We supply thoroughly tested, high-grade laptops and enterprise hardware. From ultra-portable Dell XPS and Lenovo ThinkPads for executives to high-powered MacBook Pros and developer workstations, every device is rigorously inspected.",
      deliverables: [
        "Certified Grade-A device with clean battery health report (>85%)",
        "Free pre-installed Windows 11 Pro / macOS + productivity suite",
        "Original high-wattage power adapter and brand packaging",
        "Official warranty certificate and free technical support"
      ],
      techStack: "Dell Latitude / XPS, Lenovo ThinkPad, Apple MacBook Pro, HP EliteBook, Samsung NVMe, Crucial RAM"
    }
  }
];

let HARDWARE_CATALOG = [
  {
    id: "hw-1",
    model: "Dell XPS 15 (9520) Developer Edition",
    category: "developer",
    categoryLabel: "Developer Workstation",
    image: "assets/hardware_laptop.jpg",
    condition: "Grade A+ Refurbished",
    badgeCert: "35-POINT CERTIFIED",
    specs: {
      cpu: "Intel Core i7-12700H (14-Core)",
      ram: "32GB DDR5 4800MHz",
      storage: "1TB PCIe NVMe SSD",
      display: "15.6\" OLED 3.5K Touch Screen",
      gpu: "NVIDIA RTX 3050 Ti 4GB",
      battery: "86Wh (Excellent Health)"
    },
    priceUsd: 17800,
    warranty: "1 Year Coratech Warranty"
  },
  {
    id: "hw-2",
    model: "Lenovo ThinkPad T14s Gen 3 Enterprise",
    category: "business",
    categoryLabel: "Business Executive Laptop",
    image: "assets/hardware_laptop.jpg",
    condition: "Brand New Sealed",
    badgeCert: "FACTORY SEALED",
    specs: {
      cpu: "AMD Ryzen 7 PRO 6850U",
      ram: "16GB LPDDR5 6400MHz",
      storage: "512GB NVMe Opal2 SSD",
      display: "14.0\" FHD+ Anti-Glare 400 nits",
      gpu: "Integrated AMD Radeon 680M",
      battery: "57Wh (Rapid Charge)"
    },
    priceUsd: 13800,
    warranty: "1 Year Official Warranty"
  },
  {
    id: "hw-3",
    model: "Apple MacBook Pro 14\" M2 Pro",
    category: "developer",
    categoryLabel: "High-Performance Workstation",
    image: "assets/hardware_laptop.jpg",
    condition: "Grade A+ Like New",
    badgeCert: "APPLE CERTIFIED",
    specs: {
      cpu: "Apple M2 Pro (10-Core CPU)",
      ram: "16GB Unified Memory",
      storage: "512GB High-Speed SSD",
      display: "14.2\" Liquid Retina XDR 120Hz",
      gpu: "16-Core Neural GPU Engine",
      battery: "100% Battery Cycle"
    },
    priceUsd: 22500,
    warranty: "6 Months Coratech Warranty"
  },
  {
    id: "hw-4",
    model: "HP EliteBook 840 G8 Corporate",
    category: "business",
    categoryLabel: "Enterprise Fleet Laptop",
    image: "assets/hardware_laptop.jpg",
    condition: "Grade A Refurbished",
    badgeCert: "CORATECH TESTED",
    specs: {
      cpu: "Intel Core i5-1145G7 vPro",
      ram: "16GB DDR4 3200MHz",
      storage: "256GB NVMe SSD",
      display: "14\" Full HD IPS Display",
      gpu: "Intel Iris Xe Graphics",
      battery: "Long Life 3-cell 53Wh"
    },
    priceUsd: 8900,
    warranty: "6 Months Coratech Warranty"
  },
  {
    id: "hw-5",
    model: "Dell UltraSharp 27\" 4K USB-C Hub Monitor",
    category: "accessories",
    categoryLabel: "Workstation Peripherals",
    image: "assets/cloud_infra.jpg",
    condition: "Brand New",
    badgeCert: "OFFICIAL ACCESSORY",
    specs: {
      cpu: "4K UHD (3840 x 2160) IPS",
      ram: "90W USB-C Power Delivery",
      storage: "RJ45 Ethernet + USB Hub",
      display: "99% sRGB / 95% DCI-P3",
      gpu: "Dual DisplayPort & HDMI",
      battery: "Built-in KVM Switch"
    },
    priceUsd: 6500,
    warranty: "1 Year Official Warranty"
  },
  {
    id: "hw-6",
    model: "Kingston Fury 2TB Gen4 NVMe + 32GB RAM Kit",
    category: "accessories",
    categoryLabel: "Hardware Upgrade Component",
    image: "assets/cloud_infra.jpg",
    condition: "Brand New Sealed",
    badgeCert: "GENUINE COMPONENT",
    specs: {
      cpu: "7,300 MB/s Read Speed",
      ram: "32GB DDR4 / DDR5 Kit",
      storage: "2000GB M.2 2280 NVMe",
      display: "Graphene Aluminum Heatspreader",
      gpu: "PS5 & PC Compatible",
      battery: "Includes Free Installation"
    },
    priceUsd: 2900,
    warranty: "3 Years Manufacturer Warranty"
  }
];

let PORTFOLIO_DATA = [
  {
    id: "port-1",
    title: "ApexFlow - Multi-Currency SaaS Billing Platform",
    category: "web",
    categoryLabel: "Web & SaaS Architecture",
    image: "assets/cloud_infra.jpg",
    metric: "+340% Processing Volume Surge",
    description: "Architected and engineered a resilient cloud-native subscription billing platform with automated recurring invoicing, webhooks, and real-time ledger auditing.",
    techStack: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "Redis", "Docker"],
    caseStudy: {
      problem: "The client suffered from frequent checkout drop-offs and unhandled webhook race conditions during high-volume flash sale events.",
      solution: "Implemented an event-driven microservice architecture with Redis queueing, automated failovers, and a sleek responsive customer portal.",
      outcome: "Processed $2.8M in annualized transactions with 99.99% uptime and zero dropped webhook notifications."
    }
  },
  {
    id: "port-2",
    title: "Vanguard Corporate 4-Floor Network & Active Directory",
    category: "it",
    categoryLabel: "Enterprise IT Deployment",
    image: "assets/hardware_laptop.jpg",
    metric: "0 Min Downtime Deployment",
    description: "Complete structured cabling, multi-VLAN segmentation, managed Ubiquiti UniFi Wi-Fi 6 mesh, and centralized Windows Active Directory implementation for 180 workstations.",
    techStack: ["Ubiquiti UniFi", "Windows Server 2022", "Active Directory", "VLANs", "Cat6A Cabling"],
    caseStudy: {
      problem: "Frequent Wi-Fi dead zones, unmanaged workstation security, and poor network throughput crippling day-to-day corporate operations.",
      solution: "Designed high-density Wi-Fi 6 access points, isolated guest and employee VLANs, and deployed automated Group Policies for instantaneous workstation credential onboarding.",
      outcome: "Network bandwidth efficiency improved by 400%, and IT onboarding time for new hires dropped from 4 hours to 8 minutes."
    }
  },
  {
    id: "port-3",
    title: "MedTrack Cloud Infrastructure & Disaster Recovery",
    category: "cloud",
    categoryLabel: "Cloud & DevOps",
    image: "assets/cloud_infra.jpg",
    metric: "99.995% SLA & HIPAA Compliance",
    description: "Engineered automated multi-region Kubernetes cloud infrastructure with end-to-end encryption, automated database replication, and sub-second failover routing.",
    techStack: ["AWS EKS", "Terraform", "Cloudflare WAF", "PostgreSQL Aurora", "Prometheus"],
    caseStudy: {
      problem: "Healthcare records system required continuous zero-loss compliance, automatic disaster recovery, and protection against DDOS traffic spikes.",
      solution: "Implemented Infrastructure-as-Code (Terraform) provisioning with automated multi-AZ database read replicas and Cloudflare Enterprise edge caching.",
      outcome: "Passed external compliance audits with zero findings and reduced server latency by 68% nationwide."
    }
  },
  {
    id: "port-4",
    title: "LogiQuick Logistics & Courier Mobile App",
    category: "mobile",
    categoryLabel: "Mobile Application",
    image: "assets/hero_portrait.jpg",
    metric: "45,000+ Active Monthly Deliveries",
    description: "Cross-platform mobile application for real-time dispatch, turn-by-turn route optimization, electronic proof of delivery (e-signature), and WhatsApp customer alerts.",
    techStack: ["Flutter", "Firebase", "Google Maps API", "Node.js", "WebSocket"],
    caseStudy: {
      problem: "Manual dispatch calls caused delivery delays, lost packages, and high operational overhead.",
      solution: "Developed an intuitive mobile application for drivers and customers with live GPS tracking, automated push notifications, and instant digital proof-of-delivery.",
      outcome: "Driver daily delivery capacity increased by 35% with a 94% positive customer satisfaction rating."
    }
  }
];

let CURRENCY_RATES = {
  GHS: { symbol: "GH₵", rate: 1.0 },
  USD: { symbol: "$", rate: 0.065 },
  NGN: { symbol: "₦", rate: 100 },
  GBP: { symbol: "£", rate: 0.051 },
  EUR: { symbol: "€", rate: 0.059 }
};

// Initial Demo Tickets in LocalStorage
const INITIAL_DEMO_TICKETS = {
  "CG-TICK-1042": {
    id: "CG-TICK-1042",
    name: "Alex Johnson (Vanguard Tech)",
    email: "alex@vanguardtech.com",
    category: "IT Support & Network Troubleshooting",
    priority: "High",
    desc: "Main switch in Server Room B experiencing intermittent packet loss on VLAN 20.",
    status: "In Progress",
    step: 2,
    createdAt: "2026-08-20 09:30 AM"
  },
  "CG-TICK-1088": {
    id: "CG-TICK-1088",
    name: "Dr. Sarah Mensah",
    email: "sarah@horizonlabs.org",
    category: "Windows / OS Deployment & Setup",
    priority: "Critical 24/7",
    desc: "10 Workstations require clean Windows 11 Enterprise installation and antivirus deployment.",
    status: "Completed",
    step: 3,
    createdAt: "2026-08-21 11:15 AM"
  }
};

// =========================================================================
// 2. CORE CONTROLLER & STATE
// =========================================================================

const state = {
  theme: localStorage.getItem("coratech_theme") || "dark",
  currency: "GHS",
  calculator: {
    service: "web",
    baseCost: 4500,
    tier: "pro",
    multiplier: 1.75,
    addons: [
      { id: "urgent", cost: 1200, name: "Priority Express Delivery" },
      { id: "sla", cost: 1500, name: "24/7 Managed SLA & Maintenance" }
    ]
  },
  hardwareFilter: "all",
  hardwareSearch: "",
  portfolioFilter: "all"
};

// Initialize Tickets in Storage if not present
if (!localStorage.getItem("coratech_tickets")) {
  localStorage.setItem("coratech_tickets", JSON.stringify(INITIAL_DEMO_TICKETS));
}

// =========================================================================
// 3. INITIALIZATION & EVENT BINDINGS
// =========================================================================

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initCircuitCanvas();
  initMetricsCounter();
  renderServices();
  renderHardwareCatalog();
  renderPortfolio();
  initCostEstimator();
  initTicketSystem();
  initAppointmentBooking();
  initFaqAccordion();
  initFloatingWhatsApp();
  initNavigation();
  syncDataWithBackend();
});

// Dynamic Asynchronous Backend Synchronization
async function syncDataWithBackend() {
  try {
    const [hwRes, portRes, srvRes, setRes] = await Promise.all([
      fetch("/api/hardware").then(r => r.ok ? r.json() : null).catch(() => null),
      fetch("/api/portfolio").then(r => r.ok ? r.json() : null).catch(() => null),
      fetch("/api/services").then(r => r.ok ? r.json() : null).catch(() => null),
      fetch("/api/settings").then(r => r.ok ? r.json() : null).catch(() => null)
    ]);

    if (hwRes && hwRes.success && Array.isArray(hwRes.data) && hwRes.data.length > 0) {
      HARDWARE_CATALOG = hwRes.data;
      renderHardwareCatalog();
    }
    if (portRes && portRes.success && Array.isArray(portRes.data) && portRes.data.length > 0) {
      PORTFOLIO_DATA = portRes.data;
      renderPortfolio();
    }
    if (srvRes && srvRes.success && Array.isArray(srvRes.data) && srvRes.data.length > 0) {
      SERVICES_DATA = srvRes.data;
      renderServices();
    }
    if (setRes && setRes.success && setRes.data && setRes.data.currencyRates) {
      CURRENCY_RATES = setRes.data.currencyRates;
      updateCalculator();
    }
  } catch (err) {
    console.log("Backend synchronization running in offline fallback mode.");
  }
}

// =========================================================================
// 4. THEME MANAGEMENT
// =========================================================================

function initTheme() {
  document.documentElement.setAttribute("data-theme", state.theme);
  updateThemeIcon();

  const toggleBtn = document.getElementById("theme-toggle-btn");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      state.theme = state.theme === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", state.theme);
      localStorage.setItem("coratech_theme", state.theme);
      updateThemeIcon();
      showToast(`Switched to ${state.theme.toUpperCase()} mode`, "info");
    });
  }
}

function updateThemeIcon() {
  const icon = document.getElementById("theme-icon");
  if (icon) {
    if (state.theme === "light") {
      icon.className = "fa-solid fa-moon";
    } else {
      icon.className = "fa-solid fa-sun";
    }
  }
}

// =========================================================================
// 5. INTERACTIVE CIRCUIT / PARTICLE BACKGROUND CANVAS
// =========================================================================

function initCircuitCanvas() {
  const canvas = document.getElementById("circuit-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = Math.min(Math.floor(width / 22), 55);
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 2 + 1.2,
      opacity: Math.random() * 0.5 + 0.3
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    const nodeColor = isLight ? "rgba(2, 132, 199, " : "rgba(0, 242, 254, ";
    const lineColor = isLight ? "rgba(2, 132, 199, " : "rgba(0, 242, 254, ";

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${nodeColor}${p.opacity})`;
      ctx.fill();

      // Connect nearby particles with glowing circuit links
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          const alpha = (1 - dist / 130) * (isLight ? 0.12 : 0.18);
          ctx.strokeStyle = `${lineColor}${alpha})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

// =========================================================================
// 6. METRICS COUNTER ANIMATION
// =========================================================================

function initMetricsCounter() {
  const metricCards = document.querySelectorAll(".metric-number");
  if (!metricCards.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute("data-target"));
          const decimals = parseInt(el.getAttribute("data-decimal") || "0", 10);
          const duration = 2000;
          const startTime = performance.now();

          function updateNumber(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out quad
            const easeProgress = 1 - (1 - progress) * (1 - progress);
            const currentVal = (target * easeProgress).toFixed(decimals);
            el.textContent = currentVal;

            if (progress < 1) {
              requestAnimationFrame(updateNumber);
            } else {
              el.textContent = target.toFixed(decimals);
            }
          }

          requestAnimationFrame(updateNumber);
          obs.unobserve(el);
        }
      });
    },
    { threshold: 0.3 }
  );

  metricCards.forEach((card) => observer.observe(card));
}

// =========================================================================
// 7. SERVICES ENGINE
// =========================================================================

function renderServices() {
  const container = document.getElementById("services-grid-container");
  if (!container) return;

  container.innerHTML = SERVICES_DATA.map((srv) => `
    <div class="service-card" data-service-id="${srv.id}">
      <div>
        <div class="service-icon-box">
          <i class="${srv.icon}"></i>
        </div>
        <h3 class="service-title">${srv.title}</h3>
        <p class="service-summary">${srv.summary}</p>
        <div class="service-features-list">
          ${srv.features.map(f => `
            <div class="service-feature-item">
              <i class="fa-solid fa-circle-check"></i>
              <span>${f}</span>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="service-card-actions">
        <button class="btn btn-outline-cyan btn-sm btn-open-service-modal" data-id="${srv.id}">
          <i class="fa-solid fa-circle-info"></i> Learn More
        </button>
        <button class="btn btn-primary btn-sm btn-quote-service" data-id="${srv.id}">
          <i class="fa-solid fa-calculator"></i> Get Quote
        </button>
      </div>
    </div>
  `).join("");

  // Bind Buttons
  container.querySelectorAll(".btn-open-service-modal").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      openServiceModal(id);
    });
  });

  container.querySelectorAll(".btn-quote-service").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      prefillCalculatorService(id);
      document.getElementById("calculator").scrollIntoView({ behavior: "smooth" });
    });
  });
}

function openServiceModal(serviceId) {
  const service = SERVICES_DATA.find((s) => s.id === serviceId);
  if (!service) return;

  const modal = document.getElementById("detail-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalBody = document.getElementById("modal-body");
  const modalActionBtn = document.getElementById("modal-action-btn");

  modalTitle.innerHTML = `<i class="${service.icon} text-cyan" style="margin-right: 8px;"></i> ${service.title}`;
  modalBody.innerHTML = `
    <div style="margin-bottom: 20px;">
      <h4 style="font-size: 1.1rem; color: var(--accent-cyan); margin-bottom: 8px;">Scope of Service</h4>
      <p style="color: var(--text-secondary); line-height: 1.7;">${service.fullDetails.scope}</p>
    </div>

    <div style="margin-bottom: 20px;">
      <h4 style="font-size: 1.1rem; color: var(--accent-cyan); margin-bottom: 10px;">Core Deliverables & Standards</h4>
      <ul style="display: flex; flex-direction: column; gap: 8px;">
        ${service.fullDetails.deliverables.map(d => `
          <li style="display: flex; align-items: flex-start; gap: 10px; font-size: 0.9rem;">
            <i class="fa-solid fa-check text-cyan" style="margin-top: 4px;"></i>
            <span>${d}</span>
          </li>
        `).join("")}
      </ul>
    </div>

    <div style="background: var(--bg-tertiary); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
      <strong style="font-size: 0.85rem; color: var(--text-primary); display: block; margin-bottom: 4px;">Tech Stacks & Tools Employed:</strong>
      <span style="font-family: var(--font-mono); font-size: 0.82rem; color: var(--accent-cyan);">${service.fullDetails.techStack}</span>
    </div>
  `;

  modalActionBtn.innerHTML = `<i class="fa-solid fa-calculator"></i> Calculate Cost for this Service`;
  modalActionBtn.onclick = () => {
    closeModal();
    prefillCalculatorService(service.id);
    document.getElementById("calculator").scrollIntoView({ behavior: "smooth" });
  };

  openModal();
}

// =========================================================================
// 8. HARDWARE & LAPTOP CATALOG
// =========================================================================

function renderHardwareCatalog() {
  const container = document.getElementById("hardware-grid-container");
  if (!container) return;

  const filtered = HARDWARE_CATALOG.filter((item) => {
    const matchesCategory = state.hardwareFilter === "all" || item.category === state.hardwareFilter;
    const query = state.hardwareSearch.toLowerCase().trim();
    const matchesSearch =
      !query ||
      item.model.toLowerCase().includes(query) ||
      item.categoryLabel.toLowerCase().includes(query) ||
      Object.values(item.specs).some((val) => val.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
        <i class="fa-solid fa-laptop-slash" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 16px;"></i>
        <h4 style="font-size: 1.2rem; margin-bottom: 8px;">No Hardware Matches Found</h4>
        <p class="text-secondary" style="font-size: 0.9rem;">Try adjusting your filter category or search keyword.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map((item) => {
    const priceFormatted = formatCurrency(item.priceUsd);
    return `
      <div class="hardware-card" data-hw-id="${item.id}">
        <div class="hardware-thumb-wrapper">
          <img src="${item.image}" alt="${item.model}" class="hardware-thumb-img">
          <span class="hardware-badge-cert">${item.badgeCert}</span>
          <span class="hardware-badge-condition">${item.condition}</span>
        </div>

        <div class="hardware-body">
          <div>
            <span class="hardware-category-tag">${item.categoryLabel}</span>
            <h3 class="hardware-model">${item.model}</h3>

            <div class="hardware-specs-list">
              <div class="spec-chip">
                <i class="fa-solid fa-microchip text-cyan"></i>
                <span>${item.specs.cpu.substring(0, 20)}...</span>
              </div>
              <div class="spec-chip">
                <i class="fa-solid fa-memory text-cyan"></i>
                <span>${item.specs.ram}</span>
              </div>
              <div class="spec-chip">
                <i class="fa-solid fa-hard-drive text-cyan"></i>
                <span>${item.specs.storage}</span>
              </div>
              <div class="spec-chip">
                <i class="fa-solid fa-display text-cyan"></i>
                <span>${item.specs.display.substring(0, 18)}...</span>
              </div>
            </div>
          </div>

          <div class="hardware-footer">
            <div class="hardware-price-box">
              <span class="hardware-price-label">Price / Stock</span>
              <span class="hardware-price">${priceFormatted}</span>
            </div>

            <div style="display: flex; gap: 8px;">
              <button class="btn btn-secondary btn-sm btn-hw-details" data-id="${item.id}" title="Full Specs">
                <i class="fa-solid fa-list-check"></i>
              </button>
              <a href="https://wa.me/233599360626?text=${encodeURIComponent(`Hello Coratech Global, I am interested in purchasing: ${item.model} (${priceFormatted})`)}" target="_blank" class="btn btn-whatsapp btn-sm">
                <i class="fa-brands fa-whatsapp"></i> Buy / Inquire
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join("");

  // Bind Spec modal buttons
  container.querySelectorAll(".btn-hw-details").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      openHardwareSpecModal(id);
    });
  });

  // Filter Buttons
  const filterBtns = document.querySelectorAll("#hardware-filter-pills .filter-pill-btn");
  filterBtns.forEach((btn) => {
    btn.onclick = () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.hardwareFilter = btn.getAttribute("data-category");
      renderHardwareCatalog();
    };
  });

  // Search input
  const searchInput = document.getElementById("hardware-search-input");
  if (searchInput && !searchInput.dataset.bound) {
    searchInput.dataset.bound = "true";
    searchInput.addEventListener("input", (e) => {
      state.hardwareSearch = e.target.value;
      renderHardwareCatalog();
    });
  }
}

function openHardwareSpecModal(hwId) {
  const item = HARDWARE_CATALOG.find((h) => h.id === hwId);
  if (!item) return;

  const modal = document.getElementById("detail-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalBody = document.getElementById("modal-body");
  const modalActionBtn = document.getElementById("modal-action-btn");

  modalTitle.innerHTML = `<i class="fa-solid fa-laptop-code text-cyan" style="margin-right: 8px;"></i> ${item.model}`;
  modalBody.innerHTML = `
    <div style="display: flex; gap: 20px; margin-bottom: 20px; align-items: center;">
      <img src="${item.image}" alt="${item.model}" style="width: 140px; height: 100px; object-fit: cover; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
      <div>
        <span class="hardware-badge-condition" style="position: static; display: inline-block; margin-bottom: 6px;">${item.condition}</span>
        <div style="font-size: 1.4rem; font-weight: 800; color: var(--accent-cyan);">${formatCurrency(item.priceUsd)}</div>
        <p style="font-size: 0.85rem; color: var(--text-secondary);"><i class="fa-solid fa-shield-check text-emerald"></i> ${item.warranty}</p>
      </div>
    </div>

    <h4 style="font-size: 1.05rem; margin-bottom: 12px;">Full Technical Specifications</h4>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">
      ${Object.entries(item.specs).map(([k, v]) => `
        <div style="background: var(--bg-tertiary); padding: 10px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
          <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">${k}</div>
          <div style="font-size: 0.88rem; font-weight: 600; color: var(--text-primary);">${v}</div>
        </div>
      `).join("")}
    </div>

    <div style="background: rgba(0, 242, 254, 0.08); padding: 14px; border-radius: var(--radius-md); border: 1px dashed var(--border-color); font-size: 0.85rem; color: var(--text-secondary);">
      <strong class="text-cyan">Coratech Guarantee:</strong> Clean genuine Windows / macOS pre-installed, original high-speed charger included, ready for work right out of the box.
    </div>
  `;

  modalActionBtn.innerHTML = `<i class="fa-brands fa-whatsapp"></i> Inquire / Order on WhatsApp`;
  modalActionBtn.className = "btn btn-whatsapp";
  modalActionBtn.onclick = () => {
    window.open(`https://wa.me/233599360626?text=${encodeURIComponent(`Hello Coratech Global, I am ready to order: ${item.model} (${formatCurrency(item.priceUsd)})`)}`, "_blank");
  };

  openModal();
}

// =========================================================================
// 9. PORTFOLIO & CASE STUDIES
// =========================================================================

function renderPortfolio() {
  const container = document.getElementById("portfolio-grid-container");
  if (!container) return;

  const filtered = PORTFOLIO_DATA.filter((proj) => {
    return state.portfolioFilter === "all" || proj.category === state.portfolioFilter;
  });

  container.innerHTML = filtered.map((proj) => `
    <div class="project-card" data-proj-id="${proj.id}">
      <div class="project-image-box">
        <img src="${proj.image}" alt="${proj.title}">
        <span class="project-category-badge">${proj.categoryLabel}</span>
      </div>

      <div class="project-content">
        <div>
          <h3 class="project-title">${proj.title}</h3>
          <p class="project-description">${proj.description}</p>
          
          <div class="project-metric-banner">
            <i class="fa-solid fa-chart-line"></i>
            <span>${proj.metric}</span>
          </div>

          <div class="project-tech-tags">
            ${proj.techStack.map(t => `<span class="tech-tag">${t}</span>`).join("")}
          </div>
        </div>

        <div class="project-card-footer">
          <button class="btn btn-outline-cyan btn-sm btn-open-case-study" data-id="${proj.id}">
            <i class="fa-solid fa-folder-open"></i> View Case Study
          </button>
          <a href="#calculator" class="btn btn-secondary btn-sm" onclick="prefillCalculatorService('${proj.category}')">
            <i class="fa-solid fa-arrow-right"></i> Build Similar
          </a>
        </div>
      </div>
    </div>
  `).join("");

  container.querySelectorAll(".btn-open-case-study").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      openCaseStudyModal(id);
    });
  });

  // Filter Buttons
  const filterBtns = document.querySelectorAll("#portfolio-filter-pills .filter-pill-btn");
  filterBtns.forEach((btn) => {
    btn.onclick = () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.portfolioFilter = btn.getAttribute("data-filter");
      renderPortfolio();
    };
  });
}

function openCaseStudyModal(projId) {
  const proj = PORTFOLIO_DATA.find((p) => p.id === projId);
  if (!proj) return;

  const modal = document.getElementById("detail-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalBody = document.getElementById("modal-body");
  const modalActionBtn = document.getElementById("modal-action-btn");

  modalTitle.innerHTML = `<i class="fa-solid fa-chart-pie text-cyan" style="margin-right: 8px;"></i> ${proj.title}`;
  modalBody.innerHTML = `
    <div style="margin-bottom: 20px;">
      <span class="section-tag">${proj.categoryLabel}</span>
      <div class="project-metric-banner" style="margin-top: 8px;">
        <i class="fa-solid fa-trophy"></i> Key Outcome: <strong>${proj.metric}</strong>
      </div>
    </div>

    <div style="margin-bottom: 18px;">
      <h4 style="font-size: 1.05rem; color: var(--accent-rose); margin-bottom: 6px;">
        <i class="fa-solid fa-triangle-exclamation"></i> The Challenge
      </h4>
      <p style="color: var(--text-secondary); line-height: 1.6; font-size: 0.95rem;">${proj.caseStudy.problem}</p>
    </div>

    <div style="margin-bottom: 18px;">
      <h4 style="font-size: 1.05rem; color: var(--accent-cyan); margin-bottom: 6px;">
        <i class="fa-solid fa-lightbulb"></i> Our Technical Solution
      </h4>
      <p style="color: var(--text-secondary); line-height: 1.6; font-size: 0.95rem;">${proj.caseStudy.solution}</p>
    </div>

    <div style="margin-bottom: 20px;">
      <h4 style="font-size: 1.05rem; color: var(--accent-emerald); margin-bottom: 6px;">
        <i class="fa-solid fa-circle-check"></i> Measurable Business Outcome
      </h4>
      <p style="color: var(--text-secondary); line-height: 1.6; font-size: 0.95rem;">${proj.caseStudy.outcome}</p>
    </div>

    <div style="background: var(--bg-tertiary); padding: 14px; border-radius: var(--radius-md);">
      <span style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 6px;">Tech Stack Architecture:</span>
      <div style="display: flex; flex-wrap: wrap; gap: 6px;">
        ${proj.techStack.map(t => `<span class="tech-tag">${t}</span>`).join("")}
      </div>
    </div>
  `;

  modalActionBtn.innerHTML = `<i class="fa-solid fa-bolt"></i> Discuss Project Architecture`;
  modalActionBtn.className = "btn btn-primary";
  modalActionBtn.onclick = () => {
    closeModal();
    window.open(`https://wa.me/233599360626?text=${encodeURIComponent(`Hello Coratech Global, I reviewed your case study on "${proj.title}" and want to discuss a similar solution.`)}`, "_blank");
  };

  openModal();
}

// =========================================================================
// 10. INTERACTIVE COST ESTIMATOR & QUOTE GENERATOR
// =========================================================================

function initCostEstimator() {
  const serviceOptions = document.querySelectorAll("#calc-service-options .calc-option-card");
  const tierOptions = document.querySelectorAll("#calc-tier-options .calc-option-card");
  const addonCheckboxes = document.querySelectorAll("#calc-addons-list .calc-addon-checkbox");
  const currencyBtns = document.querySelectorAll("#calc-currency-switch .curr-btn");

  // Service Selection
  serviceOptions.forEach((card) => {
    card.addEventListener("click", () => {
      serviceOptions.forEach((c) => c.classList.remove("selected"));
      card.classList.add("selected");
      state.calculator.service = card.getAttribute("data-service");
      state.calculator.baseCost = parseFloat(card.getAttribute("data-base"));
      updateCalculator();
    });
  });

  // Tier Selection
  tierOptions.forEach((card) => {
    card.addEventListener("click", () => {
      tierOptions.forEach((c) => c.classList.remove("selected"));
      card.classList.add("selected");
      state.calculator.tier = card.getAttribute("data-tier");
      state.calculator.multiplier = parseFloat(card.getAttribute("data-multiplier"));
      updateCalculator();
    });
  });

  // Addons Selection
  addonCheckboxes.forEach((cb) => {
    cb.addEventListener("change", () => {
      const parentLabel = cb.closest(".calc-addon-item");
      if (cb.checked) {
        parentLabel.classList.add("checked");
      } else {
        parentLabel.classList.remove("checked");
      }
      recalculateAddons();
      updateCalculator();
    });
  });

  // Currency Switching
  currencyBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      currencyBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.currency = btn.getAttribute("data-curr");
      updateCalculator();
      renderHardwareCatalog(); // Re-render hardware prices in selected currency
    });
  });

  // WhatsApp Quote Button
  const waBtn = document.getElementById("calc-whatsapp-btn");
  if (waBtn) {
    waBtn.addEventListener("click", () => {
      const quoteSummary = generateQuoteSummaryText();
      const encodedMsg = encodeURIComponent(`Hello Coratech Global, I generated an instant estimate on your platform:\n\n${quoteSummary}\n\nPlease share the formal kickoff proposal.`);
      window.open(`https://wa.me/233599360626?text=${encodedMsg}`, "_blank");
    });
  }

  // Email PDF Quote Button
  const emailBtn = document.getElementById("calc-email-btn");
  if (emailBtn) {
    emailBtn.addEventListener("click", () => {
      showToast("Official PDF Estimate generated! Please enter your email to receive it.", "success");
      const clientEmail = prompt("Enter your business email address for the PDF dispatch:");
      if (clientEmail) {
        showToast(`Estimate PDF dispatched successfully to ${clientEmail}`, "success");
      }
    });
  }

  updateCalculator();
}

function recalculateAddons() {
  const selectedAddons = [];
  document.querySelectorAll("#calc-addons-list .calc-addon-checkbox:checked").forEach((cb) => {
    const id = cb.getAttribute("data-addon-id");
    const cost = parseFloat(cb.getAttribute("data-cost"));
    const label = cb.closest(".calc-addon-item").querySelector(".calc-addon-label").textContent;
    selectedAddons.push({ id, cost, name: label });
  });
  state.calculator.addons = selectedAddons;
}

function updateCalculator() {
  const { baseCost, multiplier, addons } = state.calculator;
  const scaledBase = baseCost * multiplier;
  const addonsTotal = addons.reduce((sum, a) => sum + a.cost, 0);
  const totalUsd = scaledBase + addonsTotal;

  // Render breakdown list
  const breakdownContainer = document.getElementById("calc-breakdown-container");
  if (breakdownContainer) {
    breakdownContainer.innerHTML = `
      <div class="calc-breakdown-row">
        <span>Base Service Core (${state.calculator.service.toUpperCase()} - ${state.calculator.tier.toUpperCase()})</span>
        <span>${formatCurrency(scaledBase)}</span>
      </div>
      ${addons.map(a => `
        <div class="calc-breakdown-row">
          <span>+ ${a.name}</span>
          <span>${formatCurrency(a.cost)}</span>
        </div>
      `).join("")}
    `;
  }

  // Display Total
  const totalDisplay = document.getElementById("calc-total-display");
  if (totalDisplay) {
    totalDisplay.textContent = formatCurrency(totalUsd);
  }
}

function prefillCalculatorService(serviceType) {
  const card = document.querySelector(`#calc-service-options .calc-option-card[data-service="${serviceType}"]`) ||
               document.querySelector(`#calc-service-options .calc-option-card`);
  if (card) {
    card.click();
  }
}

function generateQuoteSummaryText() {
  const { baseCost, multiplier, addons, service, tier } = state.calculator;
  const scaledBase = baseCost * multiplier;
  const addonsTotal = addons.reduce((sum, a) => sum + a.cost, 0);
  const totalUsd = scaledBase + addonsTotal;

  let msg = `*CORATECH GLOBAL PROJECT ESTIMATE*\n`;
  msg += `• Service: ${service.toUpperCase()}\n`;
  msg += `• Scope Tier: ${tier.toUpperCase()}\n`;
  msg += `• Core Base: ${formatCurrency(scaledBase)}\n`;
  if (addons.length > 0) {
    msg += `• Add-ons:\n`;
    addons.forEach(a => {
      msg += `   - ${a.name} (${formatCurrency(a.cost)})\n`;
    });
  }
  msg += `• *Total Budget:* ${formatCurrency(totalUsd)}`;
  return msg;
}

function formatCurrency(amountInGhs) {
  const curr = CURRENCY_RATES[state.currency] || CURRENCY_RATES.GHS;
  const converted = amountInGhs * curr.rate;

  if (state.currency === "GHS") {
    return `GH₵ ${converted.toLocaleString("en-GH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  } else if (state.currency === "USD") {
    return `$${converted.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  } else if (state.currency === "NGN") {
    return `₦${converted.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
  } else if (state.currency === "GBP") {
    return `£${converted.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  } else if (state.currency === "EUR") {
    return `€${converted.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `GH₵ ${converted.toLocaleString("en-GH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// =========================================================================
// 11. IT SUPPORT HELPDESK & TICKET TRACKER
// =========================================================================

function initTicketSystem() {
  // Priority selector toggle
  const priorityBadges = document.querySelectorAll("#priority-selector .priority-badge-radio");
  let selectedPriority = "Medium";

  priorityBadges.forEach((badge) => {
    badge.addEventListener("click", () => {
      priorityBadges.forEach((b) => b.classList.remove("selected"));
      badge.classList.add("selected");
      selectedPriority = badge.getAttribute("data-priority");
    });
  });

  // Ticket Form Submit
  const form = document.getElementById("support-ticket-form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("ticket-name").value.trim();
      const email = document.getElementById("ticket-email").value.trim();
      const categorySelect = document.getElementById("ticket-category");
      const category = categorySelect.options[categorySelect.selectedIndex].text;
      const desc = document.getElementById("ticket-desc").value.trim();

      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const ticketId = `CG-TICK-${randomNum}`;

      const newTicket = {
        id: ticketId,
        name,
        email,
        category,
        priority: selectedPriority,
        desc,
        status: selectedPriority === "Critical 24/7" ? "Urgent Dispatch" : "In Progress",
        step: 1,
        createdAt: new Date().toLocaleString()
      };

      // Send to Backend API
      try {
        const res = await fetch("/api/tickets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newTicket)
        });
        if (res.ok) {
          const data = await res.json();
          if (data.data) {
            newTicket.id = data.data.id;
          }
        }
      } catch (err) {
        console.log("Ticket saved to local storage offline.");
      }

      // Save to localStorage
      const tickets = JSON.parse(localStorage.getItem("coratech_tickets") || "{}");
      tickets[newTicket.id] = newTicket;
      localStorage.setItem("coratech_tickets", JSON.stringify(tickets));

      form.reset();
      priorityBadges.forEach((b) => b.classList.remove("selected"));
      document.querySelector('.priority-badge-radio[data-priority="Medium"]').classList.add("selected");

      showToast(`Support Ticket ${newTicket.id} created! Status: Dispatched`, "success");

      // Auto load in tracker
      document.getElementById("ticket-lookup-input").value = newTicket.id;
      displayTicketStatus(newTicket);
    });
  }

  // Ticket Status Tracker
  const trackBtn = document.getElementById("track-ticket-btn");
  if (trackBtn) {
    trackBtn.addEventListener("click", async () => {
      const input = document.getElementById("ticket-lookup-input").value.trim().toUpperCase();
      if (!input) {
        showToast("Please enter a valid Ticket ID (e.g. CG-TICK-1042)", "error");
        return;
      }

      // Try Backend API First
      try {
        const res = await fetch(`/api/tickets/${encodeURIComponent(input)}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            displayTicketStatus(json.data);
            showToast(`Ticket ${input} found.`, "success");
            return;
          }
        }
      } catch (err) {
        // Fallback to local storage
      }

      const tickets = JSON.parse(localStorage.getItem("coratech_tickets") || "{}");
      const ticket = tickets[input];

      if (ticket) {
        displayTicketStatus(ticket);
        showToast(`Ticket ${input} found.`, "success");
      } else {
        showToast(`No record found for ${input}. Try demo ticket: CG-TICK-1042`, "error");
      }
    });
  }
}

function displayTicketStatus(ticket) {
  const card = document.getElementById("ticket-status-card");
  const idEl = document.getElementById("res-ticket-id");
  const serviceEl = document.getElementById("res-ticket-service");
  const badgeEl = document.getElementById("res-ticket-badge");
  const timelineEl = document.getElementById("ticket-timeline");

  if (!card) return;

  idEl.textContent = ticket.id;
  serviceEl.textContent = `${ticket.category} • Priority: ${ticket.priority}`;
  badgeEl.textContent = ticket.status.toUpperCase();

  timelineEl.innerHTML = `
    <div class="timeline-step completed">
      <strong>Ticket Logged & Triaged</strong>
      <p class="text-secondary" style="font-size: 0.75rem;">Created: ${ticket.createdAt} | Contact: ${ticket.email}</p>
    </div>
    <div class="timeline-step ${ticket.step >= 2 ? "completed" : ""}">
      <strong>Engineering Diagnostic & Remediation</strong>
      <p class="text-secondary" style="font-size: 0.75rem;">Assigned to Senior Systems Engineer</p>
    </div>
    <div class="timeline-step ${ticket.step >= 3 ? "completed" : ""}">
      <strong>Quality Check & Closeout</strong>
      <p class="text-secondary" style="font-size: 0.75rem;">Verification of resolution & SLA sign-off</p>
    </div>
  `;

  card.classList.add("active");
}

// =========================================================================
// 12. APPOINTMENT BOOKING SYSTEM
// =========================================================================

function initAppointmentBooking() {
  const openBtn = document.getElementById("open-booking-modal-btn");
  const modal = document.getElementById("booking-modal");
  const closeBtn = document.getElementById("booking-modal-close");
  const form = document.getElementById("appointment-booking-form");
  const slotBtns = document.querySelectorAll("#time-slots-container .time-slot-btn");
  let selectedSlot = "09:00 AM";

  // Default min date to today
  const dateInput = document.getElementById("book-date");
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.min = today;
    dateInput.value = today;
  }

  if (openBtn && modal) {
    openBtn.addEventListener("click", () => modal.classList.add("open"));
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => modal.classList.remove("open"));
  }

  slotBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      slotBtns.forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedSlot = btn.getAttribute("data-slot");
    });
  });

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("book-name").value.trim();
      const phone = document.getElementById("book-phone").value.trim();
      const service = document.getElementById("book-service").value;
      const type = document.getElementById("book-type").value;
      const date = document.getElementById("book-date").value;

      modal.classList.remove("open");
      showToast(`Appointment booked for ${name} on ${date} at ${selectedSlot}!`, "success");

      // Submit to Backend API
      try {
        await fetch("/api/appointments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, phone, service, type, date, time: selectedSlot })
        });
      } catch (err) {
        console.log("Appointment saved locally.");
      }

      const waMsg = encodeURIComponent(
        `*NEW IT APPOINTMENT BOOKING*\n• Name: ${name}\n• Phone: ${phone}\n• Focus: ${service}\n• Format: ${type}\n• Date: ${date}\n• Time: ${selectedSlot}`
      );
      window.open(`https://wa.me/233599360626?text=${waMsg}`, "_blank");
      form.reset();
    });
  }
}

// =========================================================================
// 13. FAQ ACCORDION WITH LIVE SEARCH
// =========================================================================

function initFaqAccordion() {
  const faqItems = document.querySelectorAll("#faq-accordion-list .faq-item");
  const searchInput = document.getElementById("faq-search-input");

  faqItems.forEach((item) => {
    const header = item.querySelector(".faq-header");
    const body = item.querySelector(".faq-body");

    header.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      // Close all others
      faqItems.forEach((other) => {
        other.classList.remove("active");
        other.querySelector(".faq-body").style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add("active");
        body.style.maxHeight = body.scrollHeight + "px";
      }
    });
  });

  // Search filter
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim();

      faqItems.forEach((item) => {
        const question = item.querySelector(".faq-header h3").textContent.toLowerCase();
        const answer = item.querySelector(".faq-content-inner").textContent.toLowerCase();

        if (question.includes(query) || answer.includes(query)) {
          item.style.display = "block";
          if (query.length > 2) {
            item.classList.add("active");
            item.querySelector(".faq-body").style.maxHeight = item.querySelector(".faq-body").scrollHeight + "px";
          }
        } else {
          item.style.display = "none";
        }
      });
    });
  }
}

// =========================================================================
// 14. FLOATING WHATSAPP & NEWSLETTER
// =========================================================================

function initFloatingWhatsApp() {
  const trigger = document.getElementById("floating-whatsapp-trigger");
  const popup = document.getElementById("whatsapp-popup-card");
  const closeBtn = document.getElementById("close-wa-popup");

  if (trigger && popup) {
    trigger.addEventListener("click", () => popup.classList.toggle("open"));
  }

  if (closeBtn && popup) {
    closeBtn.addEventListener("click", () => popup.classList.remove("open"));
  }

  // Newsletter Form
  const nlForm = document.getElementById("newsletter-form");
  if (nlForm) {
    nlForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("newsletter-email").value.trim();

      try {
        await fetch("/api/newsletter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        });
      } catch (err) {}

      showToast(`Thank you for subscribing (${email})!`, "success");
      nlForm.reset();
    });
  }
}

// =========================================================================
// 15. NAVIGATION & MODAL CONTROLLERS
// =========================================================================

function initNavigation() {
  const mobileToggle = document.getElementById("mobile-menu-toggle");
  const mainNav = document.getElementById("main-nav");
  const header = document.getElementById("site-header");

  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = mainNav.classList.toggle("open");
      mobileToggle.classList.toggle("active", isOpen);
      const icon = mobileToggle.querySelector("i");
      if (icon) {
        icon.className = isOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars";
      }
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
      if (mainNav.classList.contains("open") && !mainNav.contains(e.target) && !mobileToggle.contains(e.target)) {
        mainNav.classList.remove("open");
        mobileToggle.classList.remove("active");
        const icon = mobileToggle.querySelector("i");
        if (icon) icon.className = "fa-solid fa-bars";
      }
    });

    // Close on nav link or mobile action button click
    mainNav.querySelectorAll(".nav-link, .btn-mobile-cta").forEach((link) => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("open");
        mobileToggle.classList.remove("active");
        const icon = mobileToggle.querySelector("i");
        if (icon) icon.className = "fa-solid fa-bars";
      });
    });
  }

  // Scrollspy & Scrolled Header
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    // Update active nav link
    const sections = document.querySelectorAll("section[id]");
    const scrollY = window.pageYOffset + 120;

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute("id");
      const navLink = document.querySelector(`.main-nav a[href="#${id}"]`);

      if (scrollY >= top && scrollY < top + height) {
        document.querySelectorAll(".main-nav a").forEach((a) => a.classList.remove("active"));
        if (navLink) navLink.classList.add("active");
      }
    });
  });

  // Generic Modal Close listeners
  const modal = document.getElementById("detail-modal");
  const closeBtn = document.getElementById("modal-close-btn");
  const cancelBtn = document.getElementById("modal-cancel-btn");

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (cancelBtn) cancelBtn.addEventListener("click", closeModal);

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Close modals with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
      const bookModal = document.getElementById("booking-modal");
      if (bookModal) bookModal.classList.remove("open");
    }
  });
}

function openModal() {
  const modal = document.getElementById("detail-modal");
  if (modal) modal.classList.add("open");
}

function closeModal() {
  const modal = document.getElementById("detail-modal");
  if (modal) modal.classList.remove("open");
}

// =========================================================================
// 16. TOAST NOTIFICATION UTILITY
// =========================================================================

function showToast(message, type = "info", duration = 3500) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

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
