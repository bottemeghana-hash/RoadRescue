const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    if (
      !process.env.ADMIN_EMAIL ||
      !process.env.ADMIN_PASSWORD_HASH ||
      !process.env.JWT_SECRET ||
      process.env.ADMIN_PASSWORD_HASH === "temporary_placeholder" ||
      process.env.JWT_SECRET === "replace_this_with_a_long_random_secret"
    ) {
      return res.status(500).json({
        success: false,
        message: "Admin login configuration is incomplete.",
      });
    }

    const emailMatches =
      email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase();

    const passwordMatches = await bcrypt.compare(
      password,
      process.env.ADMIN_PASSWORD_HASH
    );

    if (!emailMatches || !passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      { role: "admin", email: process.env.ADMIN_EMAIL },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.json({
      success: true,
      message: "Admin login successful.",
      token,
    });
  } catch (error) {
    console.error("Admin login error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to log in right now.",
    });
  }
});

module.exports = router;