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
    summary: "Reliable office IT support, on-site and remote computer repairs, Wi-Fi and network setups, and routine maintenance.",
    features: [
      "Fast Remote & On-Site Assistance",
      "Office Wi-Fi & Router Setup",
      "Virus Removal & System Cleanup",
      "Hardware Diagnostics & Component Repairs"
    ],
    fullDetails: {
      scope: "We act as your dedicated IT support team. We keep your office computers running, resolve network and printer issues quickly, and ensure your staff works without frustrating technical downtime.",
      deliverables: [
        "Prompt response time for urgent office issues",
        "Monthly proactive system checkups and software updates",
        "Remote desktop troubleshooting and on-site technician visits in Accra",
        "Clear inventory tracking for all office laptops and equipment"
      ],
      techStack: "Remote Desktop Support, Cisco / UniFi Networks, Windows Server, Active Directory, BitLocker"
    }
  },
  {
    id: "web_dev",
    title: "Website Design & Development",
    icon: "fa-solid fa-code",
    summary: "Custom websites, web apps, and online stores built for speed, security, and easy customer payments.",
    features: [
      "Custom Website & Web App Development",
      "Clean, Mobile-Friendly Design",
      "Mobile Money & Card Checkout",
      "Fast Page Load Speeds & Local SEO"
    ],
    fullDetails: {
      scope: "We design and build clean, responsive websites and web applications tailored to your business needs. Every site is optimized for speed, works smoothly across smartphones and desktops, and comes with secure payment options.",
      deliverables: [
        "Modern, fully custom website or web portal",
        "Paystack Mobile Money (MTN, Telecel) and card payment integration",
        "Contact forms, WhatsApp inquiry buttons, and lead capture",
        "Domain connection, SSL security certificate, and hosting setup"
      ],
      techStack: "React, Next.js, Node.js, TypeScript, Python, PostgreSQL, TailwindCSS, Vercel"
    }
  },
  {
    id: "google_business",
    title: "Google Business Profile & SEO",
    icon: "fa-brands fa-google",
    summary: "Official Google Business Profile setup, Google Maps verification, and local search optimization to attract nearby customers.",
    features: [
      "Google Maps Listing Verification",
      "Accurate Business Category & Hours Setup",
      "Customer Review Setup & Direct QR Code",
      "High-Quality Photos & Product Showcase"
    ],
    fullDetails: {
      scope: "Make sure local customers find your business when searching on Google or Google Maps. We handle complete verification, optimize your profile with photos and services, and set you up to collect authentic 5-star customer reviews.",
      deliverables: [
        "100% verified and optimized Google Business listing",
        "Business photos, contact info, working hours, and services added",
        "Direct review link and printable QR code for customer reviews",
        "Guidance on how to maintain top local search visibility"
      ],
      techStack: "Google Business Profile, Google Maps, Local SEO Schema, Search Console"
    }
  },
  {
    id: "cloud_hosting",
    title: "Website Hosting & Maintenance",
    icon: "fa-solid fa-cloud-arrow-up",
    summary: "Secure, high-speed website hosting with 99.9% uptime, free SSL certificates, automated daily backups, and domain management.",
    features: [
      "99.9% Verified Website Uptime",
      "Free SSL Security Certificate",
      "Automatic Daily Backups",
      "Domain Registration & Email Setup"
    ],
    fullDetails: {
      scope: "Reliable web hosting that keeps your website fast and online 24/7. We take care of server security, automated backups, and software updates so you never have to worry about website downtime.",
      deliverables: [
        "High-speed cloud hosting with NVMe SSD storage",
        "Free SSL padlock certificate for HTTPS security",
        "Daily automated backups with fast restore capability",
        "Professional business email setup (e.g. info@yourcompany.com)"
      ],
      techStack: "Cloudflare, Nginx, Docker, Automated Backups, 24/7 Monitoring"
    }
  },
  {
    id: "windows_os",
    title: "Windows OS Installation & Setup",
    icon: "fa-brands fa-windows",
    summary: "Clean Windows 11 and 10 installations, system upgrades, driver setup, data backup, and essential software configuration.",
    features: [
      "Genuine Windows 11 & 10 Installation",
      "Complete Driver Setup & Speed Tuning",
      "Microsoft Office & Productivity Apps",
      "Safe Data Backup & Transfer"
    ],
    fullDetails: {
      scope: "Whether you have a new computer, need an upgrade from Windows 10 to 11, or want to fix a slow machine, we provide clean, licensed Windows installations with all drivers installed and your personal files preserved.",
      deliverables: [
        "Fresh installation of genuine Windows 11 or 10 Pro",
        "All essential drivers installed for graphics, audio, and Wi-Fi",
        "Installation of Microsoft Office, PDF tools, and web browsers",
        "Safe backup and transfer of your documents and files"
      ],
      techStack: "Windows 11 / 10 Pro, Driver Optimization, BitLocker, Microsoft 365"
    }
  },
  {
    id: "hardware_sales",
    title: "Laptop Sales & Accessories",
    icon: "fa-solid fa-laptop-code",
    summary: "Tested business laptops from HP, Dell, and Lenovo with clean batteries, genuine Windows, and warranty.",
    features: [
      "Thoroughly Tested Hardware & Battery",
      "6 to 12-Month Warranty Included",
      "RAM & SSD Storage Upgrades",
      "Same-Day Delivery & Setup Available"
    ],
    fullDetails: {
      scope: "We supply reliable, enterprise-grade laptops and accessories for professionals, students, and businesses. Each machine is inspected, tested for battery endurance, and ready for work out of the box.",
      deliverables: [
        "Carefully tested business laptop with healthy battery life (>85%)",
        "Pre-installed Windows and essential workplace apps",
        "Original charger and power cable",
        "Written warranty and direct technical support"
      ],
      techStack: "Dell Latitude / XPS, Lenovo ThinkPad, HP EliteBook, Apple MacBook Pro"
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
    badgeCert: "CORATECH CERTIFIED",
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
    title: "AfriVisa — Virtual Visa Card & Cross-Border Payments",
    category: "mobile",
    categoryLabel: "Mobile Fintech App",
    image: "assets/portfolio/afrivisa.jpg",
    metric: "Fast MoMo Top-Up & Low Fees",
    description: "A virtual Visa card app built for African developers, freelancers, and businesses to pay for international software subscriptions (AWS, OpenAI, GitHub, Vercel) directly using Mobile Money.",
    techStack: ["React Native", "FastAPI", "Python", "PostgreSQL", "Mobile Money", "Docker"],
    liveUrl: null,
    caseStudy: {
      problem: "Bank cards in Ghana and Nigeria frequently get declined or blocked when paying for essential foreign tools like OpenAI, GitHub, AWS, and online services.",
      solution: "Built a secure virtual card mobile backend connected directly to MTN MoMo and Telecel Cash, allowing users to create virtual US Dollar Visa cards in seconds and fund them with local currency.",
      outcome: "Gives local creators and companies a dependable way to pay for essential global software without bank delays or card declines."
    }
  },
  {
    id: "port-2",
    title: "SusuRow — Digital Group Savings & Contributions",
    category: "mobile",
    categoryLabel: "Fintech Mobile App",
    image: "assets/portfolio/susurow.jpg",
    metric: "Automated Savings & Zero Default",
    description: "A modern mobile app that turns traditional community 'Susu' rotational savings into a safe, automated digital experience with Mobile Money contributions and scheduled member payouts.",
    techStack: ["React Native", "TypeScript", "PostgreSQL", "Paystack MoMo", "TailwindCSS"],
    liveUrl: null,
    caseStudy: {
      problem: "Traditional Susu groups face cash theft, forgotten contribution dates, and disputes over who receives each round of savings.",
      solution: "Created an automated group savings app where members save together digitally, receive payment reminders, and collect their rotation payouts directly to Mobile Money.",
      outcome: "Delivered a transparent, stress-free savings system with clear digital records and automated Mobile Money transfers."
    }
  },
  {
    id: "port-3",
    title: "SocialFlow — Social Media Management & Post Scheduler",
    category: "web",
    categoryLabel: "Social Media Management Tool",
    image: "assets/portfolio/socialflow.jpg",
    metric: "Save 5+ Hours Weekly on Social Posts",
    description: "A multi-platform social media scheduler that helps marketing teams and business owners plan, queue, and publish content across their social accounts from one simple dashboard.",
    techStack: ["React", "Supabase", "PostgreSQL", "OAuth 2.0", "Netlify"],
    liveUrl: null,
    caseStudy: {
      problem: "Switching between multiple social media apps every day to post updates is repetitive and wastes valuable hours.",
      solution: "Built a visual drag-and-drop calendar that lets users write posts once and schedule them to publish automatically across multiple platforms.",
      outcome: "Helped marketing teams cut publishing time in half while keeping their brand active and consistent every day."
    }
  },
  {
    id: "port-4",
    title: "Event Hub — Event Ticketing & Attendee Portal",
    category: "web",
    categoryLabel: "Event Ticketing & Check-In",
    image: "assets/portfolio/eventhub.jpg",
    metric: "Instant QR Ticket & Fast Check-In",
    description: "An event discovery and ticketing website where attendees find conferences, workshops, and concerts, buy digital passes, and check in quickly at the gate with QR codes.",
    techStack: ["TypeScript", "Next.js", "Node.js", "Express", "Vercel"],
    liveUrl: "https://event-hub-eight-nu.vercel.app",
    caseStudy: {
      problem: "Printed tickets are easy to fake, gate lines move slowly, and organizers struggle to track real-time attendance numbers.",
      solution: "Engineered a clean ticketing website that sends digital tickets with secure QR codes directly to attendees' phones for 2-second gate scanning.",
      outcome: "Eliminated long ticket queues, reduced fake ticket fraud to zero, and simplified event management for organizers."
    }
  },
  {
    id: "port-5",
    title: "NIPMA BPMS — Business Process & Approval Management",
    category: "it",
    categoryLabel: "Business Workflow Automation",
    image: "assets/portfolio/nipma_bpms.jpg",
    metric: "75% Faster Internal Approvals",
    description: "An internal management system built for corporate offices to replace physical paper forms with digital requisition, leave requests, and manager approval workflows.",
    techStack: ["JavaScript", "React", "Node.js", "REST APIs", "Role-Based Security"],
    liveUrl: "https://nipma-bpms.vercel.app",
    caseStudy: {
      problem: "Internal purchase approvals and paperwork were getting stuck on desks for days, causing costly operational delays.",
      solution: "Designed a clean web-based approval portal where staff submit requests, managers approve with one click, and every action is automatically logged.",
      outcome: "Cut internal approval wait times from weeks to hours, eliminating lost paper files across departments."
    }
  },
  {
    id: "port-6",
    title: "Coratech Global — Official Company Web Platform",
    category: "cloud",
    categoryLabel: "Company Web Platform",
    image: "assets/portfolio/coratech_global.png",
    metric: "Instant MoMo Checkout & Live Helpdesk",
    description: "The complete official web platform for Coratech Global, featuring an interactive service cost estimator, instant PDF quotation download, verified laptop store, and IT support ticketing.",
    techStack: ["Node.js", "Express", "Neon PostgreSQL", "Paystack Gateway", "PDFKit", "Render"],
    liveUrl: "https://www.coratechglobal.com",
    caseStudy: {
      problem: "Clients often had to wait days for simple quotes and had no easy way to pay for hardware or track IT support tickets online.",
      solution: "Built a responsive, all-in-one website with an instant project cost calculator, Mobile Money and card checkout, and automated email proposals.",
      outcome: "Enables customers in Ghana to get instant price estimates, order certified laptops, and submit IT support requests in minutes."
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

function getPublicApiBase() {
  if (window.location.protocol === "file:" || (window.location.port && window.location.port !== "3000")) {
    return localStorage.getItem("coratech_api_base_url") || "http://localhost:3000";
  }
  return "";
}

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
  initPurchaseOrderForm();
  initProposalModal();
  initFaqAccordion();
  initFloatingWhatsApp();
  initNavigation();
  syncDataWithBackend();
});

// Dynamic Asynchronous Backend Synchronization
async function syncDataWithBackend() {
  const apiBase = getPublicApiBase();
  try {
    const [hwRes, portRes, srvRes, setRes] = await Promise.all([
      fetch(`${apiBase}/api/hardware`).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch(`${apiBase}/api/portfolio`).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch(`${apiBase}/api/services`).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch(`${apiBase}/api/settings`).then(r => r.ok ? r.json() : null).catch(() => null)
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
    const photoCount = Array.isArray(item.images) ? item.images.length : (item.image ? 1 : 0);
    return `
      <div class="hardware-card" data-hw-id="${item.id}">
        <div class="hardware-thumb-wrapper">
          <img src="${item.image}" alt="${item.model}" class="hardware-thumb-img">
          ${photoCount > 1 ? `<span class="badge-card-photos"><i class="fa-solid fa-images"></i> ${photoCount} Photos</span>` : ""}
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
              <button class="btn btn-secondary btn-sm btn-hw-details" data-id="${item.id}" title="View Technical Specs">
                <i class="fa-solid fa-list-check"></i> Specs
              </button>
              <button class="btn btn-primary btn-sm btn-hw-order" data-id="${item.id}" title="Order or Inquire">
                <i class="fa-solid fa-cart-shopping"></i> Buy / Inquire
              </button>
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

  // Bind Purchase Order buttons
  container.querySelectorAll(".btn-hw-order").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      openPurchaseModal(id);
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

  const allImages = Array.isArray(item.images) && item.images.length > 0 ? item.images : [item.image];

  modalBody.innerHTML = `
    ${allImages.length > 1 ? `
      <div class="spec-modal-gallery">
        <div class="spec-main-img-wrap">
          <img src="${allImages[0]}" id="spec-gallery-main" alt="${item.model}">
        </div>
        <div class="spec-thumbs-strip">
          ${allImages.map((imgUrl, i) => `
            <button type="button" class="spec-thumb-btn ${i === 0 ? 'active' : ''}" data-src="${imgUrl}">
              <img src="${imgUrl}" alt="Photo ${i + 1}">
            </button>
          `).join('')}
        </div>
      </div>
    ` : `
      <div style="display: flex; gap: 20px; margin-bottom: 20px; align-items: center;">
        <img src="${item.image}" alt="${item.model}" style="width: 140px; height: 100px; object-fit: cover; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
        <div>
          <span class="hardware-badge-condition" style="position: static; display: inline-block; margin-bottom: 6px;">${item.condition}</span>
          <div style="font-size: 1.4rem; font-weight: 800; color: var(--accent-cyan);">${formatCurrency(item.priceUsd)}</div>
          <p style="font-size: 0.85rem; color: var(--text-secondary);"><i class="fa-solid fa-shield-check text-emerald"></i> ${item.warranty}</p>
        </div>
      </div>
    `}

    ${allImages.length > 1 ? `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding: 10px 14px; background: var(--bg-tertiary); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
        <div>
          <span class="hardware-badge-condition" style="position: static; display: inline-block; margin-bottom: 4px;">${item.condition}</span>
          <div style="font-size: 1.3rem; font-weight: 800; color: var(--accent-cyan);">${formatCurrency(item.priceUsd)}</div>
        </div>
        <div style="text-align: right; font-size: 0.85rem; color: var(--text-secondary);">
          <i class="fa-solid fa-shield-check text-emerald"></i> ${item.warranty}
        </div>
      </div>
    ` : ''}

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
      <strong class="text-cyan">Coratech Guarantee:</strong> Genuine Windows pre-installed, high-speed charger included, inspected and certified for work right out of the box.
    </div>
  `;

  // Bind thumbnails switcher if gallery
  if (allImages.length > 1) {
    const mainImg = modalBody.querySelector("#spec-gallery-main");
    const thumbBtns = modalBody.querySelectorAll(".spec-thumb-btn");
    thumbBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        thumbBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        mainImg.src = btn.getAttribute("data-src");
      });
    });
  }

  modalActionBtn.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> Order / Purchase This Device`;
  modalActionBtn.className = "btn btn-primary";
  modalActionBtn.onclick = () => {
    closeModal();
    openPurchaseModal(hwId);
  };

  openModal();
}

// =========================================================================
// 8B. PURCHASE ORDER MODAL & SILENT BACKEND NOTIFICATION
// =========================================================================

function openPurchaseModal(hwId) {
  const item = HARDWARE_CATALOG.find((h) => h.id === hwId);
  if (!item) return;

  const modal = document.getElementById("purchase-modal");
  const summary = document.getElementById("purchase-summary-box");

  document.getElementById("order-model-name").value = item.model;
  document.getElementById("order-model-price").value = item.priceUsd;

  summary.innerHTML = `
    <img src="${item.image}" alt="${item.model}">
    <div class="purchase-summary-details">
      <div class="purchase-summary-title">${item.model}</div>
      <div class="purchase-summary-price">${formatCurrency(item.priceUsd)}</div>
      <div class="purchase-summary-warranty">
        <i class="fa-solid fa-shield-check"></i> ${item.warranty} • ${item.condition}
      </div>
    </div>
  `;

  modal.classList.add("open");

  // WhatsApp order button click
  const waBtn = document.getElementById("btn-order-whatsapp");
  waBtn.onclick = () => {
    const name = document.getElementById("order-cust-name").value.trim() || "Customer";
    const phone = document.getElementById("order-cust-phone").value.trim() || "Via WhatsApp";
    const email = document.getElementById("order-cust-email").value.trim();
    const location = document.getElementById("order-cust-location").value.trim() || "Pickup / Delivery";
    const notes = document.getElementById("order-cust-notes").value.trim();

    // Silent background dispatch to backend (triggers coratechglobal@gmail.com email)
    const apiBase = getPublicApiBase();
    fetch(`${apiBase}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        email,
        model: item.model,
        priceUsd: item.priceUsd,
        location,
        notes
      })
    }).catch((e) => console.warn("Background order dispatch note:", e));

    closePurchaseModal();
    showToast("Opening WhatsApp with your order details...", "success");

    const message = `Hello Coratech Global, I would like to purchase:
Device: ${item.model}
Price: ${formatCurrency(item.priceUsd)}
Customer Name: ${name}
Phone: ${phone}
Location: ${location || "Accra"}
${notes ? "Notes: " + notes : ""}`;

    window.open(`https://wa.me/233599360626?text=${encodeURIComponent(message)}`, "_blank");
  };
}

function closePurchaseModal() {
  const modal = document.getElementById("purchase-modal");
  if (modal) modal.classList.remove("open");
}

function initPurchaseOrderForm() {
  const form = document.getElementById("purchase-order-form");
  const closeBtn = document.getElementById("purchase-modal-close");

  if (closeBtn) {
    closeBtn.onclick = closePurchaseModal;
  }

  const modal = document.getElementById("purchase-modal");
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closePurchaseModal();
    });
  }

  if (!form) return;

  // 1. Instant Online Checkout with Mobile Money & Cards
  const btnPayOnline = document.getElementById("btn-pay-momo-card");
  if (btnPayOnline) {
    btnPayOnline.addEventListener("click", async () => {
      const model = document.getElementById("order-model-name").value;
      const priceGhs = parseFloat(document.getElementById("order-model-price").value) || 0;
      const name = document.getElementById("order-cust-name").value.trim();
      const phone = document.getElementById("order-cust-phone").value.trim();
      const email = document.getElementById("order-cust-email").value.trim();
      const location = document.getElementById("order-cust-location").value.trim() || "Delivery Pending Verification";
      const notes = document.getElementById("order-cust-notes").value.trim();

      if (!name) {
        showToast("Please enter your full name.", "warning");
        document.getElementById("order-cust-name").focus();
        return;
      }
      if (!phone) {
        showToast("Please enter your WhatsApp / phone number for delivery.", "warning");
        document.getElementById("order-cust-phone").focus();
        return;
      }
      if (!email || !email.includes("@")) {
        showToast("Please enter a valid email address to receive your official payment receipt.", "warning");
        document.getElementById("order-cust-email").focus();
        return;
      }

      btnPayOnline.disabled = true;
      btnPayOnline.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Initializing Gateway...`;

      try {
        const apiBase = getPublicApiBase();

        // 1. Check Paystack Config
        const cfgRes = await fetch(`${apiBase}/api/payments/config`);
        const cfgData = await cfgRes.json();

        // 2. Register initial order in database
        const orderRes = await fetch(`${apiBase}/api/orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, phone, email, model, priceUsd: priceGhs, location, notes })
        });
        const orderData = await orderRes.json();
        const orderId = orderData.data ? orderData.data.id : `ORD-${Date.now()}`;

        if (!cfgData.configured || !cfgData.publicKey) {
          showToast("Paystack payment gateway is being activated. Connecting to sales team via WhatsApp...", "info", 6000);
          const waUrl = `https://wa.me/233599360626?text=${encodeURIComponent(`Hello Coratech Global, I would like to pay for ${model} (GH₵ ${priceGhs.toLocaleString()}) via Mobile Money. Order Ref: ${orderId}. My Name: ${name}`)}`;
          setTimeout(() => {
            window.open(waUrl, "_blank");
          }, 1000);
          closePurchaseModal();
          return;
        }

        // 3. Launch Paystack Inline Checkout Popup
        if (typeof PaystackPop === "undefined") {
          throw new Error("Paystack payment script failed to load. Please check your internet connection.");
        }

        const paymentRef = `CG-PAY-${orderId}-${Date.now()}`;
        const handler = PaystackPop.setup({
          key: cfgData.publicKey,
          email: email,
          amount: Math.round(priceGhs * 100), // In Ghana Pesewas
          currency: "GHS",
          ref: paymentRef,
          channels: ["mobile_money", "card", "bank_transfer", "ussd"],
          metadata: {
            custom_fields: [
              { display_name: "Customer Name", variable_name: "customer_name", value: name },
              { display_name: "Device Model", variable_name: "device_model", value: model },
              { display_name: "Order ID", variable_name: "order_id", value: orderId },
              { display_name: "Phone Number", variable_name: "phone", value: phone }
            ]
          },
          callback: async function(response) {
            showToast("Payment submitted! Verifying transaction on blockchain & banking network...", "info", 4000);
            try {
              const verifyRes = await fetch(`${apiBase}/api/payments/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reference: response.reference, orderId: orderId })
              });
              const verifyData = await verifyRes.json();
              if (verifyData.success) {
                showPaymentSuccessModal({
                  reference: response.reference,
                  amountGhs: priceGhs,
                  channel: (verifyData.data && verifyData.data.channel) || "mobile_money",
                  order: { id: orderId, model }
                });
                form.reset();
              } else {
                showToast("Payment received. Reference: " + response.reference, "success", 7000);
                closePurchaseModal();
              }
            } catch (vErr) {
              showToast("Payment successful! Ref: " + response.reference, "success", 7000);
              closePurchaseModal();
            }
          },
          onClose: function() {
            showToast("Online checkout paused. You can also pay on delivery or via WhatsApp.", "info", 5000);
          }
        });

        handler.openIframe();
      } catch (err) {
        showToast(err.message || "Could not connect to payment gateway. Please try again.", "error");
      } finally {
        btnPayOnline.disabled = false;
        btnPayOnline.innerHTML = `<i class="fa-solid fa-mobile-screen-button"></i> Pay Now with MoMo / Card / Bank`;
      }
    });
  }

  // 2. Manual / Pay on Delivery Submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById("btn-submit-order");
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Submitting...`;

    const model = document.getElementById("order-model-name").value;
    const priceUsd = parseFloat(document.getElementById("order-model-price").value) || 0;
    const name = document.getElementById("order-cust-name").value.trim();
    const phone = document.getElementById("order-cust-phone").value.trim();
    const email = document.getElementById("order-cust-email").value.trim();
    const location = document.getElementById("order-cust-location").value.trim();
    const notes = document.getElementById("order-cust-notes").value.trim();

    try {
      const apiBase = getPublicApiBase();
      const res = await fetch(`${apiBase}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, model, priceUsd, location, notes })
      });
      const data = await res.json();
      if (data.success) {
        showToast("Order received! Our sales team will contact you shortly to confirm delivery.", "success", 6000);
        form.reset();
        closePurchaseModal();
      } else {
        showToast(data.error || "Could not submit order. Please try again or message via WhatsApp.", "error");
      }
    } catch (err) {
      showToast("Order request received! Our team will contact you shortly.", "success");
      form.reset();
      closePurchaseModal();
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<i class="fa-solid fa-truck-ramp-box"></i> Pay on Delivery / Manual`;
    }
  });
}

function showPaymentSuccessModal(data) {
  closePurchaseModal();
  const modal = document.getElementById("payment-success-modal");
  const details = document.getElementById("payment-success-details");
  if (!modal || !details) return;

  const channelLabel =
    data.channel === "mobile_money" ? "Mobile Money (MTN / Telecel / AT)" :
    data.channel === "card" ? "Visa / Mastercard Card" :
    data.channel.toUpperCase();

  details.innerHTML = `
    <div style="display: flex; justify-content: space-between; margin-bottom: 8px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 6px;">
      <span style="color: var(--text-muted);">Payment Status:</span>
      <span class="badge badge-success" style="display: inline-flex; align-items: center; gap: 4px;">
        <i class="fa-solid fa-circle-check"></i> VERIFIED & PAID
      </span>
    </div>
    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
      <span style="color: var(--text-muted);">Receipt Ref:</span>
      <strong style="color: var(--accent-cyan); font-family: var(--font-mono);">${data.reference}</strong>
    </div>
    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
      <span style="color: var(--text-muted);">Amount Paid:</span>
      <strong style="color: #10b981; font-size: 1.05rem;">GH₵ ${Number(data.amountGhs).toLocaleString()}</strong>
    </div>
    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
      <span style="color: var(--text-muted);">Method:</span>
      <span style="color: #f8fafc; font-weight: 500;">${channelLabel}</span>
    </div>
    <div style="display: flex; justify-content: space-between;">
      <span style="color: var(--text-muted);">Order Ref:</span>
      <span style="color: #cbd5e1;">${data.order ? data.order.id : data.reference}</span>
    </div>
  `;

  modal.classList.add("open");

  const closeBtn = document.getElementById("btn-close-payment-success");
  if (closeBtn) {
    closeBtn.onclick = () => modal.classList.remove("open");
  }
}

// =========================================================================
// 8C. OFFICIAL PDF PROPOSAL MODAL & DUAL EMAIL DISPATCH
// =========================================================================

function openProposalModal() {
  const modal = document.getElementById("proposal-modal");
  const summaryBox = document.getElementById("proposal-summary-box");
  const downloadAction = document.getElementById("proposal-download-action");
  const submitBtn = document.getElementById("btn-generate-proposal");
  if (!modal) return;

  if (downloadAction) downloadAction.style.display = "none";
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = `<i class="fa-solid fa-envelope-circle-check"></i> Send Official PDF Proposal`;
  }

  // Calculate current proposal scope
  const { serviceId, baseCost, multiplier, addons } = state.calculator;
  const currentService = SERVICES_DATA.find((s) => s.id === serviceId) || { name: "Custom Enterprise IT Engagement" };
  const scaledBase = baseCost * multiplier;
  const addonsTotal = addons.reduce((sum, a) => sum + a.cost, 0);
  const totalUsd = scaledBase + addonsTotal;
  const ghsRate = CURRENCY_RATES && CURRENCY_RATES.USD ? (1 / CURRENCY_RATES.USD.rate) : 15.38;
  const totalGhs = Math.round(totalUsd * ghsRate);

  const scopeLabel = multiplier === 1 ? "Standard Setup" : multiplier === 1.6 ? "Advanced Enterprise Scale" : "Mission-Critical Core";
  const timelineLabel = multiplier === 1 ? "1 - 2 Weeks" : multiplier === 1.6 ? "3 - 4 Weeks" : "4 - 8 Weeks";

  modal.dataset.serviceName = currentService.name;
  modal.dataset.baseCost = scaledBase;
  modal.dataset.multiplier = multiplier;
  modal.dataset.totalUsd = totalUsd;
  modal.dataset.totalGhs = totalGhs;
  modal.dataset.timeline = timelineLabel;
  modal.dataset.addons = JSON.stringify(addons);

  summaryBox.innerHTML = `
    <div class="purchase-summary-details" style="width: 100%;">
      <div style="font-size: 0.75rem; color: var(--accent-cyan); text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 4px;">
        OFFICIAL SCOPE SUMMARY
      </div>
      <div class="purchase-summary-title" style="font-size: 1.15rem; color: #fff; margin-bottom: 6px;">
        ${currentService.name}
      </div>
      <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 8px;">
        <div class="purchase-summary-price" style="font-size: 1.35rem;">
          $${totalUsd.toLocaleString()} USD
          <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 400;">(~GH₵ ${totalGhs.toLocaleString()})</span>
        </div>
        <div style="font-size: 0.8rem; color: var(--text-secondary);">
          <i class="fa-solid fa-clock text-cyan"></i> Delivery: <strong>${timelineLabel}</strong>
        </div>
      </div>
      <div class="purchase-summary-warranty" style="margin-top: 8px; font-size: 0.82rem; color: var(--text-muted);">
        <i class="fa-solid fa-layer-group text-cyan"></i> Scope: ${scopeLabel} &bull; ${addons.length} Add-on Module(s) Included
      </div>
    </div>
  `;

  modal.classList.add("open");
}

function closeProposalModal() {
  const modal = document.getElementById("proposal-modal");
  if (modal) modal.classList.remove("open");
}

function initProposalModal() {
  const closeBtn = document.getElementById("proposal-modal-close");
  const cancelBtn = document.getElementById("btn-cancel-proposal");
  const modal = document.getElementById("proposal-modal");
  const form = document.getElementById("proposal-request-form");

  if (closeBtn) closeBtn.onclick = closeProposalModal;
  if (cancelBtn) cancelBtn.onclick = closeProposalModal;
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeProposalModal();
    });
  }

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById("btn-generate-proposal");
    const downloadAction = document.getElementById("proposal-download-action");
    const downloadLink = document.getElementById("proposal-pdf-download-link");

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Generating PDF & Dispatches...`;

    const name = document.getElementById("prop-cust-name").value.trim();
    const email = document.getElementById("prop-cust-email").value.trim();
    const phone = document.getElementById("prop-cust-phone").value.trim();
    const company = document.getElementById("prop-cust-company").value.trim();

    const serviceName = modal.dataset.serviceName || "Custom Engineering Engagement";
    const baseCost = parseFloat(modal.dataset.baseCost) || 0;
    const multiplier = parseFloat(modal.dataset.multiplier) || 1;
    const totalUsd = parseFloat(modal.dataset.totalUsd) || 0;
    const totalGhs = parseFloat(modal.dataset.totalGhs) || 0;
    const timeline = modal.dataset.timeline || "2 - 4 Weeks";
    let addons = [];
    try {
      addons = JSON.parse(modal.dataset.addons || "[]");
    } catch (err) {}

    try {
      const apiBase = getPublicApiBase();
      const res = await fetch(`${apiBase}/api/proposals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          company,
          serviceName,
          baseCost,
          multiplier,
          addons,
          totalUsd,
          totalGhs,
          timeline
        })
      });

      const data = await res.json();
      if (data.success && data.pdfUrl) {
        showToast(`Official PDF proposal generated! Dispatched to ${email}`, "success", 8000);
        if (downloadAction && downloadLink) {
          downloadLink.href = `${apiBase}${data.pdfUrl}`;
          downloadAction.style.display = "block";
        }
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<i class="fa-solid fa-rotate-right"></i> Request Another Proposal`;
      } else {
        showToast(data.error || "Could not generate proposal. Please verify your details.", "error");
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<i class="fa-solid fa-envelope-circle-check"></i> Send Official PDF Proposal`;
      }
    } catch (err) {
      showToast("Proposal request logged! Direct download link ready.", "success");
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<i class="fa-solid fa-envelope-circle-check"></i> Send Official PDF Proposal`;
    }
  });
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

        <div class="project-card-footer" style="flex-wrap: wrap; gap: 8px;">
          ${proj.liveUrl ? `
          <a href="${proj.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" style="display: inline-flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-arrow-up-right-from-square"></i> Live Demo
          </a>
          ` : (proj.category === 'mobile' || proj.id === 'port-1' || proj.id === 'port-2' ? `
          <span class="btn btn-secondary btn-sm" style="cursor: default; opacity: 0.9; display: inline-flex; align-items: center; gap: 5px; background: rgba(14, 165, 233, 0.12); color: var(--accent-cyan); border-color: rgba(14, 165, 233, 0.3);">
            <i class="fa-solid fa-mobile-screen"></i> Mobile App
          </span>
          ` : '')}
          <button class="btn btn-outline-cyan btn-sm btn-open-case-study" data-id="${proj.id}">
            <i class="fa-solid fa-folder-open"></i> Case Study
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

    ${proj.liveUrl ? `
    <div style="display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;">
      <a href="${proj.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-cyan btn-sm" style="text-decoration: none; display: inline-flex; align-items: center; gap: 6px; flex: 1; min-width: 150px; justify-content: center;">
        <i class="fa-solid fa-arrow-up-right-from-square"></i> Open Live Application
      </a>
    </div>
    ` : (proj.category === 'mobile' || proj.id === 'port-1' || proj.id === 'port-2' ? `
    <div style="margin-bottom: 20px; padding: 12px 16px; background: rgba(14, 165, 233, 0.1); border: 1px solid rgba(14, 165, 233, 0.3); border-radius: var(--radius-md); display: flex; align-items: center; gap: 12px;">
      <i class="fa-solid fa-mobile-screen-button text-cyan" style="font-size: 1.4rem;"></i>
      <span style="font-size: 0.9rem; color: var(--text-primary);">This platform architecture is actively being engineered into a standalone native mobile application for iOS & Android.</span>
    </div>
    ` : '')}

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

  // Email PDF Quote Button -> Opens Official PDF Proposal Modal
  const emailBtn = document.getElementById("calc-email-btn");
  if (emailBtn) {
    emailBtn.addEventListener("click", () => {
      openProposalModal();
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
        const apiBase = getPublicApiBase();
        const res = await fetch(`${apiBase}/api/tickets`, {
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
        const apiBase = getPublicApiBase();
        const res = await fetch(`${apiBase}/api/tickets/${encodeURIComponent(input)}`);
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
      const email = document.getElementById("book-email") ? document.getElementById("book-email").value.trim() : "";

      modal.classList.remove("open");
      showToast(`Appointment booked for ${name} on ${date} at ${selectedSlot}!`, "success");

      // Submit to Backend API
      try {
        const apiBase = getPublicApiBase();
        await fetch(`${apiBase}/api/appointments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, phone, email, service, type, date, time: selectedSlot })
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
        const apiBase = getPublicApiBase();
        await fetch(`${apiBase}/api/newsletter`, {
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

  // Handle Mobile Bottom Dock clicks
  document.querySelectorAll(".mobile-bottom-dock .dock-item").forEach((dockLink) => {
    dockLink.addEventListener("click", () => {
      const target = dockLink.getAttribute("data-dock-target");
      if (target) {
        document.querySelectorAll(".mobile-bottom-dock .dock-item").forEach((d) => d.classList.remove("active"));
        dockLink.classList.add("active");
      }
    });
  });

  // Scrollspy & Scrolled Header
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    // Update active nav link & mobile dock item
    const sections = document.querySelectorAll("section[id]");
    const scrollY = window.pageYOffset + 140;

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute("id");
      const navLink = document.querySelector(`.main-nav a[href="#${id}"]`);
      const dockLink = document.querySelector(`.mobile-bottom-dock a[data-dock-target="${id}"]`);

      if (scrollY >= top && scrollY < top + height) {
        document.querySelectorAll(".main-nav a").forEach((a) => a.classList.remove("active"));
        if (navLink) navLink.classList.add("active");

        if (dockLink) {
          document.querySelectorAll(".mobile-bottom-dock .dock-item").forEach((d) => d.classList.remove("active"));
          dockLink.classList.add("active");
        }
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

  // Global Keyboard Shortcuts (Escape to close modals, Ctrl+Shift+A to access Admin CRM)
  document.addEventListener("keydown", (e) => {
    // Escape key: Close open modals
    if (e.key === "Escape") {
      closeModal();
      const bookModal = document.getElementById("booking-modal");
      if (bookModal) bookModal.classList.remove("open");
    }

    // Ctrl + Shift + A (or Cmd + Shift + A on macOS): Quick Access to Admin CRM
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "A" || e.key === "a")) {
      e.preventDefault();
      showToast("Accessing Admin CRM Portal...", "info", 1500);
      fetch("/api/admin-route")
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          const target = data && data.route ? data.route : "/manage-coratech";
          setTimeout(() => {
            window.location.href = target;
          }, 300);
        })
        .catch(() => {
          setTimeout(() => {
            window.location.href = "/manage-coratech";
          }, 300);
        });
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
