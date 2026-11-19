import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000,
  },

  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
  },
  location: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  category: {
    type: String,
    required: true,
    enum: [
      "Technology",
      "Music",
      "Sports",
      "Food",
      "Art",
      "Business",
      "Education",
      "Comedy",
    ],
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
    trim: true,
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export default mongoose.model("Event", eventSchema);
