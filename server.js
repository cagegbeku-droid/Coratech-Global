require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "coratech_global_enterprise_sec_key_2026_9x48q";

// =========================================================================
// 2. TWO-WAY EMAIL ENGINE & OFFICIAL PDF GENERATOR
// Dual-recipient dispatch: Customer Receipt + Admin (coratechglobal@gmail.com)
// =========================================================================
const DEFAULT_ADMIN_EMAIL = "coratechglobal@gmail.com";

function getMailConfig() {
  let dbConfig = {};
  try {
    const db = readDatabase();
    if (db && db.settings && db.settings.emailConfig) {
      dbConfig = db.settings.emailConfig;
    }
  } catch (e) {}

  const user = (process.env.EMAIL_USER || process.env.SMTP_USER || dbConfig.user || "").trim();
  const rawPass = (process.env.EMAIL_PASS || process.env.SMTP_PASS || dbConfig.pass || "").trim();
  const pass = rawPass.replace(/\s+/g, ""); // Strip whitespace from 16-char app passwords
  const recipient = (dbConfig.recipient || process.env.NOTIFICATION_RECIPIENT || DEFAULT_ADMIN_EMAIL).trim();
  const senderName = (dbConfig.senderName || "Coratech Global").trim();
  const host = (dbConfig.host || process.env.SMTP_HOST || "smtp.gmail.com").trim();
  const port = parseInt(dbConfig.port || process.env.SMTP_PORT || "465", 10);
  const secure = dbConfig.secure !== undefined ? Boolean(dbConfig.secure) : (port === 465);

  return { user, pass, recipient, senderName, host, port, secure };
}

function createMailTransporter() {
  const cfg = getMailConfig();
  if (cfg.user && cfg.pass) {
    return nodemailer.createTransport({
      host: cfg.host,
      port: cfg.port,
      secure: cfg.secure, // Direct SSL on port 465 works reliably across cloud hosts like Render/AWS
      auth: {
        user: cfg.user,
        pass: cfg.pass
      },
      tls: {
        rejectUnauthorized: false
      },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 20000
    });
  }
  return null;
}

