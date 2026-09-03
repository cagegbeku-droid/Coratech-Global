/**
 * CORATECH GLOBAL - FULL-STACK BACKEND SERVER
 * REST API, Content Management Engine & Static Asset Delivery
 */

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "coratech_global_enterprise_sec_key_2026_9x48q";

// =========================================================================
// SILENT BACKEND EMAIL NOTIFICATIONS
// Recipient: coratechglobal@gmail.com
// Operates silently in the background without exposing details to customers
// =========================================================================
const NOTIFICATION_RECIPIENT = "coratechglobal@gmail.com";

let mailTransporter = null;
try {
  const smtpUser = process.env.EMAIL_USER || process.env.SMTP_USER;
  const smtpPass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

  if (smtpUser && smtpPass) {
    mailTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });
    console.log(`Email notification engine active for ${NOTIFICATION_RECIPIENT}`);
  }
} catch (e) {
  console.warn("Mail transporter initialization notice:", e.message);
}

function sendSilentNotification({ subject, text, html }) {
  setImmediate(async () => {
    try {
      console.log(`\n======================================================`);
      console.log(`[BACKEND NOTIFICATION -> ${NOTIFICATION_RECIPIENT}]`);
      console.log(`Subject: ${subject}`);
      console.log(`Time:    ${new Date().toISOString()}`);
      console.log(`Details:\n${text}`);
      console.log(`======================================================\n`);

      if (mailTransporter) {
        await mailTransporter.sendMail({
          from: `"Coratech Platform Alerts" <${process.env.EMAIL_USER || "noreply@coratechglobal.com"}>`,
          to: NOTIFICATION_RECIPIENT,
          subject: subject,
          text: text,
          html: html || `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b;">
            <h2 style="color: #0284c7; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">${subject}</h2>
            <pre style="background: #f8fafc; padding: 14px; border-radius: 6px; white-space: pre-wrap; font-family: inherit;">${text}</pre>
            <p style="font-size: 12px; color: #94a3b8; margin-top: 20px;">Automated alert from Coratech Global Backend Engine.</p>
          </div>`
        });
        console.log(`✓ Email notification delivered to ${NOTIFICATION_RECIPIENT}`);
      }
    } catch (err) {
      // Silently log on server - strictly never thrown or surfaced to customer
      console.error(`Silent notification delivery note: ${err.message}`);
    }
  });
}

// Ensure required directories exist
const DATA_DIR = path.join(__dirname, "data");
const DB_FILE = path.join(DATA_DIR, "database.json");
const UPLOADS_DIR = path.join(__dirname, "uploads");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Database helper functions
function readDatabase() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      return null;
    }
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading database:", err);
    return null;
  }
}

function writeDatabase(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error writing database:", err);
    return false;
  }
}

// Initialize and ensure Admin Password Hash & Environment Overrides
function initDatabaseSecurity() {
  const db = readDatabase();
  if (db && db.admin) {
    // Check if custom ADMIN_EMAIL or ADMIN_PASSWORD are set via environment variables
    if (process.env.ADMIN_EMAIL && process.env.ADMIN_EMAIL.trim()) {
      db.admin.email = process.env.ADMIN_EMAIL.trim();
    }
    if (process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.trim()) {
      const salt = bcrypt.genSaltSync(10);
      db.admin.password = bcrypt.hashSync(process.env.ADMIN_PASSWORD.trim(), salt);
      console.log(`Admin password initialized securely from environment variable for ${db.admin.email}.`);
    } else if (!db.admin.password.startsWith("$2a$") && !db.admin.password.startsWith("$2b$")) {
      const salt = bcrypt.genSaltSync(10);
      db.admin.password = bcrypt.hashSync(db.admin.password, salt);
      console.log("Admin password successfully secured and hashed.");
    }
    writeDatabase(db);
  }
}
initDatabaseSecurity();

// Middlewares
app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));
app.options("*", cors());
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// Static Asset Delivery
app.use("/uploads", express.static(UPLOADS_DIR));
app.use("/admin", express.static(path.join(__dirname, "admin")));
app.use(express.static(__dirname));

