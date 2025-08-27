const express = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
dotenv.config();
const router = express.Router();
const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // max 5 requests in 5 minutes
  message: {
    status: 429,
    msg: "Too many login attempts, please try again later.",
  },
});

// POST /api/login
router.post("/", loginLimiter, (req, res) => {
  try {
    const { username, password } = req.body.data;
    // Simple check
    if (username === "ahmad" && password === "20252025") {
      // Generate JWT token
      const token = jwt.sign({ username }, process.env.JWT_SECRET, {
        expiresIn: "6h",
      });

      // Set token as cookie
      res.cookie("token", token, {
        httpOnly: process.env.COOKIE_HTTPONLY, // ✅ Secure from JS access
        secure: process.env.COOKIE_SECURE, // ✅ False in dev (no HTTPS)
        sameSite: process.env.COOKIE_SAMESITE, // ✅ Works well with localhost:PORT setup
        maxAge: 6 * 60 * 60 * 1000, // ✅ 1 hour
      });

      return res.json({ success: true, msg: "Login successful" });
    }

    // Wrong credentials
    return res.status(401).json({ success: false, msg: "Wrong credentials" });
  } catch (error) {
    console.log("Error while authenticating", error);
    res.status(500).json({ msg: "Authentication Failed!" });
  }
});

module.exports = router;
