const express = require("express");
const router = express.Router();
const Booking = require("../../Models/Booking.model.js");
const { default: mongoose } = require("mongoose");
router.post("/", async (req, res) => {
  try {
    let data = req.body.data;
    let id = new mongoose.Types.ObjectId(data.id);
    let booking = await Booking.findOne({ _id: id });
    if (!booking) return res.status(400).json({ msg: "No Booking Found!" });
    booking.status = data.status;
    await booking.save();
    res.status(200).json({ msg: "Booking Status Updated Successfully!" });
  } catch (error) {
    console.log("Error occured while updating booking", error);
    res
      .status(500)
      .json({ msg: "Some Server Side Error Occured While Updating Booking!" });
  }
});
module.exports = router;
