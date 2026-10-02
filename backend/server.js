// Load environment variables at the very top
require("dotenv").config();

const dns = require("dns");
try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {}

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const eventRoutes = require("./routes/eventRoutes");
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

// Initialize express app
const app = express();

// Middleware: Enable Cross-Origin Resource Sharing and JSON request parsing
app.use(cors());
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.send("Eventra API is running");
});

// Mount API routes
app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);

// Catch-all 404 handler for unknown routes (returns JSON instead of Express HTML)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Validate required environment variables
const PORT = process.env.PORT || 5000;

if (!process.env.MONGODB_URI) {
  console.log("MONGODB_URI is missing in backend/.env");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.log("JWT_SECRET is missing in backend/.env");
  process.exit(1);
}

// Connect to MongoDB and start the server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
