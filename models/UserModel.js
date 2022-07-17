const mongoose = require("mongoose");
const lodash = require("lodash");

/*
 * MongoDB model for Users.
 * Storing Users in DB.
 * Keeping track of information like: Forgot Password, Delete, Block , TourBook Credits
 */
//------------------------------------------------------------------------------------------------
const Schema = mongoose.Schema(
  {
    fname: { type: String, required: true, trim: true },
    lname: { type: String, trim: true },
    email: { type: String, required: true, trim: true },
    password: { type: String, default: "" },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cities",
      required: false,
    },
    country: { type: String, required: false, default: "Pakistan" },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    profilePicture: {
      type: String,
      default: "",
    },
    balance: { type: Number, default: 0, required: false },
    source: { type: String, default: "" },
    userType: { type: String, required: true, default: "" },
    phoneNumber: { type: String, default: "" },
    isRating: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    cnic: { type: String, default: "" },
    isDeleted: { type: Boolean, default: false },
    emailVerificationCode: { type: String, default: "" },
    passwordResetCode: { type: String, default: null },
    passwordResetExpiry: { type: Date, default: null },
  },
  { timestamps: true }
);
//------------------------------------------------------------------------------------------------
Schema.virtual("fullName").get(() => {
  return lodash.startCase(this.fname + " " + this.lname);
});
//------------------------------------------------------------------------------------------------
Schema.virtual("fullName").set((value) => {
  const nameA = value.split(" ");
  this.name.fname = nameA[0];
  this.name.lname = nameA[1];
});
//------------------------------------------------------------------------------------------------
module.exports = mongoose.model("users", Schema);
