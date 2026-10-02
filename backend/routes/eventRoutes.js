const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const requireOrganizer = roleMiddleware("organizer");

const {
  getEvents,
  getEventById,
  createEvent,
  getMyEvents,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

// IMPORTANT: /my-events MUST be declared before /:id so Express does not treat "my-events" as an ID parameter
router.get("/my-events", authMiddleware, requireOrganizer, getMyEvents);

// Public event routes
router.get("/", getEvents);
router.get("/:id", getEventById);

// Organizer-protected event routes (require authentication + organizer role)
router.post("/", authMiddleware, requireOrganizer, createEvent);
router.put("/:id", authMiddleware, requireOrganizer, updateEvent);
router.delete("/:id", authMiddleware, requireOrganizer, deleteEvent);

module.exports = router;
