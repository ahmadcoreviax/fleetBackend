const express = require("express");
const router = express.Router();
const Booking = require("../../Models/Booking.model.js");
const BookingNumber = require("../../Models/BookingNumber.model.js");
const Car = require("../../Models/Car.model.js");
const Addons = require("../../Models/Addons.model.js");
router.post("/", async (req, res) => {
  try {
    let data = req.body?.data;
    let bookingCounter = await BookingNumber.findOne();

    // Agar pehli dafa booking ban rahi hai toh ek doc create kardo
    if (!bookingCounter) {
      bookingCounter = new BookingNumber({ bookingNumber: 1000 });
      await bookingCounter.save();
    }
    const car = await Car.findById(data?.carId);
    if (!car) {
      return res.status(404).json({ msg: "Car not found!" });
    }
    // 🔥 Discounted prices calculate karo (agar discount > 0 hai)
    let perDayCharges = car.perDayCharges;
    let perWeekCharges = car.perWeekCharges;
    let perMonthCharges = car.perMonthCharges;
    console.log(car.discountedPercentage);
    if (car.discountedPercentage && car.discountedPercentage > 0) {
      const discountFactor = 1 - car.discountedPercentage / 100;
      perDayCharges = Math.round(car.perDayCharges * discountFactor);
      perWeekCharges = Math.round(car.perWeekCharges * discountFactor);
      perMonthCharges = Math.round(car.perMonthCharges * discountFactor);
    }

    // 3️⃣ Addons details fetch
    let addonsTotal = 0;
    if (data?.addons && data.addons.length > 0) {
      const result = await Addons.findOne(); // kyunki sab ek hi doc mein hai
      const addons = result.addons.filter((a) =>
        data.addons.includes(a._id.toString())
      );
      addonsTotal = addons.reduce((sum, addon) => sum + addon.price, 0);
    }

    // 4️⃣ Total days calculate
    const from = new Date(data?.fromDate);
    const to = new Date(data?.toDate);
    const diffTime = Math.abs(to - from);
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    let remainingDays = totalDays;
    let totalPrice = 0;

    // Months
    if (remainingDays >= 30) {
      const months = Math.floor(remainingDays / 30);
      totalPrice += months * perMonthCharges;
      remainingDays = remainingDays % 30;
    }

    // Weeks
    if (remainingDays >= 7) {
      const weeks = Math.floor(remainingDays / 7);
      totalPrice += weeks * perWeekCharges;
      remainingDays = remainingDays % 7;
    }
    if (remainingDays > 0) {
      totalPrice += remainingDays * perDayCharges;
    }

    // Addons ka total add karo
    let basePrice = totalPrice;
    totalPrice += addonsTotal;

    // 2️⃣ Increment booking number
    bookingCounter.bookingNumber += 1;
    await bookingCounter.save();
    let booking = new Booking({
      carId: data?.carId,
      name: data?.name,
      email: data?.email,
      phone: data?.phone,
      address: data?.address,
      fromDate: data?.fromDate,
      toDate: data?.toDate,
      preferredTime: data?.time,
      addons: data?.addons,
      bookingNumber: bookingCounter.bookingNumber,
      addonsPrice: addonsTotal,
      totalPrice,
      basePrice,
    });
    let savedBooking = await booking.save();
    res.status(200).json({
      msg: "Booking Created Successfully!",
      bookingId: bookingCounter.bookingNumber,
    });
  } catch (error) {
    console.log("Error in creating booking", error);
    res
      .status(500)
      .json({ msg: "Server Side Problem Occured While Creating Booking!" });
  }
});
module.exports = router;
