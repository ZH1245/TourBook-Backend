const mongoose = require("mongoose");

/*
 * MongoDB model for Rating
 * Ratings after Successful completion of Tour like Uber.
 * User will be able to decide about Tour Operator based on Ratings and Comments.
 */
const Schema = mongoose.Schema(
  {
    touristID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    rating: { type: Number, required: true, default: 2.5 },
    tourID: { type: mongoose.Schema.Types.ObjectId, ref: "Tours" },
    vendorID: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    message: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ratings", Schema);
