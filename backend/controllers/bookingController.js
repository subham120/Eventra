import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Event from "../models/Event.js";

const createBooking = async (req, res) => {
  try {
    const { eventId, quantity } = req.body || {};

    if (!eventId || !mongoose.isValidObjectId(eventId)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    if (quantity === undefined || quantity === null || !Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be a whole number greater than 0" });
    }

    const existingEvent = await Event.findById(eventId);
    if (!existingEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    const event = await Event.findOneAndUpdate(
      { _id: eventId, availableTickets: { $gte: quantity } },
      { $inc: { availableTickets: -quantity } },
      { returnDocument: 'after' }
    );

    if (!event) {
      return res.status(400).json({ message: "Not enough tickets available" });
    }

    const totalAmount = event.price * quantity;

    const booking = await Booking.create({
      user: req.user.userId,
      event: eventId,
      quantity,
      totalAmount,
    });

    return res.status(201).json(booking);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

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

const cancelBooking = async (req, res) => {
  try {

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (!booking.user || booking.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: "You can only cancel your own bookings" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    booking.status = "cancelled";
    await booking.save();

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

export {
  createBooking,
  getMyBookings,
  cancelBooking,
};
