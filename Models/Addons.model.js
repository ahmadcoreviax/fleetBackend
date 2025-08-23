const mongoose = require("mongoose");
const addonsSchema = new mongoose.Schema({
  addons: [
    {
      name: { type: String },
      price: { type: Number },
    },
  ],
});

const Addons =
  mongoose.models.Addons || new mongoose.model("Addons", addonsSchema);
module.exports = Addons;