// Multer Storage Configuration for File & Image Uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e6);
    cb(null, `${cleanName}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max file size
  fileFilter: function (req, file, cb) {
    const allowed = /jpeg|jpg|png|webp|gif|svg|avif|pdf|doc|docx/;
    const extname = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowed.test(file.mimetype) || file.mimetype === "image/svg+xml";
    if (extname || mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only images (JPEG, PNG, WEBP, SVG, GIF) and documents are permitted."));
  }
});

// Authentication Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, error: "Access denied. No authentication token provided." });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, error: "Invalid or expired session token. Please log in again." });
    }
    req.user = user;
    next();
  });
}

// =========================================================================
// 1. AUTHENTICATION & ADMIN SECURITY ROUTES
// =========================================================================

// Admin Login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, error: "Email and password are required." });
  }

  const db = readDatabase();
  if (!db || !db.admin) {
    return res.status(500).json({ success: false, error: "Database unavailable." });
  }

  const isEmailMatch = db.admin.email.toLowerCase() === email.toLowerCase().trim();
  const isPasswordMatch = isEmailMatch && bcrypt.compareSync(password, db.admin.password);

  if (!isEmailMatch || !isPasswordMatch) {
    return res.status(401).json({ success: false, error: "Invalid email address or password." });
  }

  const payload = {
    email: db.admin.email,
    name: db.admin.name || "Administrator",
    role: db.admin.role || "Super Admin"
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

  res.json({
    success: true,
    message: "Login successful.",
    token,
    user: payload
  });
});

// Verify Current Token Session
app.get("/api/auth/me", authenticateToken, (req, res) => {
  res.json({ success: true, user: req.user });
});

// Change Admin Password / Profile
app.post("/api/auth/change-password", authenticateToken, (req, res) => {
  const { currentPassword, newPassword, name, email } = req.body;
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ success: false, error: "New password must be at least 6 characters long." });
  }

  const db = readDatabase();
  if (!db || !db.admin) {
    return res.status(500).json({ success: false, error: "Database unavailable." });
  }

  if (currentPassword) {
    const isCurrentValid = bcrypt.compareSync(currentPassword, db.admin.password);
    if (!isCurrentValid) {
      return res.status(400).json({ success: false, error: "Current password is incorrect." });
    }
  }

  const salt = bcrypt.genSaltSync(10);
  db.admin.password = bcrypt.hashSync(newPassword, salt);
  if (name) db.admin.name = name.trim();
  if (email) db.admin.email = email.trim();

  writeDatabase(db);
  res.json({ success: true, message: "Password updated successfully." });
});

// =========================================================================
// 2. FILE & IMAGE UPLOADS (Supports One or More Images)
// =========================================================================

app.post("/api/upload", authenticateToken, (req, res) => {
  upload.any()(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, error: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ success: false, error: err.message || "File upload failed." });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, error: "No file was uploaded." });
    }

    const uploadedFiles = req.files.map((file) => ({
      url: `/uploads/${file.filename}`,
      filename: file.filename,
      size: file.size,
      mimetype: file.mimetype
    }));

    res.json({
      success: true,
      url: uploadedFiles[0].url, // Primary image for single-image consumers
      urls: uploadedFiles.map((f) => f.url), // Array of all uploaded image URLs
      files: uploadedFiles,
      message: `${uploadedFiles.length} image(s) uploaded successfully.`
    });
  });
});

// =========================================================================
// 3. HARDWARE & LAPTOP CATALOG (CRUD)
// =========================================================================

// Public: Get All Hardware
app.get("/api/hardware", (req, res) => {
  const db = readDatabase();
  if (!db) return res.status(500).json({ success: false, error: "Database error" });
  res.json({ success: true, data: db.hardware || [] });
});

// Admin: Create Hardware / Laptop
app.post("/api/hardware", authenticateToken, (req, res) => {
  const db = readDatabase();
  if (!db) return res.status(500).json({ success: false, error: "Database error" });

  const {
    model,
    category,
    categoryLabel,
    image,
    condition,
    badgeCert,
    specs,
    priceUsd,
    warranty,
    inStock,
    featured
  } = req.body;

  if (!model || !category || !priceUsd) {
    return res.status(400).json({ success: false, error: "Model name, category, and price are required." });
  }

  const newItem = {
    id: `hw-${Date.now()}`,
    model: model.trim(),
    category: category.trim(),
    categoryLabel: categoryLabel ? categoryLabel.trim() : (category === "developer" ? "Developer Workstation" : category === "business" ? "Business Executive Laptop" : "Workstation Peripherals"),
    image: image ? image.trim() : "assets/hardware_laptop.jpg",
    condition: condition ? condition.trim() : "Brand New Sealed",
    badgeCert: badgeCert ? badgeCert.trim() : "35-POINT CERTIFIED",
    specs: specs || {
      cpu: "High Performance Processor",
      ram: "16GB RAM",
      storage: "512GB NVMe SSD",
      display: "15.6\" Full HD Display",
      gpu: "Integrated / Dedicated Graphics",
      battery: "High Capacity Battery"
    },
    priceUsd: parseFloat(priceUsd) || 0,
    warranty: warranty ? warranty.trim() : "1 Year Warranty",
    inStock: inStock !== false,
    featured: !!featured,
    createdAt: new Date().toISOString()
  };

  db.hardware = db.hardware || [];
  db.hardware.unshift(newItem);
  writeDatabase(db);

  res.status(201).json({ success: true, data: newItem, message: "Hardware item created successfully." });
});

// Admin: Update Hardware
app.put("/api/hardware/:id", authenticateToken, (req, res) => {
  const db = readDatabase();
  if (!db) return res.status(500).json({ success: false, error: "Database error" });

  const { id } = req.params;
  const index = (db.hardware || []).findIndex((h) => h.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, error: "Hardware item not found." });
  }

  const existing = db.hardware[index];
  const updated = {
    ...existing,
    ...req.body,
    id: existing.id, // Preserve ID
    priceUsd: req.body.priceUsd !== undefined ? parseFloat(req.body.priceUsd) : existing.priceUsd,
    specs: req.body.specs ? { ...existing.specs, ...req.body.specs } : existing.specs,
    updatedAt: new Date().toISOString()
  };

  db.hardware[index] = updated;
  writeDatabase(db);

  res.json({ success: true, data: updated, message: "Hardware item updated successfully." });
});

// Admin: Delete Hardware
app.delete("/api/hardware/:id", authenticateToken, (req, res) => {
  const db = readDatabase();
  if (!db) return res.status(500).json({ success: false, error: "Database error" });

  const { id } = req.params;
  const initialLength = (db.hardware || []).length;
  db.hardware = (db.hardware || []).filter((h) => h.id !== id);

  if (db.hardware.length === initialLength) {
    return res.status(404).json({ success: false, error: "Hardware item not found." });
  }

  writeDatabase(db);
  res.json({ success: true, message: "Hardware item deleted successfully." });
});

// =========================================================================
// 4. PORTFOLIO & CASE STUDIES (CRUD)
// =========================================================================

// Public: Get Portfolio Projects
app.get("/api/portfolio", (req, res) => {
  const db = readDatabase();
  if (!db) return res.status(500).json({ success: false, error: "Database error" });
  res.json({ success: true, data: db.portfolio || [] });
});

// Admin: Create Project
app.post("/api/portfolio", authenticateToken, (req, res) => {
  const db = readDatabase();
  if (!db) return res.status(500).json({ success: false, error: "Database error" });

  const { title, category, categoryLabel, image, metric, description, techStack, caseStudy, featured } = req.body;

  if (!title || !description) {
    return res.status(400).json({ success: false, error: "Project title and description are required." });
  }

  const newProject = {
    id: `port-${Date.now()}`,
    title: title.trim(),
    category: category ? category.trim() : "web",
    categoryLabel: categoryLabel ? categoryLabel.trim() : (category === "web" ? "Web & SaaS Architecture" : category === "it" ? "Enterprise IT Deployment" : category === "cloud" ? "Cloud & DevOps" : "Mobile Application"),
    image: image ? image.trim() : "assets/cloud_infra.jpg",
    metric: metric ? metric.trim() : "99.99% Operational SLA",
    description: description.trim(),
    techStack: Array.isArray(techStack) ? techStack : (techStack ? techStack.split(",").map(s => s.trim()) : ["React", "Node.js"]),
    caseStudy: caseStudy || {
      problem: "Client faced operational constraints.",
      solution: "Engineered scalable digital infrastructure.",
      outcome: "Exceeded client KPIs and performance benchmarks."
    },
    featured: !!featured,
    createdAt: new Date().toISOString()
  };

  db.portfolio = db.portfolio || [];
  db.portfolio.unshift(newProject);
  writeDatabase(db);

  res.status(201).json({ success: true, data: newProject, message: "Project case study created successfully." });
});

// Admin: Update Project
app.put("/api/portfolio/:id", authenticateToken, (req, res) => {
  const db = readDatabase();
  if (!db) return res.status(500).json({ success: false, error: "Database error" });

  const { id } = req.params;
  const index = (db.portfolio || []).findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, error: "Project not found." });
  }

  const existing = db.portfolio[index];
  const updated = {
    ...existing,
    ...req.body,
    id: existing.id,
    techStack: Array.isArray(req.body.techStack)
      ? req.body.techStack
      : (typeof req.body.techStack === "string" ? req.body.techStack.split(",").map(s => s.trim()) : existing.techStack),
    caseStudy: req.body.caseStudy ? { ...existing.caseStudy, ...req.body.caseStudy } : existing.caseStudy,
    updatedAt: new Date().toISOString()
  };

  db.portfolio[index] = updated;
  writeDatabase(db);

  res.json({ success: true, data: updated, message: "Project updated successfully." });
});

// Admin: Delete Project
app.delete("/api/portfolio/:id", authenticateToken, (req, res) => {
  const db = readDatabase();
  if (!db) return res.status(500).json({ success: false, error: "Database error" });

  const { id } = req.params;
  const initialLength = (db.portfolio || []).length;
  db.portfolio = (db.portfolio || []).filter((p) => p.id !== id);

  if (db.portfolio.length === initialLength) {
    return res.status(404).json({ success: false, error: "Project not found." });
  }

  writeDatabase(db);
  res.json({ success: true, message: "Project deleted successfully." });
});

// =========================================================================
// 5. SERVICES & DELIVERABLES (CRUD)
// =========================================================================

// Public: Get Services
app.get("/api/services", (req, res) => {
  const db = readDatabase();
  if (!db) return res.status(500).json({ success: false, error: "Database error" });
  res.json({ success: true, data: db.services || [] });
});

// Admin: Update Service
app.put("/api/services/:id", authenticateToken, (req, res) => {
  const db = readDatabase();
  if (!db) return res.status(500).json({ success: false, error: "Database error" });

  const { id } = req.params;
  const index = (db.services || []).findIndex((s) => s.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, error: "Service not found." });
  }

  const existing = db.services[index];
  const updated = {
    ...existing,
    ...req.body,
    id: existing.id,
    fullDetails: req.body.fullDetails ? { ...existing.fullDetails, ...req.body.fullDetails } : existing.fullDetails
  };

  db.services[index] = updated;
  writeDatabase(db);

  res.json({ success: true, data: updated, message: "Service updated successfully." });
});

// =========================================================================
// 6. IT SUPPORT HELPDESK & TICKETS
// =========================================================================

// Admin: Get All Tickets
app.get("/api/tickets", authenticateToken, (req, res) => {
  const db = readDatabase();
  if (!db) return res.status(500).json({ success: false, error: "Database error" });
  res.json({ success: true, data: db.tickets || [] });
});

// Public: Lookup Ticket by ID
app.get("/api/tickets/:id", (req, res) => {
  const db = readDatabase();
  if (!db) return res.status(500).json({ success: false, error: "Database error" });

  const queryId = req.params.id.trim().toUpperCase();
  const ticket = (db.tickets || []).find((t) => t.id.toUpperCase() === queryId);

  if (!ticket) {
    return res.status(404).json({ success: false, error: `Ticket '${queryId}' was not found in our records.` });
  }

  res.json({ success: true, data: ticket });
});

// Public: Create New Support Ticket
app.post("/api/tickets", (req, res) => {
  const db = readDatabase();
  if (!db) return res.status(500).json({ success: false, error: "Database error" });

  const { name, email, category, priority, desc } = req.body;
  if (!name || !email || !desc) {
    return res.status(400).json({ success: false, error: "Name, email, and description are required." });
  }

  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const ticketId = `CG-TICK-${randomNum}`;

  const isCritical = priority === "Critical 24/7";
  const newTicket = {
    id: ticketId,
    name: name.trim(),
    email: email.trim(),
    category: category ? category.trim() : "General IT Support",
    priority: priority ? priority.trim() : "Medium",
    desc: desc.trim(),
    status: isCritical ? "Urgent Dispatch" : "In Progress",
    step: 1,
    createdAt: new Date().toLocaleString("en-US", { dateStyle: "short", timeStyle: "short" })
  };

  db.tickets = db.tickets || [];
  db.tickets.unshift(newTicket);
  writeDatabase(db);

  // Silent backend notification to coratechglobal@gmail.com
  sendSilentNotification({
    subject: `🛠️ New Service / Support Ticket: ${newTicket.category} (${newTicket.id})`,
    text: `Client Name: ${newTicket.name}
Client Email: ${newTicket.email}
Service Category: ${newTicket.category}
Urgency Level: ${newTicket.priority}
Ticket ID: ${newTicket.id}
Date Logged: ${newTicket.createdAt}

Problem Description:
${newTicket.desc}`
  });

  res.status(201).json({ success: true, data: newTicket, message: "Support ticket registered successfully." });
});

// Admin: Update Ticket Status / Step
app.patch("/api/tickets/:id", authenticateToken, (req, res) => {
  const db = readDatabase();
  if (!db) return res.status(500).json({ success: false, error: "Database error" });

  const { id } = req.params;
  const index = (db.tickets || []).findIndex((t) => t.id.toUpperCase() === id.toUpperCase());

  if (index === -1) {
    return res.status(404).json({ success: false, error: "Ticket not found." });
  }

  const existing = db.tickets[index];
  const { status, step, notes } = req.body;

  if (status) existing.status = status;
  if (step !== undefined) existing.step = parseInt(step);
  if (notes) existing.notes = notes;

  db.tickets[index] = existing;
  writeDatabase(db);

  res.json({ success: true, data: existing, message: "Ticket updated successfully." });
});

// Admin: Delete Ticket
app.delete("/api/tickets/:id", authenticateToken, (req, res) => {
  const db = readDatabase();
  if (!db) return res.status(500).json({ success: false, error: "Database error" });

  const { id } = req.params;
  const initialLength = (db.tickets || []).length;
  db.tickets = (db.tickets || []).filter((t) => t.id.toUpperCase() !== id.toUpperCase());

  if (db.tickets.length === initialLength) {
    return res.status(404).json({ success: false, error: "Ticket not found." });
  }

  writeDatabase(db);
  res.json({ success: true, message: "Ticket deleted successfully." });
});

// =========================================================================
// 7. APPOINTMENT BOOKINGS & CONSULTATIONS
// =========================================================================

// Admin: Get All Appointments
app.get("/api/appointments", authenticateToken, (req, res) => {
  const db = readDatabase();
  if (!db) return res.status(500).json({ success: false, error: "Database error" });
  res.json({ success: true, data: db.appointments || [] });
});

// Public: Book Appointment
app.post("/api/appointments", (req, res) => {
  const db = readDatabase();
  if (!db) return res.status(500).json({ success: false, error: "Database error" });

  const { name, phone, service, type, date, time } = req.body;
  if (!name || !phone || !date) {
    return res.status(400).json({ success: false, error: "Name, phone number, and preferred date are required." });
  }

  const randomNum = Math.floor(100 + Math.random() * 900);
  const newAppointment = {
    id: `CG-APT-${randomNum}`,
    name: name.trim(),
    phone: phone.trim(),
    service: service ? service.trim() : "General Consultation",
    type: type ? type.trim() : "Virtual Google Meet / Zoom",
    date: date.trim(),
    time: time ? time.trim() : "09:00 AM",
    status: "Pending Confirmation",
    createdAt: new Date().toISOString()
  };

  db.appointments = db.appointments || [];
  db.appointments.unshift(newAppointment);
  writeDatabase(db);

  // Silent backend notification to coratechglobal@gmail.com
  sendSilentNotification({
    subject: `📅 New Consultation Booking: ${newAppointment.service} (${newAppointment.id})`,
    text: `Client Name: ${newAppointment.name}
Phone Number: ${newAppointment.phone}
Service Focus: ${newAppointment.service}
Meeting Format: ${newAppointment.type}
Preferred Date: ${newAppointment.date}
Preferred Time: ${newAppointment.time}
Booking ID: ${newAppointment.id}
Submitted: ${new Date().toLocaleString()}`
  });

  res.status(201).json({ success: true, data: newAppointment, message: "Appointment booking submitted successfully." });
});

// Admin: Update Appointment Status
app.patch("/api/appointments/:id", authenticateToken, (req, res) => {
  const db = readDatabase();
  if (!db) return res.status(500).json({ success: false, error: "Database error" });

  const { id } = req.params;
  const index = (db.appointments || []).findIndex((a) => a.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, error: "Appointment not found." });
  }

  if (req.body.status) db.appointments[index].status = req.body.status;
  writeDatabase(db);

  res.json({ success: true, data: db.appointments[index], message: "Appointment status updated." });
});

// Admin: Delete Appointment
app.delete("/api/appointments/:id", authenticateToken, (req, res) => {
  const db = readDatabase();
  if (!db) return res.status(500).json({ success: false, error: "Database error" });

  const { id } = req.params;
  const initialLength = (db.appointments || []).length;
  db.appointments = (db.appointments || []).filter((a) => a.id !== id);

  if (db.appointments.length === initialLength) {
    return res.status(404).json({ success: false, error: "Appointment not found." });
  }

  writeDatabase(db);
  res.json({ success: true, message: "Appointment deleted successfully." });
});

// =========================================================================
// 8. CONTACT INQUIRIES & NEWSLETTER
// =========================================================================

// Admin: Get Contacts
app.get("/api/contacts", authenticateToken, (req, res) => {
  const db = readDatabase();
  if (!db) return res.status(500).json({ success: false, error: "Database error" });
  res.json({ success: true, data: db.contacts || [] });
});

// Public: Submit Contact Message
app.post("/api/contacts", (req, res) => {
  const db = readDatabase();
  if (!db) return res.status(500).json({ success: false, error: "Database error" });

  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: "Name, email, and message are required." });
  }

  const newContact = {
    id: `CNT-${Date.now()}`,
    name: name.trim(),
    email: email.trim(),
    subject: subject ? subject.trim() : "General Inquiry",
    message: message.trim(),
    createdAt: new Date().toISOString()
  };

  db.contacts = db.contacts || [];
  db.contacts.unshift(newContact);
  writeDatabase(db);

  // Silent backend notification to coratechglobal@gmail.com
  sendSilentNotification({
    subject: `✉️ New Service / Contact Inquiry: ${newContact.subject} from ${newContact.name}`,
    text: `Client Name: ${newContact.name}
Client Email: ${newContact.email}
Subject: ${newContact.subject}
Date/Time: ${new Date().toLocaleString()}

Message:
${newContact.message}`
  });

  res.status(201).json({ success: true, message: "Message sent successfully." });
});

// =========================================================================
// 8B. HARDWARE PURCHASE ORDERS & INQUIRIES
// =========================================================================

// Admin: Get All Orders
app.get("/api/orders", authenticateToken, (req, res) => {
  const db = readDatabase();
  if (!db) return res.status(500).json({ success: false, error: "Database error" });
  res.json({ success: true, data: db.orders || [] });
});

// Public: Submit Purchase / Order Request
app.post("/api/orders", (req, res) => {
  const db = readDatabase();
  if (!db) return res.status(500).json({ success: false, error: "Database error" });

  const { name, phone, email, model, priceUsd, location, notes } = req.body;
  if (!name || !phone || !model) {
    return res.status(400).json({ success: false, error: "Name, phone number, and device model are required." });
  }

  const orderId = `ORD-${Date.now().toString().slice(-6)}`;
  const newOrder = {
    id: orderId,
    name: name.trim(),
    phone: phone.trim(),
    email: email ? email.trim() : "",
    model: model.trim(),
    priceUsd: priceUsd || 0,
    location: location ? location.trim() : "Not specified",
    notes: notes ? notes.trim() : "",
    status: "Processing",
    createdAt: new Date().toISOString()
  };

  db.orders = db.orders || [];
  db.orders.unshift(newOrder);
  writeDatabase(db);

  // Silent backend notification to coratechglobal@gmail.com
  sendSilentNotification({
    subject: `🛒 New Laptop Purchase Order: ${newOrder.model} (${newOrder.id})`,
    text: `Customer Name: ${newOrder.name}
Phone/WhatsApp: ${newOrder.phone}
Email: ${newOrder.email || "N/A"}
Device Ordered: ${newOrder.model}
Price: GH₵ ${newOrder.priceUsd}
Delivery Location: ${newOrder.location}
Special Notes/Upgrades: ${newOrder.notes || "None"}
Order ID: ${newOrder.id}
Date: ${new Date().toLocaleString()}`
  });

  res.status(201).json({
    success: true,
    data: newOrder,
    message: "Your purchase order request has been received. Our sales team will contact you shortly."
  });
});

// Admin: Update Order Status
app.patch("/api/orders/:id", authenticateToken, (req, res) => {
  const db = readDatabase();
  if (!db) return res.status(500).json({ success: false, error: "Database error" });

  const { id } = req.params;
  const index = (db.orders || []).findIndex((o) => o.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: "Order not found." });
  }

  if (req.body.status) db.orders[index].status = req.body.status;
  writeDatabase(db);
  res.json({ success: true, data: db.orders[index], message: "Order status updated." });
});

// Admin: Delete Order
app.delete("/api/orders/:id", authenticateToken, (req, res) => {
  const db = readDatabase();
  if (!db) return res.status(500).json({ success: false, error: "Database error" });

  const { id } = req.params;
  const initialLength = (db.orders || []).length;
  db.orders = (db.orders || []).filter((o) => o.id !== id);

  if (db.orders.length === initialLength) {
    return res.status(404).json({ success: false, error: "Order not found." });
  }

  writeDatabase(db);
  res.json({ success: true, message: "Order deleted successfully." });
});

// Admin: Get Newsletter Subscribers
app.get("/api/newsletter", authenticateToken, (req, res) => {
  const db = readDatabase();
  if (!db) return res.status(500).json({ success: false, error: "Database error" });
  res.json({ success: true, data: db.newsletter || [] });
});

// Public: Subscribe Newsletter
app.post("/api/newsletter", (req, res) => {
  const db = readDatabase();
  if (!db) return res.status(500).json({ success: false, error: "Database error" });

  const { email } = req.body;
  if (!email || !email.includes("@")) {
    return res.status(400).json({ success: false, error: "A valid email is required." });
  }

  db.newsletter = db.newsletter || [];
  const exists = db.newsletter.some((n) => n.email.toLowerCase() === email.toLowerCase().trim());
  if (!exists) {
    db.newsletter.unshift({
      email: email.trim(),
      subscribedAt: new Date().toISOString()
    });
    writeDatabase(db);
  }

  res.json({ success: true, message: "Subscribed successfully." });
});

// =========================================================================
// 9. SETTINGS & CURRENCY CONFIGURATION
// =========================================================================

// Public: Get Settings
app.get("/api/settings", (req, res) => {
  const db = readDatabase();
  if (!db) return res.status(500).json({ success: false, error: "Database error" });
  res.json({ success: true, data: db.settings || {} });
});

// Admin: Update Settings
app.put("/api/settings", authenticateToken, (req, res) => {
  const db = readDatabase();
  if (!db) return res.status(500).json({ success: false, error: "Database error" });

  db.settings = {
    ...db.settings,
    ...req.body
  };

  writeDatabase(db);
  res.json({ success: true, data: db.settings, message: "Settings updated successfully." });
});

// =========================================================================
// 10. ADMIN DASHBOARD ROUTE FALLBACK (Configurable & Hidden)
// =========================================================================

const ADMIN_ROUTE = process.env.ADMIN_ROUTE || "/admin";

// If a custom secret ADMIN_ROUTE is set, strictly block /admin from ever responding
if (ADMIN_ROUTE !== "/admin") {
  app.use((req, res, next) => {
    const p = req.path.toLowerCase();
    if (p === "/admin" || p.startsWith("/admin/") || p.startsWith("/admin")) {
      return res.status(404).send("<!DOCTYPE html><html><head><title>404 Not Found</title></head><body><h1>404 Not Found</h1><p>The requested resource was not found.</p></body></html>");
    }
    next();
  });
}

// Serve Admin CMS ONLY on the configured secret ADMIN_ROUTE
app.use(ADMIN_ROUTE, express.static(path.join(__dirname, "admin")));
app.get(`${ADMIN_ROUTE}*`, (req, res) => {
  res.sendFile(path.join(__dirname, "admin", "index.html"));
});

// Global Error Handling Middleware (Ensures JSON is always returned, not raw HTML)
app.use((err, req, res, next) => {
  console.error("API Error:", err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "An internal server error occurred."
  });
});

// Server Initialization
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` CORATECH GLOBAL FULL-STACK PLATFORM RUNNING`);
  console.log(` Web Portal:  http://localhost:${PORT}`);
  console.log(` Admin Panel: http://localhost:${PORT}${ADMIN_ROUTE}`);
  console.log(` REST API:    http://localhost:${PORT}/api/hardware`);
  console.log(`====================================================`);
});
