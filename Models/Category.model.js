const mongoose = require("mongoose");
const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
  },
  slug: {
    type: String,
    required: true,
    index: true,
  },
});
const Category =
  mongoose.models.Category || mongoose.model("Category", CategorySchema);
module.exports = Category;
