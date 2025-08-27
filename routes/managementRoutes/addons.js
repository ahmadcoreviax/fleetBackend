const express = require("express");
const router = express.Router();
const Addons = require("../../Models/Addons.model.js");
const authVerify = require("../../Middleware/authVerify.middleware.js");
// Add or Update Addons
router.post("/add", authVerify, async (req, res) => {
  try {
    let data = req.body.payload.addons; // frontend array of addons

    // Ensure data is an array
    if (!Array.isArray(data)) {
      return res.status(400).json({ msg: "Invalid addons data format" });
    }

    // Always replace existing addons array in the single document
    const addons = await Addons.findOneAndUpdate(
      {}, // match any (since only one doc should exist)
      { addons: data },
      { new: true, upsert: true } // upsert: create if not exist, new: return updated doc
    );

    res.status(200).json({ msg: "Addons updated successfully", addons });
  } catch (error) {
    console.log("Error while adding/updating addons", error);
    res
      .status(500)
      .json({ msg: "Server Side Error Occured While Adding/Updating Addons" });
  }
});

// Get addons
router.get("/get", async (req, res) => {
  try {
    const addons = await Addons.findOne({});
    res.status(200).json(addons || { addons: [] });
  } catch (error) {
    console.log("Error while fetching addons", error);
    res
      .status(500)
      .json({ msg: "Server Side Error Occured While Fetching Addons" });
  }
});

module.exports = router;