// Unified async email dispatcher with outbox logging
function dispatchSystemEmail({ to, subject, text, html, attachments = [], category = "notification" }) {
  setImmediate(async () => {
    const cfg = getMailConfig();
    const targetEmail = to || cfg.recipient;
    const isCustomer = targetEmail.toLowerCase() !== cfg.recipient.toLowerCase();

    console.log(`\n======================================================`);
    console.log(`[EMAIL DISPATCH: ${category.toUpperCase()} -> ${targetEmail}]`);
    console.log(`Subject: ${subject}`);
    console.log(`Time:    ${new Date().toISOString()}`);
    if (text) console.log(`Summary:\n${text.substring(0, 250)}...`);
    console.log(`======================================================\n`);

    let deliveryStatus = "Logged";
    let failureReason = null;

    const transporter = createMailTransporter();
    if (transporter) {
      try {
        await transporter.sendMail({
          from: `"${cfg.senderName}" <${cfg.user || "info@coratechglobal.com"}>`,
          to: targetEmail,
          subject: subject,
          text: text,
          html: html,
          attachments: attachments
        });
        deliveryStatus = "Delivered";
        console.log(`✓ Email successfully delivered across network to ${targetEmail}`);
      } catch (err) {
        deliveryStatus = "Failed";
        failureReason = err.message;
        console.error(`Email delivery error for ${targetEmail}: ${err.message}`);
      }
    } else {
      console.log(`ℹ Notice: SMTP credentials not yet provided in .env or CRM. Email logged to database.`);
    }

    // Persist in emailLogs
    try {
      const db = readDatabase();
      if (db) {
        db.emailLogs = db.emailLogs || [];
        db.emailLogs.unshift({
          id: `LOG-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
          to: targetEmail,
          subject: subject,
          category: category,
          type: isCustomer ? "Customer" : "Admin Alert",
          status: deliveryStatus,
          error: failureReason,
          hasAttachment: attachments && attachments.length > 0,
          sentAt: new Date().toISOString()
        });
        if (db.emailLogs.length > 100) db.emailLogs = db.emailLogs.slice(0, 100);
        writeDatabase(db);
      }
    } catch (e) {
      console.warn("Could not save email log:", e.message);
    }
  });
}

// Backwards-compatible alias for admin silent alerts
function sendSilentNotification({ subject, text, html, attachments = [] }) {
  const cfg = getMailConfig();
  dispatchSystemEmail({
    to: cfg.recipient,
    subject,
    text,
    html: html || `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b;">
      <h2 style="color: #0284c7; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">${subject}</h2>
      <pre style="background: #f8fafc; padding: 14px; border-radius: 6px; white-space: pre-wrap; font-family: inherit;">${text}</pre>
      <p style="font-size: 12px; color: #94a3b8; margin-top: 20px;">Automated alert from Coratech Global Backend Engine.</p>
    </div>`,
    attachments,
    category: "admin_alert"
  });
}

// Professional HTML layout for customer emails
function buildCustomerEmailHtml({ title, greeting, bodyContent, actionLabel, actionUrl, notes }) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
  </head>
  <body style="margin:0; padding:0; background-color:#0b0f17; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color:#e2e8f0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0b0f17; padding:30px 15px;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color:#121824; border:1px solid #1e293b; border-radius:12px; overflow:hidden; box-shadow:0 15px 35px rgba(0,0,0,0.6);">
            <!-- Header -->
            <tr>
              <td style="padding:24px 30px; background:linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-bottom:2px solid #00f2fe;">
                <table width="100%">
                  <tr>
                    <td>
                      <span style="font-size:20px; font-weight:800; color:#ffffff; letter-spacing:0.5px;">
                        <span style="color:#00f2fe;">CORATECH</span> GLOBAL
                      </span>
                      <div style="font-size:11px; color:#94a3b8; text-transform:uppercase; letter-spacing:1px; margin-top:3px;">
                        Enterprise IT Infrastructure & Software Engineering
                      </div>
                    </td>
                    <td align="right">
                      <span style="font-size:11px; color:#00f2fe; background:rgba(0,242,254,0.1); border:1px solid rgba(0,242,254,0.25); padding:4px 10px; border-radius:12px; font-weight:600;">
                        OFFICIAL DISPATCH
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:30px 30px 24px;">
                <h2 style="font-size:19px; color:#00f2fe; margin-top:0; margin-bottom:14px; font-weight:700;">
                  ${title}
                </h2>
                ${greeting ? `<p style="font-size:15px; color:#f8fafc; margin-bottom:16px;">Hello <strong>${greeting}</strong>,</p>` : ""}
                <div style="font-size:14px; line-height:1.65; color:#cbd5e1;">
                  ${bodyContent}
                </div>

                ${actionLabel && actionUrl ? `
                  <div style="margin:28px 0; text-align:center;">
                    <a href="${actionUrl}" style="background:linear-gradient(135deg, #00f2fe 0%, #4facfe 100%); color:#06090e; padding:13px 32px; border-radius:6px; text-decoration:none; font-weight:700; font-size:14px; display:inline-block; letter-spacing:0.3px;">
                      ${actionLabel}
                    </a>
                  </div>
                ` : ""}

                ${notes ? `<div style="background:rgba(0,242,254,0.05); border:1px dashed #1e293b; padding:14px; border-radius:8px; font-size:13px; color:#94a3b8; margin-top:20px;">${notes}</div>` : ""}

                <!-- Support line -->
                <div style="margin-top:32px; padding-top:20px; border-top:1px solid #1e293b; font-size:13px; color:#94a3b8; line-height:1.6;">
                  <p style="margin:0 0 4px;"><strong style="color:#f1f5f9;">Coratech Global Client Desk:</strong></p>
                  <p style="margin:0;">
                    WhatsApp Direct: <a href="https://wa.me/233599360626" style="color:#00f2fe; text-decoration:none;">+233 59 936 0626</a> &bull; 
                    Email: <a href="mailto:info@coratechglobal.com" style="color:#00f2fe; text-decoration:none;">info@coratechglobal.com</a>
                  </p>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:16px 30px; background-color:#0c1017; font-size:11px; color:#64748b; text-align:center; border-top:1px solid #1e293b;">
                &copy; ${new Date().getFullYear()} Coratech Global. All rights reserved. Accra, Ghana &bull; Worldwide IT Delivery.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

// Generate Official PDF Proposal Document
function generateOfficialProposalPDF(data, targetPath) {
  return new Promise((resolve, reject) => {
    try {
      const targetDir = path.dirname(targetPath);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      const doc = new PDFDocument({ margin: 40, size: "A4" });
      const stream = fs.createWriteStream(targetPath);
      doc.pipe(stream);

      // Top Banner
      doc.rect(0, 0, 595.28, 75).fill("#0f172a");
      doc.fontSize(22).fillColor("#00f2fe").text("CORATECH", 40, 22, { continued: true });
      doc.fillColor("#ffffff").text(" GLOBAL");
      doc.fontSize(8.5).fillColor("#94a3b8").text("ENTERPRISE IT INFRASTRUCTURE & SOFTWARE ENGINEERING", 40, 48);

      doc.fontSize(9).fillColor("#00f2fe").text("OFFICIAL PROPOSAL & SCOPE ESTIMATE", 330, 24, { align: "right" });
      doc.fontSize(8).fillColor("#ffffff").text(`REF: ${data.id}`, 330, 40, { align: "right" });
      doc.fontSize(7.5).fillColor("#94a3b8").text(`Date: ${new Date(data.createdAt).toLocaleDateString()}`, 330, 54, { align: "right" });

      // Client Meta Box
      doc.rect(40, 95, 515, 80).fillAndStroke("#f8fafc", "#e2e8f0");
      doc.fillColor("#0f172a").fontSize(10).font("Helvetica-Bold").text("CLIENT & PROJECT SPECIFICATION", 55, 107);
      doc.font("Helvetica").fontSize(9).fillColor("#334155");
      doc.text(`Client Name: ${data.name}`, 55, 125);
      doc.text(`Email Address: ${data.email}`, 55, 139);
      doc.text(`Phone / WhatsApp: ${data.phone}`, 55, 153);

      doc.text(`Company / Org: ${data.company || "Individual Client"}`, 320, 125);
      doc.text(`Primary Service: ${data.serviceName || "Custom Engineering Engagement"}`, 320, 139);
      doc.text(`Timeline Expectation: ${data.timeline || "Standard 2 - 4 Weeks"}`, 320, 153);

      // Scope Deliverables Table
      let y = 195;
      doc.font("Helvetica-Bold").fontSize(11).fillColor("#0f172a").text("PROPOSED ARCHITECTURE & SCOPE ITEMS", 40, y);
      y += 18;

      doc.rect(40, y, 515, 24).fill("#0f172a");
      doc.fillColor("#ffffff").fontSize(9).font("Helvetica-Bold");
      doc.text("DELIVERABLE MODULE", 52, y + 7);
      doc.text("DELIVERY SCOPE", 320, y + 7);
      doc.text("ESTIMATE (USD)", 450, y + 7, { align: "right", width: 95 });

      y += 24;

      // Base Service Item
      doc.rect(40, y, 515, 26).fillAndStroke("#ffffff", "#e2e8f0");
      doc.fillColor("#0f172a").font("Helvetica-Bold").fontSize(9).text(data.serviceName, 52, y + 8);
      doc.font("Helvetica").fillColor("#64748b").fontSize(8.5).text("Core Architecture & Engineering", 320, y + 8);
      doc.font("Helvetica-Bold").fillColor("#0f172a").fontSize(9).text(`$${Number(data.baseCost || 0).toLocaleString()}`, 450, y + 8, { align: "right", width: 95 });
      y += 26;

      // Add-ons
      if (Array.isArray(data.addons) && data.addons.length > 0) {
        data.addons.forEach((addon, idx) => {
          doc.rect(40, y, 515, 24).fillAndStroke(idx % 2 === 0 ? "#f8fafc" : "#ffffff", "#e2e8f0");
          doc.fillColor("#334155").font("Helvetica").fontSize(9).text(addon.name, 52, y + 7);
          doc.fillColor("#64748b").fontSize(8).text("Optional Module Enhancement", 320, y + 7);
          doc.fillColor("#0f172a").fontSize(9).text(`+$${Number(addon.cost || 0).toLocaleString()}`, 450, y + 7, { align: "right", width: 95 });
          y += 24;
        });
      }

      // Total Box
      y += 14;
      doc.rect(310, y, 245, 65).fillAndStroke("#0f172a", "#00f2fe");
      doc.fillColor("#94a3b8").fontSize(8.5).font("Helvetica").text("TOTAL ESTIMATED INVESTMENT", 325, y + 11);
      doc.fillColor("#00f2fe").fontSize(18).font("Helvetica-Bold").text(`$${Number(data.totalUsd || 0).toLocaleString()} USD`, 325, y + 25);
      if (data.totalGhs) {
        doc.fillColor("#ffffff").fontSize(9.5).font("Helvetica").text(`Approx. GH₵ ${Number(data.totalGhs).toLocaleString()}`, 325, y + 47);
      }

      y += 90;

      // Quality Guarantee & Milestone Terms
      doc.rect(40, y, 515, 96).fillAndStroke("#f0fdf4", "#86efac");
      doc.fillColor("#166534").fontSize(10).font("Helvetica-Bold").text("CORATECH GLOBAL COMMITMENT & SLA", 55, y + 12);
      doc.font("Helvetica").fontSize(8.5).fillColor("#15803d").lineGap(2.5);
      doc.text("• Clean Code & 99.99% Uptime: Enterprise-ready architecture with automated daily backups and zero vendor lock-in.", 55, y + 28);
      doc.text("• Weekly Sprint Deliveries: Transparent progress updates with direct engineering access via private Slack / WhatsApp.", 55, y + 42);
      doc.text("• 90-Day Post-Launch Warranty: Full bug fixing, performance optimizations, and security monitoring included at no extra cost.", 55, y + 56);
      doc.text("• Standard Payment Milestones: 50% Kickoff Deposit, 30% Mid-Sprint Review, 20% Production Deployment.", 55, y + 70);

      // Sign-off Footer
      y += 125;
      doc.fontSize(9).fillColor("#0f172a").font("Helvetica-Bold").text("Authorized by Coratech Global Engineering Directorate", 40, y);
      doc.fontSize(8).fillColor("#64748b").font("Helvetica").text("Accra, Ghana • Direct Dispatch: +233 59 936 0626 • info@coratechglobal.com", 40, y + 14);

      doc.end();
      stream.on("finish", () => resolve(targetPath));
      stream.on("error", (err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
}

// Ensure required directories exist
// Ensure required directories exist
const DATA_DIR = path.join(__dirname, "data");
const DB_FILE = path.join(DATA_DIR, "database.json");
const UPLOADS_DIR = path.join(__dirname, "uploads");
const PROPOSALS_DIR = path.join(UPLOADS_DIR, "proposals");
const HARDWARE_DIR = path.join(UPLOADS_DIR, "hardware");
const PORTFOLIO_DIR = path.join(UPLOADS_DIR, "portfolio");

[DATA_DIR, UPLOADS_DIR, PROPOSALS_DIR, HARDWARE_DIR, PORTFOLIO_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

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

  // 1. Dispatch Customer Receipt Email
  dispatchSystemEmail({
    to: newTicket.email,
    subject: `🛠️ Support Ticket Created: ${newTicket.id} - Coratech Global`,
    text: `Hello ${newTicket.name},

Your support ticket ${newTicket.id} has been registered with Coratech Global Technical Services.
Service Focus: ${newTicket.category}
Priority Level: ${newTicket.priority}
Status: ${newTicket.status}

Our incident response engineers have been dispatched to analyze your case. You can track your ticket live on our portal using Ticket ID: ${newTicket.id}.

Coratech Global Helpdesk
Accra, Ghana • Direct Line: +233 59 936 0626`,
    html: buildCustomerEmailHtml({
      title: `Support Ticket Dispatched: ${newTicket.id}`,
      greeting: newTicket.name,
      bodyContent: `
        <p>Your technical support incident has been received and routed to our active dispatch queue.</p>
        <div style="background:#0f172a; border:1px solid #1e293b; border-radius:8px; padding:16px; margin:16px 0;">
          <table width="100%" style="font-size:13px; color:#cbd5e1;">
            <tr><td style="color:#94a3b8; padding:4px 0;">Ticket Reference:</td><td style="color:#00f2fe; font-weight:700;">${newTicket.id}</td></tr>
            <tr><td style="color:#94a3b8; padding:4px 0;">Service Area:</td><td style="color:#f8fafc;">${newTicket.category}</td></tr>
            <tr><td style="color:#94a3b8; padding:4px 0;">Priority:</td><td style="color:#f43f5e; font-weight:600;">${newTicket.priority}</td></tr>
            <tr><td style="color:#94a3b8; padding:4px 0;">Current Status:</td><td style="color:#10b981; font-weight:600;">${newTicket.status}</td></tr>
          </table>
        </div>
        <p><strong>Incident Description:</strong><br><span style="color:#94a3b8;">${escapeHtml(newTicket.desc)}</span></p>
      `,
      actionLabel: "Track Live Ticket Status",
      actionUrl: `http://localhost:${PORT}/#support`,
      notes: "An assigned engineer will contact you via email or phone with diagnostic updates."
    }),
    category: "ticket_customer"
  });

  // 2. Alert to coratechglobal@gmail.com
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

  const { name, phone, email, service, type, date, time } = req.body;
  if (!name || !phone || !date) {
    return res.status(400).json({ success: false, error: "Name, phone number, and preferred date are required." });
  }

  const randomNum = Math.floor(100 + Math.random() * 900);
  const newAppointment = {
    id: `CG-APT-${randomNum}`,
    name: name.trim(),
    phone: phone.trim(),
    email: email ? email.trim() : "",
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

  // 1. Dispatch Customer Booking Confirmation (if email provided)
  if (newAppointment.email) {
    dispatchSystemEmail({
      to: newAppointment.email,
      subject: `📅 Consultation Booking Confirmed (${newAppointment.id}) - Coratech Global`,
      text: `Hello ${newAppointment.name},

Your consultation booking with Coratech Global has been scheduled.
Booking ID: ${newAppointment.id}
Service: ${newAppointment.service}
Format: ${newAppointment.type}
Date: ${newAppointment.date}
Time: ${newAppointment.time}

Our solutions architect will connect with you at your chosen schedule.
WhatsApp Helpdesk: +233 59 936 0626`,
      html: buildCustomerEmailHtml({
        title: `Consultation Confirmed (${newAppointment.id})`,
        greeting: newAppointment.name,
        bodyContent: `
          <p>Thank you for scheduling a strategy consultation with our enterprise architecture team.</p>
          <div style="background:#0f172a; border:1px solid #1e293b; border-radius:8px; padding:16px; margin:16px 0;">
            <table width="100%" style="font-size:13px; color:#cbd5e1;">
              <tr><td style="color:#94a3b8; padding:4px 0;">Booking ID:</td><td style="color:#00f2fe; font-weight:700;">${newAppointment.id}</td></tr>
              <tr><td style="color:#94a3b8; padding:4px 0;">Consultation Focus:</td><td style="color:#f8fafc;">${newAppointment.service}</td></tr>
              <tr><td style="color:#94a3b8; padding:4px 0;">Meeting Format:</td><td style="color:#f8fafc;">${newAppointment.type}</td></tr>
              <tr><td style="color:#94a3b8; padding:4px 0;">Scheduled Date:</td><td style="color:#10b981; font-weight:700;">${newAppointment.date}</td></tr>
              <tr><td style="color:#94a3b8; padding:4px 0;">Scheduled Time:</td><td style="color:#10b981; font-weight:700;">${newAppointment.time}</td></tr>
            </table>
          </div>
        `,
        actionLabel: "Chat on WhatsApp Support",
        actionUrl: `https://wa.me/233599360626?text=${encodeURIComponent(`Hello Coratech Global, I booked consultation ${newAppointment.id} for ${newAppointment.date}.`)}`,
        notes: "If you need to reschedule or have preparatory documentation, please reply directly or message us on WhatsApp."
      }),
      category: "appointment_customer"
    });
  }

  // 2. Alert to coratechglobal@gmail.com
  sendSilentNotification({
    subject: `📅 New Consultation Booking: ${newAppointment.service} (${newAppointment.id})`,
    text: `Client Name: ${newAppointment.name}
Phone Number: ${newAppointment.phone}
Email: ${newAppointment.email || "Not specified"}
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

  // 1. Dispatch Customer Inquiry Acknowledgment
  dispatchSystemEmail({
    to: newContact.email,
    subject: `We have received your message - Coratech Global`,
    text: `Hello ${newContact.name},

Thank you for reaching out to Coratech Global.
Subject: ${newContact.subject}

We have received your message and an IT consultant will review your inquiry and follow up shortly.
Direct WhatsApp: +233 59 936 0626`,
    html: buildCustomerEmailHtml({
      title: "Inquiry Received & Under Review",
      greeting: newContact.name,
      bodyContent: `
        <p>Thank you for contacting Coratech Global. We have logged your message into our client dispatch system.</p>
        <p><strong>Your Inquiry Subject:</strong> <span style="color:#00f2fe;">${escapeHtml(newContact.subject)}</span></p>
        <div style="background:#0f172a; border:1px solid #1e293b; border-radius:8px; padding:14px; margin:14px 0; font-size:13px; color:#94a3b8;">
          "${escapeHtml(newContact.message)}"
        </div>
        <p>An enterprise consultant will review your specifications and get back to you within 2 - 4 business hours.</p>
      `,
      actionLabel: "Direct WhatsApp Line",
      actionUrl: "https://wa.me/233599360626"
    }),
    category: "contact_customer"
  });

  // 2. Alert to coratechglobal@gmail.com
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

  // 1. Dispatch Customer Order Receipt (if email provided)
  if (newOrder.email) {
    dispatchSystemEmail({
      to: newOrder.email,
      subject: `🛒 Order Confirmation: ${newOrder.model} (${newOrder.id}) - Coratech Global`,
      text: `Hello ${newOrder.name},

Thank you for your order with Coratech Global!
Order ID: ${newOrder.id}
Device: ${newOrder.model}
Total: GH₵ ${newOrder.priceUsd}
Delivery Address: ${newOrder.location}

Our fulfillment team is preparing your certified device. A dispatch representative will call or message you to verify final delivery timing.
WhatsApp Hotline: +233 59 936 0626`,
      html: buildCustomerEmailHtml({
        title: `Order Confirmation: ${newOrder.model}`,
        greeting: newOrder.name,
        bodyContent: `
          <p>Thank you for choosing Coratech Global. Your device order has been registered and is currently being processed by our inspection and logistics team.</p>
          <div style="background:#0f172a; border:1px solid #1e293b; border-radius:8px; padding:16px; margin:16px 0;">
            <table width="100%" style="font-size:13px; color:#cbd5e1;">
              <tr><td style="color:#94a3b8; padding:4px 0;">Order Reference:</td><td style="color:#00f2fe; font-weight:700;">${newOrder.id}</td></tr>
              <tr><td style="color:#94a3b8; padding:4px 0;">Device Model:</td><td style="color:#ffffff; font-weight:700;">${newOrder.model}</td></tr>
              <tr><td style="color:#94a3b8; padding:4px 0;">Total Amount:</td><td style="color:#10b981; font-weight:700; font-size:15px;">GH₵ ${Number(newOrder.priceUsd).toLocaleString()}</td></tr>
              <tr><td style="color:#94a3b8; padding:4px 0;">Delivery Location:</td><td style="color:#f8fafc;">${newOrder.location}</td></tr>
              ${newOrder.notes ? `<tr><td style="color:#94a3b8; padding:4px 0;">Special Requests:</td><td style="color:#cbd5e1;">${escapeHtml(newOrder.notes)}</td></tr>` : ""}
            </table>
          </div>
          <p>Every device includes genuine Windows pre-installed, high-speed charger, and our official Coratech Warranty.</p>
        `,
        actionLabel: "Verify Order on WhatsApp",
        actionUrl: `https://wa.me/233599360626?text=${encodeURIComponent(`Hello Coratech Global, I am checking on my order ${newOrder.id} (${newOrder.model}).`)}`,
        notes: "A sales agent will reach out shortly via phone or WhatsApp to coordinate dispatch."
      }),
      category: "order_customer"
    });
  }

  // 2. Alert to coratechglobal@gmail.com
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
// 8C. OFFICIAL PDF PROPOSALS & QUOTATIONS
// =========================================================================

// Public: Request & Generate Official PDF Proposal
app.post("/api/proposals", async (req, res) => {
  const db = readDatabase();
  if (!db) return res.status(500).json({ success: false, error: "Database error" });

  const { name, email, phone, company, serviceName, baseCost, multiplier, addons, totalUsd, totalGhs, timeline } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ success: false, error: "Client name, email, and phone number are required." });
  }

  const proposalId = `CG-PROP-${Math.floor(1000 + Math.random() * 9000)}`;
  const fileName = `proposal-${proposalId.toLowerCase()}.pdf`;
  const pdfFilePath = path.join(__dirname, "uploads", "proposals", fileName);

  const newProposal = {
    id: proposalId,
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    company: company ? company.trim() : "",
    serviceName: serviceName || "Custom Engineering Engagement",
    baseCost: parseFloat(baseCost) || 0,
    multiplier: parseFloat(multiplier) || 1,
    addons: Array.isArray(addons) ? addons : [],
    totalUsd: parseFloat(totalUsd) || 0,
    totalGhs: parseFloat(totalGhs) || 0,
    timeline: timeline || "2 - 4 Weeks",
    pdfUrl: `/uploads/proposals/${fileName}`,
    createdAt: new Date().toISOString()
  };

  try {
    // Generate the official PDF file
    await generateOfficialProposalPDF(newProposal, pdfFilePath);

    db.proposals = db.proposals || [];
    db.proposals.unshift(newProposal);
    writeDatabase(db);

    const pdfAttachment = {
      filename: `Coratech_Global_Proposal_${proposalId}.pdf`,
      path: pdfFilePath,
      contentType: "application/pdf"
    };

    // 1. Dispatch PDF directly to Customer Email
    dispatchSystemEmail({
      to: newProposal.email,
      subject: `📄 Official Project Proposal & Budget Estimate (${newProposal.id}) - Coratech Global`,
      text: `Hello ${newProposal.name},

Thank you for your interest in Coratech Global Enterprise Services.
Attached to this email is your official project proposal & scope estimate:

Proposal ID: ${newProposal.id}
Service Area: ${newProposal.serviceName}
Estimated Investment: $${Number(newProposal.totalUsd).toLocaleString()} USD (approx. GH₵ ${Number(newProposal.totalGhs).toLocaleString()})
Delivery Timeline: ${newProposal.timeline}

Please review the attached formal PDF proposal for full scope breakdown, SLAs, milestone schedule, and next steps.

Coratech Global Engineering Directorate
WhatsApp Hotline: +233 59 936 0626 • info@coratechglobal.com`,
      html: buildCustomerEmailHtml({
        title: `Your Official Project Proposal & Scope Estimate`,
        greeting: newProposal.name,
        bodyContent: `
          <p>Thank you for requesting an official scope breakdown from Coratech Global. We have generated your formal PDF proposal document and attached it directly to this email.</p>
          <div style="background:#0f172a; border:1px solid #1e293b; border-radius:8px; padding:16px; margin:16px 0;">
            <table width="100%" style="font-size:13px; color:#cbd5e1;">
              <tr><td style="color:#94a3b8; padding:4px 0;">Proposal Reference:</td><td style="color:#00f2fe; font-weight:700;">${newProposal.id}</td></tr>
              <tr><td style="color:#94a3b8; padding:4px 0;">Target Service:</td><td style="color:#ffffff; font-weight:700;">${newProposal.serviceName}</td></tr>
              <tr><td style="color:#94a3b8; padding:4px 0;">Project Investment:</td><td style="color:#10b981; font-weight:700; font-size:15px;">$${Number(newProposal.totalUsd).toLocaleString()} USD</td></tr>
              <tr><td style="color:#94a3b8; padding:4px 0;">Estimated Timeline:</td><td style="color:#f8fafc;">${newProposal.timeline}</td></tr>
            </table>
          </div>
          <p>The complete technical deliverables, SLA guarantee, and milestone breakdown are detailed in the attached PDF.</p>
        `,
        actionLabel: "Chat with Lead Architect on WhatsApp",
        actionUrl: `https://wa.me/233599360626?text=${encodeURIComponent(`Hello Coratech Global, I received official proposal ${newProposal.id} for ${newProposal.serviceName} ($${newProposal.totalUsd}). I'd like to discuss kickoff.`)}`,
        notes: "A PDF copy is attached to this email. You may also download it directly from our web portal."
      }),
      attachments: [pdfAttachment],
      category: "proposal_customer"
    });

    // 2. Dispatch copy with PDF to Admin (coratechglobal@gmail.com)
    sendSilentNotification({
      subject: `💼 New Project Proposal Request: ${newProposal.name} - $${newProposal.totalUsd} (${newProposal.id})`,
      text: `Client Name: ${newProposal.name}
Email: ${newProposal.email}
Phone / WhatsApp: ${newProposal.phone}
Company: ${newProposal.company || "N/A"}
Service: ${newProposal.serviceName}
Estimated Budget: $${newProposal.totalUsd} (GH₵ ${newProposal.totalGhs})
Proposal ID: ${newProposal.id}
Date: ${new Date().toLocaleString()}

Official PDF generated and attached to this dispatch.`,
      attachments: [pdfAttachment]
    });

    res.status(201).json({
      success: true,
      data: newProposal,
      pdfUrl: newProposal.pdfUrl,
      message: "Official PDF proposal generated and dispatched to your email successfully!"
    });
  } catch (err) {
    console.error("PDF Proposal Generation Error:", err);
    res.status(500).json({ success: false, error: "Could not generate proposal PDF: " + err.message });
  }
});

