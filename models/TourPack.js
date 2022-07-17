const mongoose = require("mongoose");

/*
 * MongoDB model for Tours
 * Tour Operators will provide the following descriptions.
 */
const Schema = mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    isCompleted: { type: Boolean, default: false },
    // city: { type: Array(String), required: true },
    source: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cities",
      required: true,
    },
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cities",
      required: true,
    },
    //remove
    // addedOn: { type: Date, required: true, default: Date.now },
    startDate: { type: Date, required: true },
    //
    // duration: { type: String, required: true },
    // touristID: { type: mongoose.Schema.Types.ObjectId, ref: "Tourists" },
    vendorID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    seats: { type: Number, required: true },
    validTill: { type: Date, required: true },
    hasGuide: { type: Boolean, required: true },
    hasFood: { type: Boolean, required: true },
    hasTransport: { type: Boolean, required: true },
    hasHotel: { type: Boolean, required: true },
    //backend validation
    meetLocation: {
      type: Array,
      default: [],
    },
    //
    //default empty str
    places: { type: Array, default: [] },
    // tourGuide: { type: mongoose.Schema.Types.ObjectId, ref: "TourGuides" },
    tourpics: { type: Array, default: [] },
    description: { type: String, default: null, required: true },
    stops: { type: Array, default: [] },
    //stops locations
    // location: {
    //   long: { type: String, default: 0 },
    //   lat: { type: String, default: 0 },
    // },
    //
  },
  {
    timestamps: true,
  }
);

Schema.virtual("duration").get(() => {
  return new Date(this.validTill - this.addedOn);
});
module.exports = mongoose.model("tours", Schema);
