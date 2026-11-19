import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import crypto from "crypto";
import rateLimit from "express-rate-limit";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "..", "uploads");

const requireOrganizer = roleMiddleware("organizer");

// Rate limit: 30 uploads per 15 minutes per IP
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: 429,
  message: { message: "Too many upload requests. Please try again later." },
});

// Strictly allow safe raster image MIME types (SVG removed to prevent stored XSS attacks)
const ALLOWED_MIME_TYPES = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

// Validate binary file signatures (magic bytes) to prevent extension spoofing
const isValidMagicBytes = (buffer, mimeType) => {
  if (!buffer || buffer.length < 12) return false;

  // JPEG: FF D8 FF
  if (mimeType.includes("jpeg") || mimeType.includes("jpg")) {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  // PNG: 89 50 4E 47
  if (mimeType === "image/png") {
    return buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
  }
  // GIF: GIF87a or GIF89a
  if (mimeType === "image/gif") {
    return buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x38;
  }
  // WebP: RIFF .... WEBP
  if (mimeType === "image/webp") {
    const isRiff = buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46;
    const isWebp = buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50;
    return isRiff && isWebp;
  }
  return true;
};

router.post("/", authMiddleware, requireOrganizer, uploadLimiter, async (req, res) => {
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

    const ext = ALLOWED_MIME_TYPES[mimeType];
    if (!ext) {
      return res.status(400).json({
        message: "Unsupported image format. Only JPEG, PNG, WebP, and GIF images are permitted.",
      });
    }

    const buffer = Buffer.from(base64Data, "base64");

    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (buffer.length > MAX_SIZE) {
      return res.status(400).json({ message: "Image size exceeds 10MB limit" });
    }

    if (!isValidMagicBytes(buffer, mimeType)) {
      return res.status(400).json({ message: "File contents do not match the specified image type." });
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
