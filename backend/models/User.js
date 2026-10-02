const mongoose = require("mongoose");

// Mongoose schema definition for User documents
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // Note: This stores the bcrypt password hash, so no minlength validation is added here
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "organizer", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Export User model
module.exports = mongoose.model("User", userSchema);
