const express = require("express");
const router = express.Router();
const multer = require("multer");
const Car = require("../../Models/Car.model.js");
const cloudinary = require("cloudinary").v2;
const mongoose = require("mongoose");
const fs = require("fs");

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_DATABASE,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer setup (memory storage)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./tmp/my-uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});
const upload = multer({ storage: storage });

// Helper: Upload single file to cloudinary
const uploadToCloudinary = (filePath, folder = "car_inventory") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, format: "jpg" },
      (error, result) => {
        if (error) reject(error);
        else resolve({ public_id: result.public_id, url: result.secure_url });

        // Delete temp file after upload
        fs.unlink(filePath, () => {});
      }
    );

    fs.createReadStream(filePath).pipe(stream);
  });
};
router.post("/", upload.array("carImages"), async (req, res) => {
  try {
    const {
      name,
      model,
      color,
      licensePlate,
      chasisNumber,
      category,
      slug,
      brand,
      discountedPercentage,
      perMonthCharges,
      perWeekCharges,
      perDayCharges,
      availableIn,
      description,
      details,
      faqs,
    } = req.body;
    const carImages = [];
    if (req.files) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.path);
        carImages.push(result);
      }
    }
    // Save in MongoDB
    const car = new Car({
      carImages,
      name,
      model,
      color,
      licensePlate,
      chasisNumber,
      category: category || null,
      slug,
      brand: brand || null,
      discountedPercentage: Number(discountedPercentage) || 0,
      perMonthCharges: Number(perMonthCharges),
      perWeekCharges: Number(perWeekCharges),
      perDayCharges: Number(perDayCharges),
      availableIn: JSON.parse(availableIn || "[]"),
      description: JSON.parse(description || "[]"),
      details: JSON.parse(details || "[]"),
      faqs: JSON.parse(faqs || "[]"),
      //   videos: JSON.parse(videos || "[]"),
    });

    const savedCar = await car.save();

    res.status(200).json({
      msg: "Car added successfully",
      car: savedCar,
    });
  } catch (error) {
    console.error("Error saving car:", error);
    res.status(500).json({ msg: "Error occured while adding new car" });
  }
});
module.exports = router;
