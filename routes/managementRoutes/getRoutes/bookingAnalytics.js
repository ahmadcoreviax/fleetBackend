// routes/bookingAnalytics.js
const express = require("express");
const router = express.Router();
const Booking = require("../../../Models/Booking.model.js");
const authVerify = require("../../../Middleware/authVerify.middleware.js");
// Get bookings count grouped by month (default full year or custom date range)
router.get("/", authVerify, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let match = {};
    if (startDate && endDate) {
      match.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const analytics = await Booking.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          totalBookings: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.json({ analytics });
  } catch (error) {
    console.error("Error fetching analytics", error);
    res.status(500).json({ msg: "Error while fetching booking analytics" });
  }
});

module.exports = router;
