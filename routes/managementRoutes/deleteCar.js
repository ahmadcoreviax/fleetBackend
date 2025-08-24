const express = require("express");
const router = express.Router();
const Car = require("../../Models/Car.model.js");
const cloudinary = require("cloudinary").v2;

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_DATABASE,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// DELETE Car by ID
router.post("/", async (req, res) => {
  try {
    const { id, pass } = req.body;
    if (pass == "fleetxDelCode") {
      // find car in DB
      const car = await Car.findById(id);
      if (!car) {
        return res.status(404).json({ msg: "Car not found" });
      }

      // delete all images from Cloudinary
      if (car.carImages && car.carImages.length > 0) {
        for (const img of car.carImages) {
          if (img.public_id) {
            await cloudinary.uploader.destroy(img.public_id);
          }
        }
      }

      // delete car from DB
      await Car.findByIdAndDelete(id);

      res
        .status(200)
        .json({ msg: "Car and related images deleted successfully" });
    } else {
      res.status(400).json({ msg: "Wrong Credentials For Deleting Car!" });
    }
  } catch (error) {
    console.error("Error deleting car:", error);
    res.status(500).json({ msg: "Error occurred while deleting car" });
  }
});

module.exports = router;
