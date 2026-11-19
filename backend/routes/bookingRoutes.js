import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import {
  createBooking,
  getMyBookings,
  cancelBooking,
  getOrganizerBookings,
} from "../controllers/bookingController.js";

const router = express.Router();
const requireOrganizer = roleMiddleware("organizer");

router.post("/", authMiddleware, createBooking);
router.get("/my-bookings", authMiddleware, getMyBookings);
router.get("/organizer", authMiddleware, requireOrganizer, getOrganizerBookings);
router.put("/:id/cancel", authMiddleware, cancelBooking);

export default router;
