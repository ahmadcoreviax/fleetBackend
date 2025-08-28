const express = require("express");
const router = express.Router();
const Car = require("../../Models/Car.model.js");
const redis = require("../../Utils/redis.js");
router.get("/", async (req, res) => {
  try {
    // const cachedCars = await redis.get("featured_cars");

    // if (cachedCars) {
    //   console.log("✅ Featured cars from Redis cache");
    //   return res.status(200).json({ cars: JSON.parse(cachedCars) });
    // }
    const cars = await Car.find({ status: "Available" })
      .sort({ createdAt: -1 })
      .limit(8);
    // await redis.set("featured_cars", JSON.stringify(cars), "EX", 900);
    res.status(200).json({ cars });
  } catch (error) {
    console.log("Error while fetching featured cars", error);
    res
      .status(500)
      .json({ msg: "Error occured while fetching featured cars!" });
  }
});
module.exports = router;
