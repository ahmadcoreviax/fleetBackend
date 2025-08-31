const express = require("express");
const router = express.Router();
const Car = require("../../Models/Car.model.js");

router.get("/", async (req, res) => {
  try {
    let car = await Car.findOne({}).sort({ createdAt: -1 });
    res.status(200).json({ car });
  } catch (error) {
    console.log("Error while fetching car for banner", error);
    res
      .status(500)
      .json({ msg: "Error occured in server while fetching car for banner" });
  }
});
module.exports = router;
