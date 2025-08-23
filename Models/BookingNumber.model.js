const mongoose = require("mongoose");
const bookingNumberSchema = new mongoose.Schema({
  bookingNumber: { type: Number },
});
const BookingNumber =
  mongoose.models.BookingNumber ||
  new mongoose.model("BookingNumber", bookingNumberSchema);
module.exports = BookingNumber;
