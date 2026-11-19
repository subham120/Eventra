import "dotenv/config";
import dns from "dns";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import eventRoutes from "./routes/eventRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch {}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const app = express();
app.set("trust proxy", 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

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
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve static uploaded files
app.use("/uploads", express.static(uploadDir));

app.use((err, req, res, next) => {
  if (err.status === 413 || err.type === "entity.too.large") {
    return res.status(413).json({ message: "Image is too large. Max size is 10MB." });
  }
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ message: "Malformed JSON payload" });
  }
  next(err);
});

app.get("/", (req, res) => {
  res.json({ message: "Eventra API is running" });
});

app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/upload", uploadRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  if (err.status === 413 || err.type === "entity.too.large") {
    return res.status(413).json({ message: "Image is too large. Max size is 10MB." });
  }
  console.error("Unhandled error:", err.message);
  return res.status(err.status || 500).json({ message: err.message || "Something went wrong" });
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
