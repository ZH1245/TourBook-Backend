const mongoose = require("mongoose");

/*
 * MongoDB model for CustomTour
 * Create Custom Tours with specific requirements and offers by Tour Operators
 */

const Schema = mongoose.Schema(
  {
    by: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "users" },
    // to: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   // type: String,
    //   default: null,
    //   // required: true,
    //   ref: "users",
    // },
    requirements: {
      maxBudget: { type: Number, required: true },
      seats: { type: Number, required: true },
      description: { type: String, required: true },
      source: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "cities",
      },
      destination: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "cities",
      },
      isHotel: { type: Boolean, default: false },
      isGuide: { type: Boolean, default: false },
      places: { type: Array, default: [] },
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
    },
    fulfilledBy: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      // type: [String],
      // required: true,
      ref: "users",
    },
    hiddenFrom: {
      type: Array,
      default: [],
    },
    offers: { type: Array, default: [] },
    agreedAmount: { type: Number, default: 0, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("customtour", Schema);
