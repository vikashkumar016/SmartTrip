import express from "express";

import {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  generateItinerary,
  getWeather,
} from "../controllers/tripController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

import {
  aiGenerateRateLimiter,
} from "../middleware/rateLimitMiddleware.js";

import {
  validateBody,
  validateParams,
} from "../middleware/validationMiddleware.js";

import {
  createTripSchema,
  updateTripSchema,
  tripIdParamSchema,
} from "../validations/tripValidation.js";

const router = express.Router();

// All trip routes require authentication
router.use(protect);

// Create trip
router.post(
  "/",
  validateBody(createTripSchema),
  createTrip
);

// Get logged-in user's trips
// IMPORTANT:
// Is route mein :id nahi hai,
// isliye validateParams(tripIdParamSchema) nahi lagega.
router.get(
  "/",
  getTrips
);

// Weather
router.get(
  "/:id/weather",
  validateParams(tripIdParamSchema),
  getWeather
);

// AI itinerary generation + Redis rate limiter
router.post(
  "/:id/generate",
  validateParams(tripIdParamSchema),
  aiGenerateRateLimiter,
  generateItinerary
);

// Get single trip
router.get(
  "/:id",
  validateParams(tripIdParamSchema),
  getTripById
);

// Update trip
router.patch(
  "/:id",
  validateParams(tripIdParamSchema),
  validateBody(updateTripSchema),
  updateTrip
);

// Delete trip
router.delete(
  "/:id",
  validateParams(tripIdParamSchema),
  deleteTrip
);

export default router;