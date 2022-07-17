const mongoose = require("mongoose");
/*
 * MongoDB model for Conversations
 * Create conversation between people
 * LastMessage from the person to be shown like Messenger
 */
const chatRoomSchema = new mongoose.Schema(
  {
    people: {
      type: Array(mongoose.Types.ObjectId),
      required: true,
      default: [],
      ref: "users",
    },
    lastMessage: {
      type: mongoose.Types.ObjectId,
      ref: "messages",
      default: null,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("chatrooms", chatRoomSchema);
