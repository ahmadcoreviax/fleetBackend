const express = require("express");
const router = express.Router();
const Brand = require("../../../Models/Brand.model.js");
router.get("/", async (req, res) => {
  try {
    let brands = await Brand.find({});
    res.status(200).json({ brands });
  } catch (error) {
    console.log("Error in getting all brands", error);
    res.status(500).json({ msg: "Error occured while getting brands!" });
  }
});
module.exports = router;
