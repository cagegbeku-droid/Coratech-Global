/**
 * Coratech Global - Neon PostgreSQL & Hybrid Database Engine
 * Connects to Neon PostgreSQL serverless cloud database when DATABASE_URL is configured,
 * with automatic schema initialization, data migration from JSON, and offline fallback.
 */

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

const DATA_DIR = path.join(__dirname, "data");
const DB_FILE = path.join(DATA_DIR, "database.json");

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Connection string detection (Neon standard is DATABASE_URL or NEON_DATABASE_URL)
const connectionString = (process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || "").trim();

let pool = null;
let isPostgresConnected = false;

if (connectionString) {
  try {
    pool = new Pool({
      connectionString: connectionString,
      ssl: {
        rejectUnauthorized: false
      },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000
    });
    console.log("Neon PostgreSQL pool configured with SSL connection.");
  } catch (err) {
    console.error("Failed to initialize PostgreSQL pool:", err.message);
  }
} else {
  console.log("No DATABASE_URL supplied; operating in local JSON database mode.");
}

// Fallback JSON Helpers
function readLocalJSON() {
  try {
    if (!fs.existsSync(DB_FILE)) return null;
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading local database.json:", err.message);
    return null;
  }
}

function writeLocalJSON(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error writing local database.json:", err.message);
    return false;
  }
}

/**
 * Initialize Tables & Migrations in Neon Postgres
 */
