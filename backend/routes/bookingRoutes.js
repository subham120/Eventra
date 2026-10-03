import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createBooking,
  getMyBookings,
  cancelBooking,
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", authMiddleware, createBooking);
router.get("/my-bookings", authMiddleware, getMyBookings);
router.put("/:id/cancel", authMiddleware, cancelBooking);

export default router;