// Admin: Get All Proposals
app.get("/api/proposals", authenticateToken, (req, res) => {
  const db = readDatabase();
  if (!db) return res.status(500).json({ success: false, error: "Database error" });
  res.json({ success: true, data: db.proposals || [] });
});

// Admin: Delete Proposal
app.delete("/api/proposals/:id", authenticateToken, (req, res) => {
  const db = readDatabase();
  if (!db) return res.status(500).json({ success: false, error: "Database error" });

  const { id } = req.params;
  db.proposals = (db.proposals || []).filter((p) => p.id !== id);
  writeDatabase(db);
  res.json({ success: true, message: "Proposal deleted successfully." });
});

// =========================================================================
// 8D. EMAIL OUTBOX & SMTP DIAGNOSTIC ENGINE
// =========================================================================

// Admin: Get Email Logs
app.get("/api/email/logs", authenticateToken, (req, res) => {
  const db = readDatabase();
  if (!db) return res.status(500).json({ success: false, error: "Database error" });
  res.json({ success: true, data: db.emailLogs || [] });
});

// Admin: Send Live Test Email to Verify Credentials
app.post("/api/email/test", authenticateToken, async (req, res) => {
  const cfg = getMailConfig();
  if (!cfg.user || !cfg.pass) {
    return res.status(400).json({
      success: false,
      error: "No email sender credentials configured. Please configure your Gmail address & App Password first."
    });
  }

  const transporter = createMailTransporter();
  if (!transporter) {
    return res.status(500).json({ success: false, error: "Could not initialize mail transporter." });
  }

  try {
    const testRecipient = req.body.to || cfg.recipient;
    await transporter.sendMail({
      from: `"${cfg.senderName} System Diagnostic" <${cfg.user}>`,
      to: testRecipient,
      subject: `✅ Coratech Global Live SMTP Verification [${new Date().toLocaleTimeString()}]`,
      text: `Hello Administrator,

This confirms that your email engine is 100% active and connected to live mail servers.
Dispatches will now arrive in real customer inboxes and to ${cfg.recipient}.

Server Time: ${new Date().toISOString()}
Sender Address: ${cfg.user}`,
      html: `
        <div style="font-family:Arial,sans-serif; background:#0f172a; color:#f8fafc; padding:30px; border-radius:10px;">
          <h2 style="color:#00f2fe; margin-top:0;">✅ Live Email Engine Operational</h2>
          <p>This automated message confirms that your SMTP connection is fully authenticated.</p>
          <ul style="color:#94a3b8; line-height:1.8;">
            <li>Sender Account: <strong style="color:#f8fafc;">${cfg.user}</strong></li>
            <li>Admin Alert Recipient: <strong style="color:#f8fafc;">${testRecipient}</strong></li>
            <li>Status: <strong style="color:#10b981;">Online & Authenticated</strong></li>
          </ul>
        </div>
      `
    });

    res.json({
      success: true,
      message: `Test email successfully dispatched across the internet to ${testRecipient}!`
    });
  } catch (err) {
    console.error("Live test email error:", err);
    res.status(500).json({
      success: false,
      error: "SMTP Error: " + err.message
    });
  }
});

