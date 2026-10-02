const mongoose = require("mongoose");

// Mongoose schema definition for Event documents
const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  // Date format is stored as a string in YYYY-MM-DD format (e.g., "2026-10-18")
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    default: 0,
    min: 0,
  },
  availableTickets: {
    type: Number,
    required: true,
    min: 0,
  },
  image: {
    type: String,
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

// Export Event model
module.exports = mongoose.model("Event", eventSchema);
