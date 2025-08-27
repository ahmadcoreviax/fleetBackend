const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  const token = req.body.token;
  if (!token) {
    return res.status(401).json({ login: false, msg: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return res.status(200).json({ login: true });
  } catch (err) {
    return res.status(403).json({ login: false, msg: "Invalid token" });
  }
});
module.exports = router;
