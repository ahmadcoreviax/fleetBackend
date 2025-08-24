const express = require("express");
const router = express.Router();
const Car = require("../../Models/Car.model.js");
router.get("/", async (req, res) => {
  try {
    const cars = await Car.find({ status: "Available" });
    if (!cars) return res.status(400).json({ msg: "No Cars Found!" });
    res.status(200).json(cars);
  } catch (error) {
    console.log("Error occured while getting all cars", error);
    res
      .status(500)
      .json({ msg: "Server side problem while getting all cars!" });
  }
});
module.exports = router;
