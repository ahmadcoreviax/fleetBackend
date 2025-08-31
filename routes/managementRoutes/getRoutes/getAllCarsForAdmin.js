const express = require("express");
const router = express.Router();
const Car = require("../../../Models/Car.model.js");
const authVerify = require("../../../Middleware/authVerify.middleware.js");
router.get("/", authVerify, async (req, res) => {
  try {
    const cars = await Car.find({}).sort({
      createdAt: -1,
    });

    if (!cars || cars.length === 0) {
      return res.status(404).json({ msg: "No Cars Found!" });
    }

    res.status(200).json(cars);
  } catch (error) {
    console.error("Error occured while getting cars:", error);
    res.status(500).json({ msg: "Server side problem while getting cars!" });
  }
});

module.exports = router;
