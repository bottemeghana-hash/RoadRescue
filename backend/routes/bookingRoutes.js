const express = require("express");
const router = express.Router();

const Booking = require("../models/Booking");
const authMiddleware = require("../middleware/authMiddleware");

// Allowed booking statuses
const STATUSES = [
  "Pending",
  "Accepted",
  "In Progress",
  "Completed",
  "Cancelled",
];

// ============================================
// 1. CUSTOMER: Create a new booking
// No admin login required
// POST /api/bookings
// ============================================
router.post("/", async (req, res) => {
  try {
    const {
      customerName,
      phone,
      vehicleType,
      serviceRequired,
      location,
      description,
    } = req.body;

    const booking = await Booking.create({
      customerName,
      phone,
      vehicleType,
      serviceRequired,
      location,
      description,
    });

    return res.status(201).json({
      success: true,
      message: "Roadside assistance booked successfully!",
      booking,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Create booking error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to create booking.",
    });
  }
});

// ============================================
// 2. ADMIN: View all bookings
// Login required
// GET /api/bookings
// ============================================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get bookings error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve bookings.",
    });
  }
});

// ============================================
// 3. ADMIN: Update a booking's status
// Login required
// PATCH /api/bookings/:id/status
// ============================================
router.patch("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate the requested status
    if (!STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status.",
        allowedStatuses: STATUSES,
      });
    }

    // Find the booking
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    // Update the status
    booking.status = status;
    await booking.save();

    return res.status(200).json({
      success: true,
      message: "Booking status updated successfully.",
      booking,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID.",
      });
    }

    console.error("Update booking status error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to update booking status.",
    });
  }
});

module.exports = router;