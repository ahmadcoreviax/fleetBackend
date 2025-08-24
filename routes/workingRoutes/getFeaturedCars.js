const express = require("express");
const router = express.Router();
const Car = require("../../Models/Car.model.js");
router.get("/", async (req, res) => {
  try {
    const cars = await Car.find({ status: "Available" })
      .sort({ createdAt: -1 })
      .limit(8);
    res.status(200).json({ cars });
  } catch (error) {
    console.log("Error while fetching featured cars", error);
    res
      .status(500)
      .json({ msg: "Error occured while fetching featured cars!" });
  }
});
module.exports = router;
