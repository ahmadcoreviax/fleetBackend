const express = require("express");
const router = express.Router();
const Car = require("../../Models/Car.model.js");
router.post("/", async (req, res) => {
  try {
    let { slug } = req.body;
    if (!slug)
      return res
        .status(404)
        .json({ msg: "Slug not available for finding car!" });
    const car = await Car.findOne({ slug }).lean();
    if (!car) return res.status(404).json({ msg: "Car not found!" });
    return res.status(200).json(car);
  } catch (error) {
    console.log("Error while fetching specific car", error);
    res
      .status(500)
      .json({ msg: "Server Side Error Occured While Fetching Specific Car" });
  }
});
module.exports = router;
