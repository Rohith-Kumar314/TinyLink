# 🔗 TinyLink – URL Shortener (Node.js + Express + Neon Postgres)

TinyLink is a lightweight Bit.ly-style URL shortener.  
Users can create custom short links, view click statistics, delete links, and track usage — all with a clean UI and fast backend.

This project is built according to the **TinyLink Take-Home Assignment** specification.

---

## 🚀 Features

### ✔ Core Functionality
- Shorten long URLs
- Optional **custom short codes** (`[A-Za-z0-9]{6,8}`)
- Automatic short code generation
- 302 redirect to the target URL
- Click tracking
- Last-click time tracking
- Delete links
- Search links by code or URL
- Stats page for individual links

### ✔ Pages
| Page | Route | Description |
|------|--------|-------------|
| Dashboard | `/` | Create, list, search, delete links |
| Stats | `/code/:code` | View details of a single short code |
| Redirect | `/:code` | 302 redirect to the long URL |
| Health Check | `/healthz` | System info for monitoring |

### ✔ API Endpoints
| Method | Route | Description |
|--------|--------|-------------|
| POST | `/api/links` | Create a short link |
| GET | `/api/links` | List all links |
| GET | `/api/links/:code` | Get stats for a short link |
| DELETE | `/api/links/:code` | Delete a short link |

---

## 🛠 Tech Stack

- **Node.js + Express**
- **Neon (PostgreSQL serverless database)**
- **EJS** template engine
- **TailwindCSS / Custom CSS** (depending on your UI)
- **Render / Railway / Vercel** for hosting (choose any)

---

## 📂 Project Structure
── controllers/
│   └── links.js
├── db.js
├── public/
│   └── styles.css
├── routes/
│   └── linkRoutes.js
├── views/
│   └── layout.ejs   
│   ├── partials/
│   │   └── footer.ejs
│   │   └── navbar.ejs
│   ├── pages/
│   │   ├── dashboard.ejs
│   │   ├── stats.ejs
│   │   └── error.ejs
│   │   ├── notfound.ejs
│   │   ├── health.ejs
├── .env
└── index.js

## 🗄 Database Schema

Make sure your table is created as:

```sql
CREATE TABLE IF NOT EXISTS links (
  id SERIAL PRIMARY KEY,
  code VARCHAR(8) UNIQUE NOT NULL,
  url TEXT NOT NULL,
  clicks INTEGER DEFAULT 0,
  lastclicked TIMESTAMP
);