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

const ALLOWED_CATEGORIES = [
  "Technology",
  "Music",
  "Sports",
  "Food",
  "Art",
  "Business",
  "Education",
  "Comedy",
];

const isValidImageUrl = (url) => {
  if (url === undefined || url === null || url === "") return true;
  if (typeof url !== "string") return false;
  const trimmed = url.trim();
  if (trimmed === "") return true;
  return (
    /^https?:\/\/.+/i.test(trimmed) ||
    /^\/uploads\/.+/i.test(trimmed) ||
    /^data:image\/.+/i.test(trimmed)
  );
};

const isValidDate = (dateStr) => {
  if (typeof dateStr !== "string") return false;
  const parsed = new Date(dateStr);
  return !isNaN(parsed.getTime());
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
      typeof title !== "string" ||
      typeof description !== "string" ||
      typeof date !== "string" ||
      typeof time !== "string" ||
      typeof location !== "string" ||
      typeof category !== "string" ||
      availableTickets === undefined ||
      availableTickets === null
    ) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const trimmedTitle = title.trim();
    const trimmedDesc = description.trim();
    const trimmedTime = time.trim();
    const trimmedLoc = location.trim();
    const trimmedCat = category.trim();

    if (!trimmedTitle || !trimmedDesc || !trimmedTime || !trimmedLoc || !trimmedCat) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    if (trimmedTitle.length > 100) {
      return res.status(400).json({ message: "Title must be 100 characters or less" });
    }

    if (trimmedDesc.length > 2000) {
      return res.status(400).json({ message: "Description must be 2000 characters or less" });
    }

    if (trimmedLoc.length > 200) {
      return res.status(400).json({ message: "Location must be 200 characters or less" });
    }

    if (!isValidDate(date)) {
      return res.status(400).json({ message: "Invalid event date" });
    }

    if (!ALLOWED_CATEGORIES.includes(trimmedCat)) {
      return res.status(400).json({ message: "Invalid event category" });
    }

    const numericPrice = Number(price);
    if (isNaN(numericPrice) || !Number.isFinite(numericPrice) || numericPrice < 0 || numericPrice > 1000000) {
      return res.status(400).json({ message: "Price must be a valid number between 0 and 1,000,000" });
    }

    const numericTickets = Number(availableTickets);
    if (isNaN(numericTickets) || !Number.isInteger(numericTickets) || numericTickets <= 0 || numericTickets > 100000) {
      return res.status(400).json({ message: "Available tickets must be a whole number between 1 and 100,000" });
    }

    if (!isValidImageUrl(image)) {
      return res.status(400).json({ message: "Invalid image URL" });
    }

    const event = await Event.create({
      title: trimmedTitle,
      description: trimmedDesc,
      date,
      time: trimmedTime,
      location: trimmedLoc,
      category: trimmedCat,
      price: numericPrice,
      availableTickets: numericTickets,
      image: typeof image === "string" ? image.trim() : "",
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

    const body = req.body || {};
    const updateData = {};

    if (body.title !== undefined) {
      if (typeof body.title !== "string" || !body.title.trim()) {
        return res.status(400).json({ message: "Title cannot be empty" });
      }
      const trimmed = body.title.trim();
      if (trimmed.length > 100) {
        return res.status(400).json({ message: "Title must be 100 characters or less" });
      }
      updateData.title = trimmed;
    }

    if (body.description !== undefined) {
      if (typeof body.description !== "string" || !body.description.trim()) {
        return res.status(400).json({ message: "Description cannot be empty" });
      }
      const trimmed = body.description.trim();
      if (trimmed.length > 2000) {
        return res.status(400).json({ message: "Description must be 2000 characters or less" });
      }
      updateData.description = trimmed;
    }

    if (body.date !== undefined) {
      if (!isValidDate(body.date)) {
        return res.status(400).json({ message: "Invalid event date" });
      }
      updateData.date = body.date;
    }

    if (body.time !== undefined) {
      if (typeof body.time !== "string" || !body.time.trim()) {
        return res.status(400).json({ message: "Time cannot be empty" });
      }
      updateData.time = body.time.trim();
    }

    if (body.location !== undefined) {
      if (typeof body.location !== "string" || !body.location.trim()) {
        return res.status(400).json({ message: "Location cannot be empty" });
      }
      const trimmed = body.location.trim();
      if (trimmed.length > 200) {
        return res.status(400).json({ message: "Location must be 200 characters or less" });
      }
      updateData.location = trimmed;
    }

    if (body.category !== undefined) {
      if (typeof body.category !== "string" || !ALLOWED_CATEGORIES.includes(body.category.trim())) {
        return res.status(400).json({ message: "Invalid event category" });
      }
      updateData.category = body.category.trim();
    }

    if (body.price !== undefined) {
      const numericPrice = Number(body.price);
      if (isNaN(numericPrice) || !Number.isFinite(numericPrice) || numericPrice < 0 || numericPrice > 1000000) {
        return res.status(400).json({ message: "Price must be a valid number between 0 and 1,000,000" });
      }
      updateData.price = numericPrice;
    }

    if (body.availableTickets !== undefined) {
      const numericTickets = Number(body.availableTickets);
      if (isNaN(numericTickets) || !Number.isInteger(numericTickets) || numericTickets < 0 || numericTickets > 100000) {
        return res.status(400).json({ message: "Available tickets must be a whole number between 0 and 100,000" });
      }
      updateData.availableTickets = numericTickets;
    }

    if (body.image !== undefined) {
      if (!isValidImageUrl(body.image)) {
        return res.status(400).json({ message: "Invalid image URL" });
      }
      updateData.image = typeof body.image === "string" ? body.image.trim() : "";
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
