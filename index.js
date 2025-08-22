const express = require("express");
const app = express();
const cors = require("cors");
const DBCON = require("./Database/DB.js");
require("dotenv").config();
DBCON();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    // credentials: true,
    // origin: process.env.ORIGIN,
  })
);
// files imports
const addBrand = require("./routes/managementRoutes/addBrand.js");
const addCategory = require("./routes/managementRoutes/addCategory.js");
const addCar = require("./routes/managementRoutes/addCar.js");
const getAllBrands = require("./routes/managementRoutes/getRoutes/getAllBrands.js");
const getAllCategories = require("./routes/managementRoutes/getRoutes/getAllCategories.js");
// files imports
// routes registration
app.use("/api/mng/addBrand", addBrand);
app.use("/api/mng/addCategory", addCategory);
app.use("/api/mng/addCar", addCar);
// ++++++++++++++++++++++++++++++++++++++ get routes
app.use("/api/mng/getAllBrands", getAllBrands);
app.use("/api/mng/getAllCategories", getAllCategories);

// ++++++++++++++++++++++++++++++++++++++  get routs
// routes registratione

const Port = process.env.PORT || 8000;
app.listen(Port, () => {
  console.log(`Server is Listening on Port: ${Port}`);
});
