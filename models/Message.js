const mongoose = require("mongoose");

/*
 * MongoDB model for Messages
 * Create a new Message with Receiver , Sender and Message Text
 */
const messageSchema = new mongoose.Schema(
  {
    roomID: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "chatrooms",
      required: true,
    },
    message: { type: String, required: true },
    sender: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "users",
      required: true,
    },
    receiver: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("messages", messageSchema);
