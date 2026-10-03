import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import {
  getEvents,
  getEventById,
  createEvent,
  getMyEvents,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";

const router = express.Router();
const requireOrganizer = roleMiddleware("organizer");

router.get("/my-events", authMiddleware, requireOrganizer, getMyEvents);

router.get("/", getEvents);
router.get("/:id", getEventById);

router.post("/", authMiddleware, requireOrganizer, createEvent);
router.put("/:id", authMiddleware, requireOrganizer, updateEvent);
router.delete("/:id", authMiddleware, requireOrganizer, deleteEvent);

export default router;
