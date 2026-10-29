const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const bookingRoutes = require("./routes/bookingRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Homepage
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the RoadRescue API!",
    status: "Backend server is running",
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "RoadRescue backend is healthy",
  });
});

// Authentication routes
app.use("/api/auth", authRoutes);

// Booking routes
app.use("/api/bookings", bookingRoutes);

// Start server after database connection
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`RoadRescue server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error.message);
    process.exit(1);
  }
};

startServer();