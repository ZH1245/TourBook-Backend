const jwt = require("jsonwebtoken");
require("dotenv").config();
const lodash = require("lodash");
const UserModel = require("../models/UserModel");
/*
 * MiddleWare to store the current user from header to req.user
 */
const handleAuth = async (req, res, next) => {
  // console.log("INSIDE");
  let token = req.header("x-auth-token");
  if (!token) {
    console.log("TOKEN NOT FOUND");
    return res.status(400).send("Token Not Provided. Please Login ");
  }
  try {
    let user = jwt.verify(token, process.env.PRIVATE_KEY);
    let userInDB = await UserModel.findById(user.id);
    if (!userInDB) {
      let e = new Error("User Not In DB. Altered TOKEN");
      throw e;
    }
    req.user = user;
  } catch (e) {
    console.log("INVALID TOKEN");
    return res.status(401).send("Invalid Token");
  }
  // req.user = lodask.pick(user, ["email", "_id", "firstName", "lastName"]);
  next();
};

module.exports = handleAuth;
