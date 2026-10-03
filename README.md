# Eventra

> Modern Event Management and Ticket Booking System built with the MERN stack.

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF.svg)](https://vite.dev/)
[![Node](https://img.shields.io/badge/Node-%3E%3D20-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248.svg)](https://www.mongodb.com/)

**Live Demo:** _[Add URL after deployment]_

---

## Features

- **Event Discovery & Filtering:** Browse upcoming events with real-time text search, category tabs (Technology, Music, Sports, Food, Art, Business, Education, Comedy), and price filters.
- **Authentication & Roles:** JWT authentication with secure password hashing (`bcryptjs`). Role-based access control separates regular attendees (`user`) from event organizers (`organizer`).
- **Atomic Ticket Booking:** Concurrency-safe ticket reservation preventing overselling via MongoDB atomic operations (`$gte` and `$inc`).
- **Booking Management:** Attendees can view their booking history under **My Bookings** and cancel reservations with instant ticket restoration.
- **Organizer Dashboard:** Organizers can create, edit, and delete events, track remaining ticket inventories, and review overall statistics.
- **Responsive UI:** Clean, modern interface designed with Tailwind CSS, Lucide icons, responsive navigation, and empty/error states.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite 8, Tailwind CSS v4, React Router v7, Axios, Lucide React |
| **Backend** | Node.js (>=20), Express 5, Mongoose 9, JWT, bcryptjs, cors, dotenv |
| **Database** | MongoDB (Local or MongoDB Atlas) |

---

## Project Structure

```text
Eventra/
├── backend/
│   ├── controllers/      # Route controllers (auth, events, bookings)
│   ├── middleware/       # JWT auth & role validation middleware
│   ├── models/           # Mongoose schemas (User, Event, Booking)
│   ├── routes/           # Express route definitions
│   ├── .env.example      # Backend environment template
│   ├── seed.js           # Development mock data seeder
│   ├── server.js         # Express app entry & database connection
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── assets/       # Static branding assets
│   │   ├── components/   # Reusable UI components (Navbar, Footer, Cards)
│   │   ├── pages/        # Views (Home, Events, Booking, Organizer)
│   │   └── services/     # Axios client (api.js) & auth helpers (auth.js)
│   ├── .env.example      # Frontend environment template
│   ├── vercel.json       # SPA client-side route rewrite rule
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## Local Setup

### 1. Prerequisites
- **Node.js**: v20 or higher (`node -v`)
- **MongoDB**: Local MongoDB instance or free MongoDB Atlas cluster

### 2. Clone and Setup Backend
```bash
cd backend
npm install
cp .env.example .env
```
Fill in `backend/.env`:
| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `PORT` | Backend server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/eventra` |
| `JWT_SECRET` | Secret key for signing JWTs | `your_long_random_secret_here` |
| `FRONTEND_URL` | Allowed client origin for CORS | `http://localhost:5173` |

### 3. Setup Frontend
```bash
cd ../frontend
npm install
cp .env.example .env
```
Fill in `frontend/.env`:
| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

---

## Run Commands

| Task | Backend Command (`cd backend`) | Frontend Command (`cd frontend`) |
| :--- | :--- | :--- |
| **Development** | `npm run dev` (runs nodemon) | `npm run dev` (runs Vite dev server) |
| **Production Start** | `npm start` (runs node server.js) | `npm run preview` (previews built dist) |
| **Build** | _N/A_ | `npm run build` (outputs to `dist/`) |
| **Lint** | `npm run lint` (eslint) | `npm run lint` (eslint) |
| **Seed Dev DB** | `npm run seed` (local dev only) | _N/A_ |

---

## API Endpoints

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | API Health Check | Public |
| `POST` | `/api/auth/register` | Register new user or organizer | Public |
| `POST` | `/api/auth/login` | Authenticate user & return JWT | Public |
| `GET` | `/api/auth/me` | Fetch authenticated profile | Logged-in |
| `GET` | `/api/events` | List all events (search/filter/page) | Public |
| `GET` | `/api/events/:id` | Get single event details | Public |
| `GET` | `/api/events/my-events` | List events created by organizer | Organizer |
| `POST` | `/api/events` | Create new event | Organizer |
| `PUT` | `/api/events/:id` | Update existing event | Organizer (Owner) |
| `DELETE`| `/api/events/:id` | Delete event | Organizer (Owner) |
| `POST` | `/api/bookings` | Book tickets for an event | Attendee (`user`) |
| `GET` | `/api/bookings/my-bookings` | List user's ticket bookings | Attendee (`user`) |
| `PUT` | `/api/bookings/:id/cancel` | Cancel booking & restore tickets | Attendee (Owner) |

---

## Deployment Notes

### 1. Database (MongoDB Atlas)
- Create a free M0 cluster on MongoDB Atlas.
- In **Network Access**, add `0.0.0.0/0` (Allow Access from Anywhere) so Render can connect.
- In **Database Access**, create a user with read/write privileges.
- Obtain the connection URI: `mongodb+srv://<user>:<password>@cluster.mongodb.net/eventra?retryWrites=true&w=majority`.

### 2. Backend (Render)
- Create a new **Web Service** on Render connected to your Git repository.
- **Root Directory:** `backend`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Environment Variables:**
  - `PORT`: `5000` (or leave default, Render sets `PORT` automatically)
  - `MONGODB_URI`: Atlas connection string
  - `JWT_SECRET`: A secure, random string
  - `FRONTEND_URL`: URL of your deployed Vercel frontend (e.g., `https://eventra.vercel.app`)
- **Note on Free Tier:** Render spins down free web services after 15 minutes of inactivity. The first request after idle can take ~50 seconds to wake up (cold start).

### 3. Frontend (Vercel)
- Import your Git repository into Vercel.
- **Root Directory:** `frontend`
- **Framework Preset:** `Vite`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment Variables:**
  - `VITE_API_URL`: Backend API URL (e.g., `https://eventra-api.onrender.com/api`)
- **Important:** Vite environment variables (`VITE_*`) are embedded at **build time**. If you change your backend URL in Vercel settings, trigger a **Redeploy** to apply the new URL.
- **Client Routing:** [`frontend/vercel.json`](file:///d:/project/Eventra/frontend/vercel.json) rewrites all incoming paths to `/index.html` to enable client-side React Router refreshing.

---

## Known Limitations

- **Simulated Checkout:** Ticket booking simulates checkout and decrements seat inventory directly without an external payment gateway (e.g., Stripe/Razorpay).
- **Notifications:** Confirmations and cancellations are tracked in the database and dashboard without external email (SMTP) or SMS integrations.
- **Image URLs:** Event images use remote image URLs (e.g. Unsplash, Picsum) rather than a multipart file upload storage service (e.g., S3/Cloudinary).
