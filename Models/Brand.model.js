const mongoose = require("mongoose");
const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  { timestamps: true }
);
const Brand = mongoose.models.Brand || mongoose.model("Brand", BrandSchema);
module.exports = Brand;
