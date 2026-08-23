# CORATECH GLOBAL - HOSTING & CUSTOM DOMAIN DEPLOYMENT GUIDE
## How to Deploy Your Full-Stack Website & Admin CMS to `coratechglobal.com`

This guide walks you through deploying your Node.js backend, Admin CMS, and dynamic frontend to the internet with your custom domain **`coratechglobal.com`** and automated **SSL/HTTPS**.

---

## Architecture Summary
- **Frontend & Admin Portal**: `index.html`, `/admin`, `styles.css`, `app.js`
- **Backend API**: Node.js & Express (`server.js`)
- **Database & Media Store**: `data/database.json` & `/uploads/`
- **Recommended Host**: **Render.com** or **Railway.app** (Offers automated continuous deployment from GitHub, free SSL, and custom domain routing).

---

## Step 1: Push Your Code to GitHub

If you haven't initialized a git repository yet:

```bash
# 1. Initialize Git in the project directory
git init

# 2. Add all project files
git add .

# 3. Create initial commit
git commit -m "Initial commit of Coratech Global full-stack platform"

# 4. Create a repository on GitHub (e.g. named coratech-global)
# Then link and push:
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/coratech-global.git
git push -u origin main
```

---

## Step 2: Deploy to Render.com (Recommended)

1. Go to [https://render.com](https://render.com) and create a free account or log in with GitHub.
2. Click **New +** and select **Web Service**.
3. Choose your GitHub repository (`coratech-global`).
4. Configure the service settings:
   - **Name**: `coratech-global`
   - **Region**: Choose the closest location (e.g., Frankfurt, Oregon, London).
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free or Starter
5. Under **Advanced / Environment Variables**, add:
   - `JWT_SECRET`: `coratech_production_secure_key_2026_x89`
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
6. Click **Create Web Service**. Render will install dependencies and start your live server in ~1 minute!

---

## Step 3: Link Your Custom Domain (`coratechglobal.com`)

Once your app is deployed on Render (you'll get a temporary URL like `coratech-global.onrender.com`):

1. In your Render Dashboard, go to your Web Service > **Settings** > scroll to **Custom Domains**.
2. Click **Add Custom Domain** and enter:
   - `coratechglobal.com`
   - `www.coratechglobal.com`
3. Render will display the DNS records you need to add to your domain registrar (Namecheap, GoDaddy, Porkbun, Cloudflare, etc.).

### Configure DNS Records in Your Domain Registrar:

| Type | Name / Host | Value / Target | TTL |
| :--- | :--- | :--- | :--- |
| **A Record** | `@` (or root) | `216.24.57.1` *(Render's IP, check Render dashboard)* | Automatic / 300 |
| **CNAME Record** | `www` | `coratech-global.onrender.com` | Automatic / 300 |

> [!NOTE]
> **Automatic Free SSL**: Once the DNS records propagate (usually 5 to 30 minutes), Render will automatically generate and install a **Free Let's Encrypt SSL/TLS Certificate**. Your site will automatically enforce `https://coratechglobal.com`.

---

## Step 4: Admin CMS Access in Production

Once live:
- **Public Website**: `https://coratechglobal.com`
- **Admin Management Portal**: `https://coratechglobal.com/admin`
- **Default Login Email**: `admin@coratechglobal.com`
- **Default Password**: `admin1234`

> [!IMPORTANT]
> Immediately upon your first login in production, navigate to the **Settings & Security** tab in the Admin Portal to update your admin password and configure your WhatsApp dispatch phone number.

---

## Step 5: Professional Business Emails (Optional)

To receive customer emails at `contact@coratechglobal.com` or `support@coratechglobal.com`:

- **Free Option (Zoho Mail)**: Supports up to 5 business email addresses for free. Add Zoho's MX records to your domain DNS.
- **Cloudflare Email Routing (Free)**: Forwards all incoming emails from `support@coratechglobal.com` directly to your personal Gmail/Yahoo inbox for free.
- **Google Workspace**: $6/month per user with Google Drive, Meet, and Gmail.
