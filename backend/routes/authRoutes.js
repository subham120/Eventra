import express from "express";
import rateLimit from "express-rate-limit";
import { register, login, getMe } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

const isRateLimitDisabled = () => process.env.DISABLE_RATE_LIMIT === "true";

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  skipSuccessfulRequests: true,
  skip: isRateLimitDisabled,
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: 429,
  message: { message: "Too many attempts. Please try again later." },
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 50,
  skip: isRateLimitDisabled,
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: 429,
  message: { message: "Too many attempts. Please try again later." },
});

router.post("/register", registerLimiter, register);
router.post("/login", loginLimiter, login);
router.get("/me", authMiddleware, getMe);

export default router;
