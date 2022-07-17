const { body, query, check } = require("express-validator");
// const UserModel = require("../models/UserModel");
const User = require("../models/UserModel");

module.exports = {
  loginUserRules: () => {
    return [
      body("email")
        .notEmpty()
        .isEmail()
        .withMessage("Invalid Email")
        .custom((value, { req }) => {
          console.log("value ", value);
          let user = User.findOne({ email: value });
          return user.exec().then((u) => {
            return u ? {} : Promise.reject("Email not found");
          });
        }),
      check("password")
        .notEmpty()
        .isLength({ min: 8, max: 30 })
        .withMessage(
          "Password should contain at least 8 character and at most 30"
        ),
    ];
  },
  signUpUserRules: () => {
    return [
      check("email")
        .notEmpty()
        .isEmail()
        .withMessage("INVALID EMAIL")
        .custom((value, { req }) => {
          let user = User.findOne({ email: value });
          return user.exec().then((v) => {
            return v ? Promise.reject("EMAIL Already Exists") : {};
          });
        }),
      check("password")
        .notEmpty()
        .isLength({ min: 8, max: 30 })
        .withMessage(
          "Password should contain at least 8 character and at most 30"
        ),
      // check("role").notEmpty().withMessage("User Role Missing"),
      check("fname").notEmpty().withMessage("First Name Must be provided"),
      check("city").notEmpty().withMessage("City Must be specified"),
      check("gender").notEmpty().withMessage("Gender is required"),
    ];
  },
  updatePassword: () => {
    return [
      check("password")
        .notEmpty()
        .isLength({ min: 8, max: 30 })
        .withMessage(
          "Password should contain at least 8 character and at most 30"
        ),
      check("email").notEmpty().isEmail().withMessage("INVALID EMAIL"),
    ];
  },
};
