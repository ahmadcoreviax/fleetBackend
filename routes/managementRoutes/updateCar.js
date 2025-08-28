const express = require("express");
const router = express.Router();
const multer = require("multer");
const Car = require("../../Models/Car.model.js");
const cloudinary = require("cloudinary").v2;
const mongoose = require("mongoose");
const fs = require("fs");
const authVerify = require("../../Middleware/authVerify.middleware.js");
const redis = require("../../Utils/redis.js");
// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_DATABASE,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Multer setup (diskStorage)
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

// Helper: Upload file to cloudinary
const uploadToCloudinary = (filePath, folder = "car_inventory") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, format: "jpg" },
      (error, result) => {
        if (error) reject(error);
        else resolve({ public_id: result.public_id, url: result.secure_url });

        // Delete temp file
        fs.unlink(filePath, () => {});
      }
    );

    fs.createReadStream(filePath).pipe(stream);
  });
};

// ✅ UPDATE CAR ROUTE
router.post("/:id", authVerify, upload.array("carImages"), async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid car ID" });
    }

    // --- Body fields ---
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
      deleteImages, // 👈 ye frontend se array of public_ids aaega (JSON.stringify([...]))
    } = req.body;

    // --- Find existing car ---
    const car = await Car.findById(id);
    if (!car) return res.status(404).json({ msg: "Car not found" });

    // --- Handle image deletions ---
    let updatedImages = [...car.carImages];
    if (deleteImages) {
      const imgsToDelete = JSON.parse(deleteImages); // array of public_ids
      for (const public_id of imgsToDelete) {
        try {
          await cloudinary.uploader.destroy(public_id);
          updatedImages = updatedImages.filter(
            (img) => img.public_id !== public_id
          );
        } catch (err) {
          console.error("Error deleting image:", err);
        }
      }
    }

    // --- Handle new uploads ---
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.path);
        updatedImages.push(result);
      }
    }

    // --- Update car fields ---
    car.name = name || car.name;
    car.model = model || car.model;
    car.color = color || car.color;
    car.licensePlate = licensePlate || car.licensePlate;
    car.chasisNumber = chasisNumber || car.chasisNumber;
    car.category = category || car.category;
    car.slug = slug || car.slug;
    car.brand = brand || car.brand;
    car.discountedPercentage =
      Number(discountedPercentage) || car.discountedPercentage;
    car.perMonthCharges = Number(perMonthCharges) || car.perMonthCharges;
    car.perWeekCharges = Number(perWeekCharges) || car.perWeekCharges;
    car.perDayCharges = Number(perDayCharges) || car.perDayCharges;
    car.availableIn = availableIn ? JSON.parse(availableIn) : car.availableIn;
    car.description = description ? JSON.parse(description) : car.description;
    car.details = details ? JSON.parse(details) : car.details;
    car.faqs = faqs ? JSON.parse(faqs) : car.faqs;
    car.carImages = updatedImages;

    // --- Save updated car ---
    const updatedCar = await car.save();
    // 1️⃣ Invalidate related caches
    // await redis.del("available_cars");
    // await redis.del("featured_cars");
    res.status(200).json({
      msg: "Car updated successfully",
      car: updatedCar,
    });
  } catch (error) {
    console.error("Error updating car:", error);
    res.status(500).json({ msg: "Error occurred while updating car" });
  }
});

module.exports = router;
