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

    const todayStr = new Date().toISOString().split("T")[0];
    if (existingEvent.date && existingEvent.date < todayStr) {
      return res.status(400).json({ message: "This event has already passed and cannot be booked" });
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

    const eventDoc = await Event.findById(booking.event);
    const todayStr = new Date().toISOString().split("T")[0];
    if (eventDoc && eventDoc.date && eventDoc.date < todayStr) {
      return res.status(400).json({ message: "Cannot cancel booking for an event that has already passed" });
    }

    booking.status = "cancelled";
    await booking.save();

    await Event.findByIdAndUpdate(booking.event, {
      $inc: { availableTickets: booking.quantity },
    });

    return res.status(200).json(booking);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const getOrganizerBookings = async (req, res) => {
  try {
    const myEvents = await Event.find({ organizer: req.user.userId }).select(
      "_id title price availableTickets date location"
    );
    const eventIds = myEvents.map((e) => e._id);

    const bookings = await Booking.find({ event: { $in: eventIds } })
      .populate("user", "name email")
      .populate("event", "title price date location")
      .sort({ createdAt: -1 });

    let totalIncome = 0;
    let totalTicketsSold = 0;
    const eventSalesMap = {};

    myEvents.forEach((ev) => {
      eventSalesMap[ev._id.toString()] = {
        sold: 0,
        revenue: 0,
      };
    });

    bookings.forEach((b) => {
      if (b.status === "confirmed") {
        totalIncome += b.totalAmount || 0;
        totalTicketsSold += b.quantity || 0;

        const evId = b.event?._id?.toString() || b.event?.toString();
        if (evId && eventSalesMap[evId]) {
          eventSalesMap[evId].sold += b.quantity || 0;
          eventSalesMap[evId].revenue += b.totalAmount || 0;
        }
      }
    });

    return res.status(200).json({
      totalIncome,
      totalTicketsSold,
      totalBookings: bookings.length,
      bookings,
      eventSalesMap,
    });
  } catch (error) {
    console.error("Organizer bookings error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export {
  createBooking,
  getMyBookings,
  cancelBooking,
  getOrganizerBookings,
};
