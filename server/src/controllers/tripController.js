import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import Trip from "../models/Trip.js";


import { getTripWeather } from "../services/weatherService.js";

import {
  generateTripItinerary,
} from "../services/aiService.js";

import {
  calculateBudgetAnalysis,
} from "../services/budgetService.js";

import {
  addCoordinatesToItinerary,
} from "../services/locationService.js";
import redisClient from "../config/redis.js";




// ====================================================
// CREATE TRIP
// ====================================================
export const createTrip = async (req, res) => {
  try {
    const {
      destination,
      startDate,
      endDate,
      budget,
      travelers,
      interests,
    } = req.body;

    // Required fields validation
    if (
      !destination ||
      !startDate ||
      !endDate ||
      budget === undefined ||
      travelers === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Convert dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Validate dates
    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid start date or end date",
      });
    }

    // End date cannot be before start date
    if (end < start) {
      return res.status(400).json({
        success: false,
        message: "End date cannot be before start date",
      });
    }

    // Budget validation
    if (Number(budget) < 0) {
      return res.status(400).json({
        success: false,
        message: "Budget cannot be negative",
      });
    }

    // Travelers validation
    if (Number(travelers) < 1) {
      return res.status(400).json({
        success: false,
        message: "At least one traveler is required",
      });
    }

    // Create trip
    const trip = await Trip.create({
      user: req.user._id,
      destination,
      startDate,
      endDate,
      budget,
      travelers,
      interests: interests || [],
    });

    return res.status(201).json({
      success: true,
      message: "Trip created successfully",
      data: trip,
    });

  } catch (error) {
    console.error("Create trip error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create trip",
      error: error.message,
    });
  }
};


// ====================================================
// GET ALL TRIPS
// ====================================================
export const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: trips.length,
      data: trips,
    });

  } catch (error) {
    console.error(
      "Get trips error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch trips",
      error: error.message,
    });
  }
};


// ====================================================
// GET SINGLE TRIP
// ====================================================

export const getTripById = async (
  req,
  res
) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: trip,
    });

  } catch (error) {
    console.error(
      "Get trip error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch trip",
      error: error.message,
    });
  }
};

// ====================================================
// UPDATE TRIP
// ====================================================
export const updateTrip =
  asyncHandler(async (req, res) => {
    const {
      destination,
      startDate,
      endDate,
      budget,
      travelers,
      interests,
    } = req.body;

    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!trip) {
      throw new ApiError(
        404,
        "Trip not found"
      );
    }

    if (destination !== undefined) {
      trip.destination = destination;
    }

    if (startDate !== undefined) {
      trip.startDate = startDate;
    }

    if (endDate !== undefined) {
      trip.endDate = endDate;
    }

    if (budget !== undefined) {
      trip.budget = budget;
    }

    if (travelers !== undefined) {
      trip.travelers = travelers;
    }

    if (interests !== undefined) {
      trip.interests = interests;
    }

    trip.status = "draft";

    trip.itinerary = {
      summary: "",
      totalEstimatedCost: 0,
      days: [],
    };

    trip.budgetAnalysis = {
      calculatedActivityCost: 0,
      remainingBudget: 0,
      overBudget: false,
      overBy: 0,
      budgetUtilization: 0,
    };

    await trip.save();

    res.status(200).json({
      success: true,
      message:
        "Trip updated successfully",
      data: trip,
    });
  });
// ====================================================
// DELETE TRIP
// ====================================================

export const deleteTrip = async (
  req,
  res
) => {
  try {
    const trip =
      await Trip.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
      });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Trip deleted successfully",
    });

  } catch (error) {
    console.error(
      "Delete trip error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete trip",
      error: error.message,
    });
  }
};


// ====================================================
// GENERATE AI ITINERARY
// ====================================================

export const generateItinerary = async (
  req,
  res
) => {
  try {
    // ===================================
    // Find only logged-in user's trip
    // ===================================

    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    // ===================================
    // Calculate number of days
    // ===================================

    const startDate =
      new Date(trip.startDate);

    const endDate =
      new Date(trip.endDate);

    const differenceInTime =
      endDate.getTime() -
      startDate.getTime();

    const days =
      Math.floor(
        differenceInTime /
          (1000 * 60 * 60 * 24)
      ) + 1;

    if (
      Number.isNaN(days) ||
      days <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid trip dates",
      });
    }

    // ===================================
    // Prepare Gemini data
    // ===================================

    const tripData = {
      destination:
        trip.destination,

      days,

      budget:
        trip.budget,

      travelers:
        trip.travelers,

      interests:
        trip.interests,
    };

    console.log(
      "Data sent to Gemini:",
      tripData
    );

    // ===================================
    // Generate itinerary
    // ===================================

    let itinerary =
      await generateTripItinerary(
        tripData
      );

    // ===================================
    // Add coordinates
    // ===================================

    try {
      itinerary =
        await addCoordinatesToItinerary(
          itinerary,
          trip.destination
        );

    } catch (locationError) {
      console.error(
        "Coordinate enrichment failed:",
        locationError.message
      );
    }

    // ===================================
    // Budget
    // ===================================

    const budgetAnalysis =
      calculateBudgetAnalysis(
        trip.budget,
        itinerary
      );

    itinerary.totalEstimatedCost =
      budgetAnalysis.calculatedActivityCost;

    // ===================================
    // Save
    // ===================================

    trip.itinerary =
      itinerary;

    trip.budgetAnalysis =
      budgetAnalysis;

    trip.status =
      "generated";

    await trip.save();

    return res.status(200).json({
      success: true,
      message:
        "Itinerary generated successfully",
      data: trip,
    });

  } catch (error) {
    console.error(
      "Generate itinerary error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to generate itinerary",
      error: error.message,
    });
  }
};

// ====================================================
// GET WEATHER
// ====================================================

export const getWeather = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    const startDate = new Date(
      trip.startDate
    )
      .toISOString()
      .split("T")[0];

    const endDate = new Date(
      trip.endDate
    )
      .toISOString()
      .split("T")[0];

    /*
      Example:
      weather:goa:2026-08-25:2026-08-30
    */
    const cacheKey = `weather:${trip.destination
      .toLowerCase()
      .trim()}:${startDate}:${endDate}`;

    // =========================
    // 1. CHECK REDIS
    // =========================

    if (redisClient.isReady) {
      try {
        const cachedWeather =
          await redisClient.get(cacheKey);

        if (cachedWeather) {
          console.log(
            "Weather Cache HIT:",
            cacheKey
          );

          res.set("X-Cache", "HIT");

          return res.status(200).json({
            success: true,
            data: JSON.parse(
              cachedWeather
            ),
          });
        }

        console.log(
          "Weather Cache MISS:",
          cacheKey
        );
      } catch (redisError) {
        console.error(
          "Redis GET failed:",
          redisError.message
        );
      }
    }

    // =========================
    // 2. CALL WEATHER API
    // =========================

    const weather =
      await getTripWeather(trip);

    // =========================
    // 3. SAVE TO REDIS
    // =========================

    if (redisClient.isReady) {
      try {
        await redisClient.set(
          cacheKey,
          JSON.stringify(weather),
          {
            EX: 900,
          }
        );

        console.log(
          "Weather cached:",
          cacheKey
        );
      } catch (redisError) {
        console.error(
          "Redis SET failed:",
          redisError.message
        );
      }
    }

    res.set(
      "X-Cache",
      redisClient.isReady
        ? "MISS"
        : "BYPASS"
    );

    res.status(200).json({
      success: true,
      data: weather,
    });
  } catch (error) {
    console.error(
      "Weather error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch weather",
      error: error.message,
    });
  }
};