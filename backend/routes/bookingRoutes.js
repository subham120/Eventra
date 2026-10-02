const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createBooking,
  getMyBookings,
  cancelBooking,
} = require("../controllers/bookingController");

// All booking routes require authentication (any logged-in user can book and view their bookings)
router.post("/", authMiddleware, createBooking);
router.get("/my-bookings", authMiddleware, getMyBookings);
router.put("/:id/cancel", authMiddleware, cancelBooking);

module.exports = router;
