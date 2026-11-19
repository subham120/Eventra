import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import crypto from "crypto";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "..", "uploads");

const requireOrganizer = roleMiddleware("organizer");

const MIME_EXTENSIONS = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
  "image/bmp": ".bmp",
};

router.post("/", authMiddleware, requireOrganizer, async (req, res) => {
  try {
    const { image } = req.body || {};

    if (!image || typeof image !== "string") {
      return res.status(400).json({ message: "No image data provided" });
    }

    const matches = image.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/s);
    if (!matches) {
      return res.status(400).json({ message: "Invalid image format. Expected base64 data URL." });
    }

    const mimeType = matches[1].toLowerCase();
    const base64Data = matches[2].replace(/\s/g, "");

    const ext = MIME_EXTENSIONS[mimeType] || ".jpg";

    const buffer = Buffer.from(base64Data, "base64");

    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (buffer.length > MAX_SIZE) {
      return res.status(400).json({ message: "Image size exceeds 10MB limit" });
    }

    await fs.mkdir(uploadDir, { recursive: true });

    const randomName = `${crypto.randomUUID()}${ext}`;
    const filePath = path.join(uploadDir, randomName);

    await fs.writeFile(filePath, buffer);

    const protocol = req.protocol;
    const host = req.get("host");
    const imageUrl = `${protocol}://${host}/uploads/${randomName}`;

    return res.status(200).json({
      url: imageUrl,
      path: `/uploads/${randomName}`,
      filename: randomName,
      size: buffer.length,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ message: error.message || "Failed to upload image" });
  }
});

export default router;
