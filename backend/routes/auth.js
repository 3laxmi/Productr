const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// LOGIN ROUTE (DEMO OTP MODE)
router.post("/login", async (req, res) => {
  console.log("Login request received:", req.body);

  try {
    const { emailOrPhone } = req.body;

    if (!emailOrPhone) {
      return res.status(400).json({ message: "Email or phone number is required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!emailRegex.test(emailOrPhone) && !phoneRegex.test(emailOrPhone)) {
      return res.status(400).json({ message: "Invalid email or phone number format" });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    let user = await User.findOne({ emailOrPhone });

    if (user) {
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      user.isVerified = false;
    } else {
      user = new User({
        emailOrPhone,
        otp,
        otpExpiry,
        isVerified: false,
      });
    }

    await user.save();

    console.log("Generated OTP (Demo Mode):", otp);

    return res.json({
      message: "OTP generated successfully (Demo Mode)",
      userId: user._id,
      otp: otp,
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// VERIFY OTP ROUTE
router.post("/verify-otp", async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({ message: "User ID and OTP are required" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (new Date() > user.otpExpiry) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "OTP verified successfully",
      token,
      user: {
        id: user._id,
        emailOrPhone: user.emailOrPhone,
      },
    });

  } catch (error) {
    console.error("OTP verification error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// RESEND OTP ROUTE (DEMO MODE)
router.post("/resend-otp", async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    console.log("Resent OTP (Demo Mode):", otp);

    return res.json({
      message: "OTP resent successfully (Demo Mode)",
      otp: otp,
    });

  } catch (error) {
    console.error("Resend OTP error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
