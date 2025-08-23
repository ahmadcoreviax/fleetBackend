const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },

    // Booking details
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    preferredTime: { type: String },

    addons: [{ type: mongoose.Types.ObjectId, ref: "Addons" }],
    bookingNumber: { type: Number, unique: true }, // allot hoga yahan
    addonsPrice: { type: Number },
    totalPrice: { type: Number },
    basePrice: { type: Number },
    status: {
      type: String,
      //   enum: ["Pending", "Confirmed", "Cancelled", "Completed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Booking =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
module.exports = Booking;
