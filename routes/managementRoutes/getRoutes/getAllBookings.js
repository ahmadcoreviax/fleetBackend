const express = require("express");
const router = express.Router();
const Booking = require("../../../Models/Booking.model.js");
const authVerify = require("../../../Middleware/authVerify.middleware.js");

router.get("/", authVerify, async (req, res) => {
  try {
    let bookings = await Booking.find({}).sort({ createdAt: -1 });
    if (!bookings) return res.status(404).json({ msg: "No Bookings Found!" });
    res.status(200).json({ bookings });
  } catch (error) {
    console.log("Error while getting all bookings", error);
    res
      .status(500)
      .json({ msg: "Server Side Error Occured While Fetching All Bookings" });
  }
});
module.exports = router;
