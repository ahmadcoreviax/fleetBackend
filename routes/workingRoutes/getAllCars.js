const express = require("express");
const router = express.Router();
const Car = require("../../Models/Car.model.js");
const redis = require("../../Utils/redis.js");
router.get("/", async (req, res) => {
  try {
    // // 1️⃣ Cache check
    // const cachedCars = await redis.get("available_cars");

    // if (cachedCars) {
    //   return res.status(200).json(JSON.parse(cachedCars));
    // }
    const cars = await Car.find({ status: "Available" }).sort({
      createdAt: -1,
    });
    if (!cars) return res.status(400).json({ msg: "No Cars Found!" });
    // await redis.set("available_cars", JSON.stringify(cars), "EX", 900);
    res.status(200).json(cars);
  } catch (error) {
    console.log("Error occured while getting all cars", error);
    res
      .status(500)
      .json({ msg: "Server side problem while getting all cars!" });
  }
});
module.exports = router;
