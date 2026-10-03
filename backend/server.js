import "dotenv/config";
import dns from "dns";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import eventRoutes from "./routes/eventRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch {}

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL.replace(/\/+$/, ""));
}

app.use(
  cors({
    origin: (origin, callback) => {

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Eventra API is running" });
});

app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;

if (!process.env.MONGODB_URI) {
  console.log("MONGODB_URI is missing in backend/.env");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.log("JWT_SECRET is missing in backend/.env");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  });