// Admin: Update Email SMTP Configuration
app.patch("/api/settings/email", authenticateToken, (req, res) => {
  const db = readDatabase();
  if (!db) return res.status(500).json({ success: false, error: "Database error" });

  const { user, pass, recipient, senderName, host, port, secure } = req.body;
  db.settings = db.settings || {};
  db.settings.emailConfig = {
    user: user !== undefined ? user.trim() : (db.settings.emailConfig?.user || ""),
    pass: pass !== undefined ? pass.trim().replace(/\s+/g, "") : (db.settings.emailConfig?.pass || ""),
    recipient: recipient !== undefined ? recipient.trim() : (db.settings.emailConfig?.recipient || DEFAULT_ADMIN_EMAIL),
    senderName: senderName !== undefined ? senderName.trim() : (db.settings.emailConfig?.senderName || "Coratech Global"),
    host: host !== undefined ? host.trim() : (db.settings.emailConfig?.host || "smtp.gmail.com"),
    port: port !== undefined ? parseInt(port, 10) : (db.settings.emailConfig?.port || 465),
    secure: secure !== undefined ? Boolean(secure) : (db.settings.emailConfig?.secure !== undefined ? db.settings.emailConfig.secure : true)
  };

  writeDatabase(db);
  res.json({
    success: true,
    data: {
      user: db.settings.emailConfig.user,
      recipient: db.settings.emailConfig.recipient,
      senderName: db.settings.emailConfig.senderName,
      host: db.settings.emailConfig.host,
      port: db.settings.emailConfig.port,
      secure: db.settings.emailConfig.secure,
      isPassSet: Boolean(db.settings.emailConfig.pass)
    },
    message: "Email SMTP configuration saved successfully."
  });
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
