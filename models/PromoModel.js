const mongoose = require("mongoose");

/*
 * MongoDB model for PromoCode
 * Create PromoCode for discounts in Future.
 */
const Schema = mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    vendorID: { type: mongoose.Schema.Types.ObjectId, ref: "Vendors" },
    dateAdded: { type: Date, requried: true },
    validTill: { type: Date, required: true },
    // expired: { type: Boolean, default: false },
    onTours: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "tours",
      default: null,
    },
    amount: { type: Number, required: true },
    isPercent: { type: Boolean, required: true, default: true },
  },
  { timestamps: true }
);

//virtual expiry
Schema.virtual("expired").set(() => {
  if (Date.now() > this.validTill) {
    return true;
  }
});

module.exports = mongoose.model("PromoCodes", Schema);
