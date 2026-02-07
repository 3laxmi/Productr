// const express = require('express');
// const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');
// const User = require('../models/User');

// const router = express.Router();

// const generateOTP = () => {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// };

// // const transporter = nodemailer.createTransport({
// //   host: "smtp.gmail.com",
// //   port: 587,
// //   secure: false,
// //   auth: {
// //     user: process.env.EMAIL_USER,
// //     pass: process.env.EMAIL_PASS,
// //   },
// // });

// const transporter = nodemailer.createTransport({
//   host: "smtp-relay.brevo.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.BREVO_USER,
//     pass: process.env.BREVO_PASS,
//   },
// });



// router.post('/login', async (req, res) => {
//   console.log('Login request received:', req.body);
//   try {
//     const { emailOrPhone } = req.body;

//     if (!emailOrPhone) {
//       return res.status(400).json({ message: 'Email or phone number is required' });
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     const phoneRegex = /^\d{10}$/;
    
//     if (!emailRegex.test(emailOrPhone) && !phoneRegex.test(emailOrPhone)) {
//       return res.status(400).json({ message: 'Invalid email or phone number format' });
//     }

//     const otp = generateOTP();
//     const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); 

//     let user = await User.findOne({ emailOrPhone });
    
//     if (user) {
//       user.otp = otp;
//       user.otpExpiry = otpExpiry;
//       user.isVerified = false;
//     } else {
//       user = new User({
//         emailOrPhone,
//         otp,
//         otpExpiry,
//         isVerified: false
//       });
//     }

//     await user.save();

//     if (emailRegex.test(emailOrPhone)) {
//       const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: emailOrPhone,
//         subject: 'Your OTP for Product Account',
//         text: `Your OTP is: ${otp}. It will expire in 10 minutes.`
//       };

//       try {
//         await transporter.sendMail(mailOptions);
//       } catch (emailError) {
//         console.log('Email sending failed:', emailError);
     
//       }
//     }

//     res.json({ 
//       message: 'OTP sent successfully',
//       userId: user._id 
//     });

//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// router.post('/verify-otp', async (req, res) => {
//   try {
//     const { userId, otp } = req.body;

//     if (!userId || !otp) {
//       return res.status(400).json({ message: 'User ID and OTP are required' });
//     }

//     const user = await User.findById(userId);
    
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     if (user.otp !== otp) {
//       return res.status(400).json({ message: 'Invalid OTP' });
//     }

//     if (new Date() > user.otpExpiry) {
//       return res.status(400).json({ message: 'OTP has expired' });
//     }

//     user.isVerified = true;
//     user.otp = null;
//     user.otpExpiry = null;
//     await user.save();

//     const token = jwt.sign(
//       { userId: user._id },
//       process.env.JWT_SECRET,
//       { expiresIn: '7d' }
//     );

//     res.json({
//       message: 'OTP verified successfully',
//       token,
//       user: {
//         id: user._id,
//         emailOrPhone: user.emailOrPhone
//       }
//     });

//   } catch (error) {
//     console.error('OTP verification error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// router.post('/resend-otp', async (req, res) => {
//   try {
//     const { userId } = req.body;

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const otp = generateOTP();
//     const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

//     user.otp = otp;
//     user.otpExpiry = otpExpiry;
//     await user.save();

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (emailRegex.test(user.emailOrPhone)) {
//       const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: user.emailOrPhone,
//         subject: 'Your New OTP for Product Account',
//         text: `Your new OTP is: ${otp}. It will expire in 10 minutes.`
//       };

//       try {
//         await transporter.sendMail(mailOptions);
//       } catch (emailError) {
//         console.log('Email sending failed:', emailError);
//       }
//     }

//     res.json({ message: 'OTP resent successfully' });

//   } catch (error) {
//     console.error('Resend OTP error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;



const express = require("express");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");

const router = express.Router();

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Brevo SMTP Transporter
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS,
  },
});

// Login Route
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

    // Send OTP Email
    if (emailRegex.test(emailOrPhone)) {
      const mailOptions = {
        // from: `"Productr" <${process.env.BREVO_USER}>`,
        from: `"Productr" <${process.env.SENDER_EMAIL}>`,

        to: emailOrPhone,
        subject: "Your OTP for Product Account",
        text: `Your OTP is: ${otp}. It will expire in 10 minutes.`,
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        console.log("OTP Email sent successfully:", info.messageId);
      } catch (emailError) {
        console.log("Email sending failed:", emailError);
        return res.status(500).json({ message: "Failed to send OTP email" });
      }
    }

    return res.json({
      message: "OTP sent successfully",
      userId: user._id,
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Verify OTP Route
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

// Resend OTP Route
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(user.emailOrPhone)) {
      const mailOptions = {
        // from: `"Productr" <${process.env.BREVO_USER}>`,
        from: `"Productr" <${process.env.SENDER_EMAIL}>`,

        to: user.emailOrPhone,
        subject: "Your New OTP for Product Account",
        text: `Your new OTP is: ${otp}. It will expire in 10 minutes.`,
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Resend OTP Email sent successfully:", info.messageId);
      } catch (emailError) {
        console.log("Email sending failed:", emailError);
        return res.status(500).json({ message: "Failed to resend OTP email" });
      }
    }

    return res.json({ message: "OTP resent successfully" });

  } catch (error) {
    console.error("Resend OTP error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
