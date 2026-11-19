# Eventra

> A modern, responsive Event Management and Ticket Booking platform built with the MERN stack (MongoDB, Express, React 19, Node.js).

[![GitHub](https://img.shields.io/badge/GitHub-subham120%2FEventra-181717?logo=github)](https://github.com/subham120/Eventra)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF.svg)](https://vite.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-38B2AC.svg)](https://tailwindcss.com/)
[![Node](https://img.shields.io/badge/Node-%3E%3D20-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5-000000.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248.svg)](https://www.mongodb.com/)

---

## 🌟 Key Features

### 🎟️ Attendee Experience
- **Smart Event Discovery:** Search events by keyword, location, or title with real-time instant debounce.
- **Dynamic Category & Price Filtering:** Filter across 8 curated categories (*Technology, Music, Sports, Food, Art, Business, Education, Comedy*) and price brackets (Free, Under ₹500, ₹500–₹1000, Above ₹1000).
- **Automated Past Event Lifecycle:** Events whose dates have passed are automatically hidden from public discovery. Expired events display clear *"Event Ended"* statuses and disable ticket booking on both frontend and backend.
- **Atomic Ticket Booking:** Concurrency-safe ticket checkout using MongoDB atomic `$inc` and `$gte` conditions to prevent race conditions or overselling.
- **My Bookings Dashboard:** View confirmed passes, order dates, total amounts paid, and cancellation options with instant ticket restoration for active upcoming events.

### 💼 Organizer Suite
- **Dedicated Organizer Dashboard:** Real-time analytics tracking total events hosted, tickets available, sales rate, and potential earnings.
- **Full Event CRUD:** Create, edit, and delete events with date pickers enforcing future-only scheduling.
- **Dual Image Upload:** Support for both direct image file uploads (with client-side canvas compression) and external image URLs (e.g., Unsplash).
- **Archival & Record Preservation:** Past events remain accessible to organizers with a distinct *"Past Event"* badge and *"Closed"* status for auditing and management.

### 🛡️ Security & Architecture
- **JWT Authentication:** Stateless, signed JSON Web Tokens for authentication with `bcryptjs` password hashing (salt rounds: 10).
- **Role-Based Access Control (RBAC):** Strict separation between standard attendees (`user`) and event creators (`organizer`).
- **Input Sanitization & Rate Limiting:** Protected endpoints with `helmet`, CORS whitelist policies, and express rate limiting.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite 8, Tailwind CSS v4, React Router v7, Axios, Lucide React |
| **Backend** | Node.js (>=20), Express 5, Mongoose 9, JWT, bcryptjs, cors, dotenv, helmet |
| **Database** | MongoDB Atlas (Cloud) / Local MongoDB |
| **Storage** | Local disk storage (`/backend/uploads`) with static Express serving & remote image support |

---

## 📁 Project Structure

```text
Eventra/
├── backend/
│   ├── controllers/      # Route controllers (auth, events, bookings)
│   ├── middleware/       # JWT auth & role validation middleware
│   ├── models/           # Mongoose schemas (User, Event, Booking)
│   ├── routes/           # Express routes (authRoutes, eventRoutes, bookingRoutes, uploadRoutes)
│   ├── uploads/          # Uploaded event banner assets
│   ├── .env.example      # Backend environment template
│   ├── server.js         # Express app entry & database connection
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── assets/       # Static branding assets
│   │   ├── components/   # Reusable UI components (Navbar, Footer, EventCard, EventForm, etc.)
│   │   ├── data/         # Static categories definition
│   │   ├── pages/        # Views (Home, Events, EventDetails, Booking, MyBookings, Login, Register, Organizer)
│   │   └── services/     # Axios client (api.js) & auth helpers (auth.js)
│   ├── .env.example      # Frontend environment template
│   ├── vercel.json       # SPA client-side route rewrite rules
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v20 or higher (`node -v`)
- **MongoDB**: Local MongoDB instance or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

---

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
```

Configure your `backend/.env` file:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/Eventra?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
FRONTEND_URL=http://localhost:5173
```

Start the backend:
```bash
npm run dev
# Server running on http://localhost:5000
```

---

### 3. Frontend Setup
```bash
cd ../frontend
npm install
cp .env.example .env
```

Configure your `frontend/.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev
# Application running on http://localhost:5173
```

---

## 📡 API Endpoints Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user or organizer | Public |
| `POST` | `/api/auth/login` | Authenticate user & return JWT token | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Logged-in |

### Events (`/api/events`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/events` | List all upcoming events | Public |
| `GET` | `/api/events/:id` | Get single event details | Public |
| `GET` | `/api/events/my-events` | List events created by authenticated organizer | Organizer |
| `POST` | `/api/events` | Create a new event | Organizer |
| `PUT` | `/api/events/:id` | Update an existing event | Organizer (Owner) |
| `DELETE`| `/api/events/:id` | Delete an event | Organizer (Owner) |

### Bookings (`/api/bookings`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/bookings` | Book tickets for an upcoming event (atomic deduction) | Logged-in |
| `GET` | `/api/bookings/my-bookings` | Retrieve user's ticket booking history | Logged-in |
| `PUT` | `/api/bookings/:id/cancel` | Cancel booking & release tickets back to inventory | Attendee (Owner) |
| `GET` | `/api/bookings/organizer` | Fetch organizer sales metrics & ticket analytics | Organizer |

### Uploads (`/api/upload`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/upload` | Upload & store event banner image | Organizer |

---

## 🚢 Deployment Guide

### Backend (Render)
1. Create a new **Web Service** on [Render](https://render.com/) linked to your GitHub repository.
2. Set **Root Directory** to `backend`.
3. Set **Build Command** to `npm install` and **Start Command** to `npm start`.
4. Add Environment Variables:
   - `PORT`: `5000`
   - `MONGODB_URI`: Your MongoDB Atlas URI
   - `JWT_SECRET`: A secure random secret string
   - `FRONTEND_URL`: Your deployed frontend URL (e.g., `https://eventra.vercel.app`)

### Frontend (Vercel)
1. Import your repository into [Vercel](https://vercel.com/).
2. Set **Root Directory** to `frontend`.
3. Framework Preset: `Vite`.
4. Environment Variables:
   - `VITE_API_URL`: Your backend API URL (e.g., `https://eventra-api.onrender.com/api`)
5. Click **Deploy**. *(The included `frontend/vercel.json` automatically handles client-side routing rewrites).*

---

## 📄 License
This project is open-source and available under the [ISC License](LICENSE).
