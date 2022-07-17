const mongoose = require("mongoose");

/*
 * MongoDB model for Notifications
 * Notifications like Facebook
 */
const Schema = mongoose.Schema(
  {
    userID: { type: mongoose.Types.ObjectId, required: true, ref: "users" },
    text: { type: String, required: true },
    type: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    contentID: { type: mongoose.Types.ObjectId, default: "" },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Notifications", Schema);
