# DevMarket 🚀

> **A professional Portfolio + Marketplace + Marketing Platform** for software development services.

Browse projects, explore categories, and request custom software solutions — all in one place.

---

## 🖥️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React + Vite + Tailwind CSS v3 |
| **Backend** | Node.js + Express |
| **Database** | MongoDB Atlas |
| **Auth** | JWT (JSON Web Tokens) |
| **Email** | Nodemailer (Gmail SMTP) |
| **Deployment** | Vercel (frontend) + Render (backend) |

---

## 📁 Project Structure

```
devmarket/
├── client/          # React + Vite Frontend
└── server/          # Node.js + Express Backend
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB Atlas account (free tier works)

### 1. Clone & Setup Server

```bash
cd server
npm install

# Copy env file and fill in your values
cp .env.example .env
```

**Edit `server/.env`:**
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/devmarket
JWT_SECRET=your_super_secret_key_here
ADMIN_EMAIL=admin@devmarket.com
SMTP_USER=your@gmail.com
SMTP_PASS=your_gmail_app_password
WHATSAPP_NUMBER=+919876543210
CLIENT_URL=http://localhost:5173
```

### 2. Seed the Database

```bash
cd server
npm run seed
```

This creates:
- 5 categories (Web Dev, AI/ML, Data Science, Automation, Mobile)
- 12 sample projects
- Admin user: `admin@devmarket.com` / `Admin@123`

### 3. Start the Server

```bash
cd server
npm run dev   # Starts on http://localhost:5000
```

### 4. Setup & Start Client

```bash
cd client

# Copy env file
cp .env.example .env
# Edit: VITE_API_URL=http://localhost:5000/api

npm run dev   # Starts on http://localhost:5173
```

---

## 🌐 Pages

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Hero, services, featured projects, testimonials |
| Projects | `/projects` | Browse all projects with search & filter |
| Project Detail | `/projects/:slug` | Full project info, pricing, demo |
| Request | `/request` | Submit a project request |
| Admin Login | `/admin/login` | Secure admin authentication |
| Admin Dashboard | `/admin` | Manage projects, view requests |

---

## 🔌 API Routes

### Public
- `GET /api/projects` — List projects (supports `?search=`, `?category=`, `?featured=true`)
- `GET /api/projects/:slug` — Single project
- `GET /api/categories` — All categories with counts
- `POST /api/requests` — Submit request (triggers email notification)

### Admin (JWT Required)
- `POST /api/auth/login` — Admin login
- `GET /api/auth/me` — Current admin
- `POST/PUT/DELETE /api/projects` — Manage projects
- `POST/PUT/DELETE /api/categories` — Manage categories
- `GET/PATCH/DELETE /api/requests` — View and manage requests

---

## 🚀 Deployment

### Frontend → Vercel
1. Push `client/` to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set env variable: `VITE_API_URL=https://your-render-api.onrender.com/api`
4. Deploy!

### Backend → Render
1. Push `server/` to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Build command: `npm install`
4. Start command: `npm start`
5. Add all environment variables from `.env.example`
6. Deploy!

### Database → MongoDB Atlas
1. Create free cluster at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a database user
3. Whitelist all IPs: `0.0.0.0/0` (for Render)
4. Copy connection string to `MONGODB_URI`

---

## 👤 Admin Credentials (Default)

| Field | Value |
|-------|-------|
| Email | `admin@devmarket.com` |
| Password | `Admin@123` |

> ⚠️ **Change these in production!**

---

## 📧 Email Notifications

Uses Gmail SMTP. To enable:
1. Enable 2-factor auth on your Gmail
2. Go to Google Account → Security → App Passwords
3. Generate an App Password for "Mail"
4. Use that password as `SMTP_PASS`

---

## 💬 WhatsApp Integration

Set `VITE_WHATSAPP_NUMBER` (client) to your WhatsApp number.  
A floating button will appear on all public pages.

---

## 📄 License

MIT © DevMarket
