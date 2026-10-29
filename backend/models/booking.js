const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },

    vehicleType: {
      type: String,
      required: [true, "Vehicle type is required"],
      enum: ["Car", "Bike"],
    },

    serviceRequired: {
      type: String,
      required: [true, "Please select a service"],
      enum: [
        "Breakdown Assistance",
        "Battery Jump-Start",
        "Flat Tyre Repair",
        "Fuel Delivery",
        "Towing Service",
        "Engine Repair",
        "Other",
      ],
    },

    location: {
      type: String,
      required: [true, "Breakdown location is required"],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["Pending", "Accepted", "In Progress", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
