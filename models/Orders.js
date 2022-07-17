const mongoose = require("mongoose");

/*
 * MongoDB model for Orders
 * Order Table for storing information about Reservations and Refunds about TOURS
 */

const Schema = mongoose.Schema(
  {
    tourID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tours",
      required: true,
    },
    // tourID: { type: String, required: true },
    seats: { type: Number, requierd: true },
    // promo: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "PromoCodes",
    //   default: null,
    // },
    amount: { type: Number, required: true },
    touristID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    isApproved: { type: Boolean, default: false },
    isRefunded: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
    requestRefund: { type: Boolean, default: false },

    //delete
    // refundAmount: { type: Number, default: 0 },
    //
  },
  { timestamps: true }
);

module.exports = mongoose.model("Orders", Schema);
