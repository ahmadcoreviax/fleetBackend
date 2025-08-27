const express = require("express");
const router = express.Router();
const Brand = require("../../Models/Brand.model.js");
const authVerify = require("../../Middleware/authVerify.middleware.js");
router.post("/", authVerify, async (req, res) => {
  try {
    const { brandName, brandSlug } = req.body;
    const brand = new Brand({
      name: brandName,
      slug: brandSlug,
    });
    await brand.save();
    return res.status(200).json({ msg: "Brand Added Successfully!" });
  } catch (error) {
    console.log("error in adding brand", error);
    return res
      .status(500)
      .json({ msg: "Server Side Error Occured While Adding Brand!" });
  }
});

module.exports = router;
