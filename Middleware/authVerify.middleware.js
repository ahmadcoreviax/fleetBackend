const jwt = require("jsonwebtoken");

const authVerify = (req, res, next) => {
  // const token = req.cookies.token;
  // if (!token) {
  //   return res.status(401).json({ login: false, msg: "No token provided" });
  // }
  // try {
  //   console.log(token);
  //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //   console.log(decoded);
  //   req.username = decoded;
  //   console.log(req.username);
  next();
  // } catch (err) {
  //   return res.status(403).json({ login: false, msg: "Invalid token" });
  // }
};
module.exports = authVerify;
