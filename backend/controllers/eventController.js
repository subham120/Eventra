import mongoose from "mongoose";
import Event from "../models/Event.js";

const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("organizer", "name email")
      .sort({ date: 1 });
    return res.status(200).json(events);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    console.log(error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const getEventById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const event = await Event.findById(req.params.id).populate("organizer", "name email");
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.status(200).json(event);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    console.log(error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      time,
      location,
      category,
      price = 0,
      availableTickets,
      image,
    } = req.body || {};

    if (
      !title ||
      !description ||
      !date ||
      !time ||
      !location ||
      !category ||
      availableTickets === undefined ||
      availableTickets === null
    ) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const numericPrice = Number(price);
    const numericTickets = Number(availableTickets);

    if (isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({ message: "Price cannot be negative" });
    }

    if (isNaN(numericTickets) || numericTickets <= 0) {
      return res.status(400).json({ message: "Available tickets must be greater than 0" });
    }

    const event = await Event.create({
      title: title.trim(),
      description: description.trim(),
      date,
      time: time.trim(),
      location: location.trim(),
      category: category.trim(),
      price: numericPrice,
      availableTickets: numericTickets,
      image,
      organizer: req.user.userId,
    });

    return res.status(201).json(event);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    console.log(error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.userId }).sort({ date: 1 });
    return res.status(200).json(events);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const updateEvent = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (!event.organizer || event.organizer.toString() !== req.user.userId) {
      return res.status(403).json({ message: "You can only edit your own events" });
    }

    const updateData = { ...(req.body || {}) };
    delete updateData.organizer;

    if (req.body?.price !== undefined) {
      const numericPrice = Number(req.body.price);
      if (isNaN(numericPrice) || numericPrice < 0) {
        return res.status(400).json({ message: "Price cannot be negative" });
      }
      updateData.price = numericPrice;
    }

    if (req.body?.availableTickets !== undefined) {
      const numericTickets = Number(req.body.availableTickets);
      if (isNaN(numericTickets) || numericTickets < 0) {
        return res.status(400).json({ message: "Available tickets cannot be negative" });
      }
      updateData.availableTickets = numericTickets;
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, updateData, {
      returnDocument: 'after',
      runValidators: true,
    });

    return res.status(200).json(updatedEvent);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    console.log(error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const deleteEvent = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (!event.organizer || event.organizer.toString() !== req.user.userId) {
      return res.status(403).json({ message: "You can only delete your own events" });
    }

    await Event.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    console.log(error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export {
  getEvents,
  getEventById,
  createEvent,
  getMyEvents,
  updateEvent,
  deleteEvent,
};
