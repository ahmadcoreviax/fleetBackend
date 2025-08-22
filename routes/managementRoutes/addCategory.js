const express = require("express");
const router = express.Router();
const Category = require("../../Models/Category.model.js");
router.post("/", async (req, res) => {
  try {
    const { categoryName, categorySlug } = req.body;
    const category = new Category({
      name: categoryName,
      slug: categorySlug,
    });
    await category.save();
    return res.status(200).json({ msg: "Category Added Successfully!" });
  } catch (error) {
    console.log("error in adding Category", error);
    return res
      .status(500)
      .json({ msg: "Server Side Error Occured While Adding Category!" });
  }
});

module.exports = router;
