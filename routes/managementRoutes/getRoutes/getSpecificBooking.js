const express = require("express");
const router = express.Router();
const Booking = require("../../../Models/Booking.model.js");
const { default: mongoose } = require("mongoose");
const Car = require("../../../Models/Car.model.js");
const Addons = require("../../../Models/Addons.model.js");
router.post("/", async (req, res) => {
  try {
    let id = req.body.id;
    let booking = await Booking.findOne({ bookingNumber: id }).populate(
      "carId",
      "name licensePlate color"
    ); // car ka data

    if (!booking) return res.status(404).json({ msg: "No Booking Exists!" });
    // find addons from Addons collection
    let addonsDoc = await Addons.findOne(); // maan lo ek hi document hamesha hoga
    let selectedAddons = addonsDoc.addons.filter((a) =>
      booking.addons.includes(a._id)
    );

    res.status(200).json({
      booking,
      selectedAddons,
    });
  } catch (error) {
    console.log("Error in fetching specific booking", error);
    res.status(500).json({ msg: "Server error in getting specific order!" });
  }
});
module.exports = router;
