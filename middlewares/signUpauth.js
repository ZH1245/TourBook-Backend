const jwt = require("jsonwebtoken");
require("dotenv").config();
const lodash = require("lodash");
const handleSingupAuth = (req, res, next) => {
  let token = req.header("x-auth-token");
  if (!token) {
    next();
  } else {
    return res.status(401).send("ALREADY SIGNED IN");
  }
};
module.exports = handleSingupAuth;
