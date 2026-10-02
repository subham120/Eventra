const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Event = require("../models/Event");

// Create a new booking for an event
const createBooking = async (req, res) => {
  try {
    const { eventId, quantity } = req.body || {};

    // Validate event ID format
    if (!eventId || !mongoose.isValidObjectId(eventId)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    // Validate quantity: must be an integer greater than 0
    if (quantity === undefined || quantity === null || !Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be a whole number greater than 0" });
    }

    // Check if the event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check ticket availability
    if (event.availableTickets < quantity) {
      return res.status(400).json({ message: `Only ${event.availableTickets} tickets available` });
    }

    // Calculate total price server-side; user ID comes strictly from the verified JWT token
    const totalAmount = event.price * quantity;

    const booking = await Booking.create({
      user: req.user.userId,
      event: eventId,
      quantity,
      totalAmount,
    });

    // Deduct booked tickets from event and save
    event.availableTickets -= quantity;
    await event.save();

    return res.status(201).json(booking);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get all bookings made by the currently authenticated user
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.userId })
      .sort({ createdAt: -1 })
      .populate("event");

    return res.status(200).json(bookings);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

// Cancel an existing booking and restore event ticket availability
const cancelBooking = async (req, res) => {
  try {
    // Validate booking ID format
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Ownership check: User can only cancel their own bookings
    if (!booking.user || booking.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: "You can only cancel your own bookings" });
    }

    // Status check: Cannot cancel an already cancelled booking
    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    // Mark booking as cancelled
    booking.status = "cancelled";
    await booking.save();

    // Restore tickets to event if the event still exists
    const event = await Event.findById(booking.event);
    if (event) {
      event.availableTickets += booking.quantity;
      await event.save();
    }

    return res.status(200).json(booking);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking,
};