async function initPostgresSchema() {
  if (!pool) return false;

  try {
    const client = await pool.connect();
    console.log("Connected to Neon PostgreSQL instance successfully.");

    // Create Tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id VARCHAR(50) PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT,
        role TEXT,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS site_settings (
        id VARCHAR(50) PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS hardware_laptops (
        id VARCHAR(100) PRIMARY KEY,
        model TEXT NOT NULL,
        category TEXT,
        category_label TEXT,
        image TEXT,
        condition TEXT,
        badge_cert TEXT,
        specs JSONB,
        price_usd NUMERIC,
        warranty TEXT,
        in_stock BOOLEAN DEFAULT TRUE,
        featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS portfolio_projects (
        id VARCHAR(100) PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT,
        category_label TEXT,
        image TEXT,
        description TEXT,
        metric TEXT,
        tech_stack TEXT,
        challenge TEXT,
        solution TEXT,
        outcome TEXT,
        featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS services_catalog (
        id VARCHAR(100) PRIMARY KEY,
        title TEXT NOT NULL,
        icon TEXT,
        summary TEXT,
        features JSONB,
        full_details JSONB,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS tickets (
        id VARCHAR(100) PRIMARY KEY,
        name TEXT,
        email TEXT,
        category TEXT,
        priority TEXT,
        problem_desc TEXT,
        status TEXT,
        step INTEGER DEFAULT 1,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS appointments (
        id VARCHAR(100) PRIMARY KEY,
        name TEXT,
        phone TEXT,
        email TEXT,
        service TEXT,
        format_type TEXT,
        scheduled_date TEXT,
        time_slot TEXT,
        status TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(100) PRIMARY KEY,
        name TEXT,
        phone TEXT,
        email TEXT,
        model TEXT,
        price_usd NUMERIC,
        location TEXT,
        notes TEXT,
        status TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS proposals (
        id VARCHAR(100) PRIMARY KEY,
        name TEXT,
        email TEXT,
        phone TEXT,
        company TEXT,
        service_name TEXT,
        base_cost NUMERIC,
        multiplier NUMERIC,
        addons JSONB,
        total_usd NUMERIC,
        total_ghs NUMERIC,
        timeline TEXT,
        pdf_url TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS email_logs (
        id VARCHAR(100) PRIMARY KEY,
        recipient TEXT,
        subject TEXT,
        category TEXT,
        type TEXT,
        status TEXT,
        error TEXT,
        has_attachment BOOLEAN DEFAULT FALSE,
        sent_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id VARCHAR(100) PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        subscribed_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS contacts (
        id VARCHAR(100) PRIMARY KEY,
        name TEXT,
        email TEXT,
        phone TEXT,
        subject TEXT,
        message TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    console.log("Neon PostgreSQL tables verified & ready.");

    // Check if initial seeding is needed from database.json
    const adminCheck = await client.query("SELECT COUNT(*) FROM admin_users");
    const adminCount = parseInt(adminCheck.rows[0].count, 10);

    if (adminCount === 0) {
      console.log("Seeding initial data from database.json into Neon PostgreSQL...");
      const local = readLocalJSON();
      if (local) {
        // Seed Admin
        if (local.admin) {
          await client.query(
            "INSERT INTO admin_users (id, email, password, name, role) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING",
            ["admin-1", local.admin.email, local.admin.password, local.admin.name, local.admin.role]
          );
        }

        // Seed Settings
        if (local.settings) {
          await client.query(
            "INSERT INTO site_settings (id, data) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET data = $2",
            ["main_settings", local.settings]
          );
        }

        // Seed Hardware
        if (Array.isArray(local.hardware) && local.hardware.length > 0) {
          for (const hw of local.hardware) {
            await client.query(
              `INSERT INTO hardware_laptops (id, model, category, category_label, image, condition, badge_cert, specs, price_usd, warranty, in_stock, featured, created_at)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
               ON CONFLICT (id) DO NOTHING`,
              [
                hw.id,
                hw.model,
                hw.category,
                hw.categoryLabel,
                hw.image,
                hw.condition,
                hw.badgeCert,
                JSON.stringify(hw.specs || {}),
                hw.priceUsd || 0,
                hw.warranty,
                hw.inStock !== false,
                Boolean(hw.featured),
                hw.createdAt || new Date().toISOString()
              ]
            );
          }
        }

        // Seed Portfolio
        if (Array.isArray(local.portfolio) && local.portfolio.length > 0) {
          for (const p of local.portfolio) {
            await client.query(
              `INSERT INTO portfolio_projects (id, title, category, category_label, image, description, metric, tech_stack, challenge, solution, outcome, featured, created_at)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
               ON CONFLICT (id) DO NOTHING`,
              [
                p.id,
                p.title,
                p.category,
                p.categoryLabel,
                p.image,
                p.description,
                p.metric,
                p.techStack,
                p.challenge,
                p.solution,
                p.outcome,
                Boolean(p.featured),
                p.createdAt || new Date().toISOString()
              ]
            );
          }
        }

        // Seed Services
        if (Array.isArray(local.services) && local.services.length > 0) {
          for (const s of local.services) {
            await client.query(
              `INSERT INTO services_catalog (id, title, icon, summary, features, full_details)
               VALUES ($1, $2, $3, $4, $5, $6)
               ON CONFLICT (id) DO NOTHING`,
              [
                s.id,
                s.title,
                s.icon,
                s.summary,
                JSON.stringify(s.features || []),
                JSON.stringify(s.fullDetails || {})
              ]
            );
          }
        }

        console.log("Initial seed migration to Neon PostgreSQL completed successfully.");
      }
    }

    client.release();
    isPostgresConnected = true;
    return true;
  } catch (err) {
    console.error("Neon PostgreSQL connection/initialization error:", err.message);
    isPostgresConnected = false;
    return false;
  }
}

/**
 * Fetch entire system state as standard JSON object (Postgres or local fallback)
 */
async function getDatabase() {
  if (isPostgresConnected && pool) {
    try {
      const client = await pool.connect();
      try {
        // 1. Admin
        const adminRes = await client.query("SELECT email, password, name, role FROM admin_users LIMIT 1");
        const admin = adminRes.rows[0] || {
          email: "admin@coratechglobal.com",
          password: "",
          name: "Coratech Administrator",
          role: "Super Admin"
        };

        // 2. Settings
        const settingsRes = await client.query("SELECT data FROM site_settings WHERE id = 'main_settings' LIMIT 1");
        const settings = settingsRes.rows[0] ? settingsRes.rows[0].data : {};

        // 3. Hardware
        const hwRes = await client.query("SELECT * FROM hardware_laptops ORDER BY created_at DESC");
        const hardware = hwRes.rows.map(r => ({
          id: r.id,
          model: r.model,
          category: r.category,
          categoryLabel: r.category_label,
          image: r.image,
          condition: r.condition,
          badgeCert: r.badge_cert,
          specs: r.specs,
          priceUsd: Number(r.price_usd),
          warranty: r.warranty,
          inStock: r.in_stock,
          featured: r.featured,
          createdAt: r.created_at
        }));

        // 4. Portfolio
        const portRes = await client.query("SELECT * FROM portfolio_projects ORDER BY created_at DESC");
        const portfolio = portRes.rows.map(r => ({
          id: r.id,
          title: r.title,
          category: r.category,
          categoryLabel: r.category_label,
          image: r.image,
          description: r.description,
          metric: r.metric,
          techStack: r.tech_stack,
          challenge: r.challenge,
          solution: r.solution,
          outcome: r.outcome,
          featured: r.featured,
          createdAt: r.created_at
        }));

        // 5. Services
        const servRes = await client.query("SELECT * FROM services_catalog ORDER BY id ASC");
        const services = servRes.rows.map(r => ({
          id: r.id,
          title: r.title,
          icon: r.icon,
          summary: r.summary,
          features: r.features,
          fullDetails: r.full_details
        }));

        // 6. Tickets
        const tixRes = await client.query("SELECT * FROM tickets ORDER BY created_at DESC");
        const tickets = tixRes.rows.map(r => ({
          id: r.id,
          name: r.name,
          email: r.email,
          category: r.category,
          priority: r.priority,
          problemDesc: r.problem_desc,
          status: r.status,
          step: r.step,
          createdAt: r.created_at
        }));

        // 7. Appointments
        const appRes = await client.query("SELECT * FROM appointments ORDER BY created_at DESC");
        const appointments = appRes.rows.map(r => ({
          id: r.id,
          name: r.name,
          phone: r.phone,
          email: r.email,
          service: r.service,
          format: r.format_type,
          date: r.scheduled_date,
          time: r.time_slot,
          status: r.status,
          createdAt: r.created_at
        }));

        // 8. Orders
        const ordRes = await client.query("SELECT * FROM orders ORDER BY created_at DESC");
        const orders = ordRes.rows.map(r => ({
          id: r.id,
          name: r.name,
          phone: r.phone,
          email: r.email,
          model: r.model,
          priceUsd: Number(r.price_usd),
          location: r.location,
          notes: r.notes,
          status: r.status,
          createdAt: r.created_at
        }));

        // 9. Proposals
        const propRes = await client.query("SELECT * FROM proposals ORDER BY created_at DESC");
        const proposals = propRes.rows.map(r => ({
          id: r.id,
          name: r.name,
          email: r.email,
          phone: r.phone,
          company: r.company,
          serviceName: r.service_name,
          baseCost: Number(r.base_cost),
          multiplier: Number(r.multiplier),
          addons: r.addons,
          totalUsd: Number(r.total_usd),
          totalGhs: Number(r.total_ghs),
          timeline: r.timeline,
          pdfUrl: r.pdf_url,
          createdAt: r.created_at
        }));

        // 10. Email Logs
        const logRes = await client.query("SELECT * FROM email_logs ORDER BY sent_at DESC LIMIT 200");
        const emailLogs = logRes.rows.map(r => ({
          id: r.id,
          to: r.recipient,
          subject: r.subject,
          category: r.category,
          type: r.type,
          status: r.status,
          error: r.error,
          hasAttachment: r.has_attachment,
          sentAt: r.sent_at
        }));

        // 11. Newsletter
        const newsRes = await client.query("SELECT * FROM newsletter_subscribers ORDER BY subscribed_at DESC");
        const newsletter = newsRes.rows.map(r => ({
          id: r.id,
          email: r.email,
          subscribedAt: r.subscribed_at
        }));

        // 12. Contacts
        const contRes = await client.query("SELECT * FROM contacts ORDER BY created_at DESC");
        const contacts = contRes.rows.map(r => ({
          id: r.id,
          name: r.name,
          email: r.email,
          phone: r.phone,
          subject: r.subject,
          message: r.message,
          createdAt: r.created_at
        }));

        const dbObj = {
          admin,
          settings,
          hardware,
          portfolio,
          services,
          tickets,
          appointments,
          orders,
          proposals,
          emailLogs,
          newsletter,
          contacts
        };

        // Asynchronously update local cache file for resilient offline backup
        writeLocalJSON(dbObj);
        return dbObj;
      } finally {
        client.release();
      }
    } catch (err) {
      console.error("PostgreSQL query error, falling back to local JSON cache:", err.message);
      return readLocalJSON();
    }
  }

  return readLocalJSON();
}

/**
 * Persist entire state or updates to PostgreSQL and local JSON
 */
async function saveDatabase(data) {
  if (!data) return false;

  // Always write to local JSON as fallback/cache
  writeLocalJSON(data);

  if (isPostgresConnected && pool) {
    try {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");

        // Admin
        if (data.admin) {
          await client.query(
            `INSERT INTO admin_users (id, email, password, name, role, updated_at)
             VALUES ($1, $2, $3, $4, $5, NOW())
             ON CONFLICT (id) DO UPDATE SET
               email = EXCLUDED.email,
               password = EXCLUDED.password,
               name = EXCLUDED.name,
               role = EXCLUDED.role,
               updated_at = NOW()`,
            ["admin-1", data.admin.email, data.admin.password, data.admin.name, data.admin.role]
          );
        }

        // Settings
        if (data.settings) {
          await client.query(
            `INSERT INTO site_settings (id, data, updated_at)
             VALUES ($1, $2, NOW())
             ON CONFLICT (id) DO UPDATE SET
               data = EXCLUDED.data,
               updated_at = NOW()`,
            ["main_settings", data.settings]
          );
        }

        // Sync Hardware
        if (Array.isArray(data.hardware)) {
          await client.query("DELETE FROM hardware_laptops");
          for (const hw of data.hardware) {
            await client.query(
              `INSERT INTO hardware_laptops (id, model, category, category_label, image, condition, badge_cert, specs, price_usd, warranty, in_stock, featured, created_at)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
              [
                hw.id,
                hw.model,
                hw.category,
                hw.categoryLabel,
                hw.image,
                hw.condition,
                hw.badgeCert,
                JSON.stringify(hw.specs || {}),
                hw.priceUsd || 0,
                hw.warranty,
                hw.inStock !== false,
                Boolean(hw.featured),
                hw.createdAt || new Date().toISOString()
              ]
            );
          }
        }

        // Sync Portfolio
        if (Array.isArray(data.portfolio)) {
          await client.query("DELETE FROM portfolio_projects");
          for (const p of data.portfolio) {
            await client.query(
              `INSERT INTO portfolio_projects (id, title, category, category_label, image, description, metric, tech_stack, challenge, solution, outcome, featured, created_at)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
              [
                p.id,
                p.title,
                p.category,
                p.categoryLabel,
                p.image,
                p.description,
                p.metric,
                p.techStack,
                p.challenge,
                p.solution,
                p.outcome,
                Boolean(p.featured),
                p.createdAt || new Date().toISOString()
              ]
            );
          }
        }

        // Sync Services
        if (Array.isArray(data.services)) {
          await client.query("DELETE FROM services_catalog");
          for (const s of data.services) {
            await client.query(
              `INSERT INTO services_catalog (id, title, icon, summary, features, full_details)
               VALUES ($1, $2, $3, $4, $5, $6)`,
              [
                s.id,
                s.title,
                s.icon,
                s.summary,
                JSON.stringify(s.features || []),
                JSON.stringify(s.fullDetails || {})
              ]
            );
          }
        }

        // Sync Tickets
        if (Array.isArray(data.tickets)) {
          await client.query("DELETE FROM tickets");
          for (const t of data.tickets) {
            await client.query(
              `INSERT INTO tickets (id, name, email, category, priority, problem_desc, status, step, created_at)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
              [t.id, t.name, t.email, t.category, t.priority, t.problemDesc, t.status, t.step || 1, t.createdAt || new Date().toISOString()]
            );
          }
        }

        // Sync Appointments
        if (Array.isArray(data.appointments)) {
          await client.query("DELETE FROM appointments");
          for (const a of data.appointments) {
            await client.query(
              `INSERT INTO appointments (id, name, phone, email, service, format_type, scheduled_date, time_slot, status, created_at)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
              [a.id, a.name, a.phone, a.email, a.service, a.format, a.date, a.time, a.status, a.createdAt || new Date().toISOString()]
            );
          }
        }

        // Sync Orders
        if (Array.isArray(data.orders)) {
          await client.query("DELETE FROM orders");
          for (const o of data.orders) {
            await client.query(
              `INSERT INTO orders (id, name, phone, email, model, price_usd, location, notes, status, created_at)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
              [o.id, o.name, o.phone, o.email, o.model, o.priceUsd || 0, o.location, o.notes, o.status, o.createdAt || new Date().toISOString()]
            );
          }
        }

        // Sync Proposals
        if (Array.isArray(data.proposals)) {
          await client.query("DELETE FROM proposals");
          for (const pr of data.proposals) {
            await client.query(
              `INSERT INTO proposals (id, name, email, phone, company, service_name, base_cost, multiplier, addons, total_usd, total_ghs, timeline, pdf_url, created_at)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
              [
                pr.id,
                pr.name,
                pr.email,
                pr.phone,
                pr.company,
                pr.serviceName,
                pr.baseCost || 0,
                pr.multiplier || 1,
                JSON.stringify(pr.addons || []),
                pr.totalUsd || 0,
                pr.totalGhs || 0,
                pr.timeline,
                pr.pdfUrl,
                pr.createdAt || new Date().toISOString()
              ]
            );
          }
        }

        // Sync Email Logs
        if (Array.isArray(data.emailLogs)) {
          await client.query("DELETE FROM email_logs");
          for (const log of data.emailLogs.slice(0, 200)) {
            await client.query(
              `INSERT INTO email_logs (id, recipient, subject, category, type, status, error, has_attachment, sent_at)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
              [
                log.id,
                log.to,
                log.subject,
                log.category,
                log.type,
                log.status,
                log.error,
                Boolean(log.hasAttachment),
                log.sentAt || new Date().toISOString()
              ]
            );
          }
        }

        // Sync Newsletter
        if (Array.isArray(data.newsletter)) {
          await client.query("DELETE FROM newsletter_subscribers");
          for (const n of data.newsletter) {
            await client.query(
              `INSERT INTO newsletter_subscribers (id, email, subscribed_at)
               VALUES ($1, $2, $3)
               ON CONFLICT (id) DO NOTHING`,
              [n.id, n.email, n.subscribedAt || new Date().toISOString()]
            );
          }
        }

        // Sync Contacts
        if (Array.isArray(data.contacts)) {
          await client.query("DELETE FROM contacts");
          for (const c of data.contacts) {
            await client.query(
              `INSERT INTO contacts (id, name, email, phone, subject, message, created_at)
               VALUES ($1, $2, $3, $4, $5, $6, $7)`,
              [c.id, c.name, c.email, c.phone, c.subject, c.message, c.createdAt || new Date().toISOString()]
            );
          }
        }

        await client.query("COMMIT");
        return true;
      } catch (err) {
        await client.query("ROLLBACK");
        console.error("Neon PostgreSQL saveDatabase transaction error:", err.message);
        return false;
      } finally {
        client.release();
      }
    } catch (err) {
      console.error("Neon PostgreSQL saveDatabase connection error:", err.message);
      return false;
    }
  }

  return true;
}

// Synchronous wrapper for immediate reads when sync is necessary
function readDatabase() {
  return readLocalJSON();
}

function writeDatabase(data) {
  writeLocalJSON(data);
  // Trigger background async sync to Neon Postgres
  if (isPostgresConnected) {
    saveDatabase(data).catch(e => console.error("Async saveDatabase error:", e.message));
  }
  return true;
}

module.exports = {
  pool,
  initPostgresSchema,
  getDatabase,
  saveDatabase,
  readDatabase,
  writeDatabase,
  isPostgresConnected: () => isPostgresConnected
};
