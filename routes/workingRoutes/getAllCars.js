const express = require("express");
const router = express.Router();
const Car = require("../../Models/Car.model.js");
const redis = require("../../Utils/redis.js");

router.get("/", async (req, res) => {
  try {
    // Query params
    let { page = 1, limit = 6 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    // Redis key unique banao page aur limit ke sath
    // const cacheKey = `available_cars_page_${page}_limit_${limit}`;

    // 1️⃣ Check cache
    // const cachedData = await redis.get(cacheKey);
    // if (cachedData) {
    //   return res.status(200).json(JSON.parse(cachedData));
    // }

    // 2️⃣ Total count
    const totalCars = await Car.countDocuments({ status: "Available" });

    // 3️⃣ Cars fetch with pagination
    const cars = await Car.find({ status: "Available" })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    if (!cars || cars.length === 0) {
      return res.status(404).json({ msg: "No Cars Found!" });
    }

    // 4️⃣ Response object
    const response = {
      cars,
      totalCars,
      totalPages: Math.ceil(totalCars / limit),
      currentPage: page,
    };

    // 5️⃣ Cache set
    // await redis.set(cacheKey, JSON.stringify(response), "EX", 900); // 15 min cache

    res.status(200).json(response);
  } catch (error) {
    console.error("Error occured while getting cars:", error);
    res.status(500).json({ msg: "Server side problem while getting cars!" });
  }
});

module.exports = router;
