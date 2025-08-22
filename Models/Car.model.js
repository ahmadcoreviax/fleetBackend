const mongoose = require("mongoose");

const CarSchema = new mongoose.Schema(
  {
    carImages: [
      {
        public_id: String,
        url: String,
      },
    ],
    name: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,

      index: true, // searchable
    },
    color: {
      type: String,
      required: true,
    },
    licensePlate: {
      type: String,
      required: true,
      unique: true,

      index: true, // unique + searchable
    },
    chasisNumber: {
      type: String,
      required: true,
      unique: true,

      index: true, // unique + searchable
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
      required: true,
    },
    brand: {
      type: mongoose.Types.ObjectId,
      ref: "Brand",
      default: null,
    },
    discountedPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    perMonthCharges: {
      type: Number,
      required: true,
      index: true, // for price filtering
    },
    perWeekCharges: {
      type: Number,
      required: true,
      index: true,
    },
    perDayCharges: {
      type: Number,
      required: true,
      index: true, // for price filtering
    },
    availableIn: {
      type: [String], // list of states/areas
      required: true,
      index: true, // searchable by area
    },
    description: [{ type: String }],
    status: {
      type: String,
      enum: ["Available", "Booked", "Maintenance"],
      default: "Available",
      index: true, // quick filter for availability
    },
    details: [{ type: String }],
    faqs: [
      {
        question: { type: String },
        answer: { type: String },
      },
    ],
    videos: {
      type: [String], // optional video URLs
    },
  },
  { timestamps: true }
);

// compound indexes (example: brand + model search)
CarSchema.index({ brand: 1, model: 1 });
CarSchema.index({ category: 1, status: 1 });
CarSchema.index({ perDayCharges: 1, perMonthCharges: 1 });
let Car = mongoose.model("Car", CarSchema);
module.exports = Car;
