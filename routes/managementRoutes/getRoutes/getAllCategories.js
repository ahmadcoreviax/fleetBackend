const express = require("express");
const router = express.Router();
const Category = require("../../../Models/Category.model.js");
router.get("/", async (req, res) => {
  try {
    let categories = await Category.find({});
    res.status(200).json({ categories });
  } catch (error) {
    console.log("Error in getting all categories", error);
    res.status(500).json({ msg: "Error occured while getting categories!" });
  }
});
module.exports = router;
