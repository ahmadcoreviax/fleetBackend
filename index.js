const express = require("express");
const app = express();
const cors = require("cors");
const DBCON = require("./Database/DB.js");
const cookieParser = require("cookie-parser");
require("dotenv").config();
DBCON();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN,
  })
);
app.use(cookieParser());
// files imports
const addBrand = require("./routes/managementRoutes/addBrand.js");
const addCategory = require("./routes/managementRoutes/addCategory.js");
const addCar = require("./routes/managementRoutes/addCar.js");
const getAllBrands = require("./routes/managementRoutes/getRoutes/getAllBrands.js");
const getAllCategories = require("./routes/managementRoutes/getRoutes/getAllCategories.js");
const getFeaturedCars = require("./routes/workingRoutes/getFeaturedCars.js");
const getSpecificCar = require("./routes/workingRoutes/getSpecificCar.js");
const getSpecificBooking = require("./routes/managementRoutes/getRoutes/getSpecificBooking.js");
const getAllCars = require("./routes/workingRoutes/getAllCars.js");
const getAllBookings = require("./routes/managementRoutes/getRoutes/getAllBookings.js");
const getSpecificBookingAdmin = require("./routes/managementRoutes/getRoutes/getSpecificBookingAdmin.js");
const createBooking = require("./routes/managementRoutes/createBooking.js");
const addons = require("./routes/managementRoutes/addons.js");
const updateCar = require("./routes/managementRoutes/updateCar.js");
const updateBooking = require("./routes/managementRoutes/updateBooking.js");
const deleteCar = require("./routes/managementRoutes/deleteCar.js");
const bookingAnalytics = require("./routes/managementRoutes/getRoutes/bookingAnalytics.js");
const auth = require("./routes/managementRoutes/Auth.js");
// files imports
// routes registration
app.use("/api/mng/addBrand", addBrand);
app.use("/api/mng/addCategory", addCategory);
app.use("/api/mng/addCar", addCar);
app.use("/api/mng/updateCar", updateCar);
app.use("/api/mng/updateBooking", updateBooking);
app.use("/api/mng/deleteCar", deleteCar);
app.use("/api/mng/createBooking", createBooking);
app.use("/api/mng/addons", addons);
app.use("/api/mng/auth", auth);
// ++++++++++++++++++++++++++++++++++++++ get routes
app.use("/api/mng/getAllCategories", getAllCategories);
app.use("/api/mng/getAllBrands", getAllBrands);
app.use("/api/mng/getBookingAnalytics", bookingAnalytics);
app.use("/api/mng/getAllBookings", getAllBookings);
app.use("/api/getFeaturedCars", getFeaturedCars);
app.use("/api/getSpecificCar", getSpecificCar);
app.use("/api/mng/getSpecificBooking", getSpecificBooking);
app.use("/api/mng/getSpecificBookingAdmin", getSpecificBookingAdmin);
app.use("/api/getAllCars", getAllCars);

// ++++++++++++++++++++++++++++++++++++++  get routs
// routes registratione
// "0.0.0.0",
const Port = process.env.PORT || 8000;
app.listen(Port, () => {
  console.log(`Server is Listening on Port: ${Port}`);
});
