//------------------------------------------------------------------------------------------------
/*
 * Message Service
 */
//------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------
const ConversationModel = require("../models/ChatRoom");
const pusher = require("../helpers/pusher");
const MessageModel = require("../models/Message");
//------------------------------------------------------------------------------------------------

const MessageService = {
  //------------------------------------------------------------------------------------------------
  // Send Message /Create New Message
  createMessage: async (data, user) => {
    try {
      const payload = data;
      let conversation = await ConversationModel.findById(data.roomID);
      let receiver = conversation.people.filter((person) => person != user.id);
      receiver = receiver[0];
      let newMessage = await MessageModel.create({
        roomID: data.roomID,
        sender: user.id,
        receiver: receiver,
        message: data.message,
      });

      if (newMessage) {
        let conversation = await ConversationModel.findByIdAndUpdate(
          data.roomID,
          {
            lastMessage: newMessage,
          }
        );
        let message = await MessageModel.findById(newMessage._id).populate([
          "sender",
          "receiver",
        ]);
        pusher.trigger(`${data.roomID}`, "message-received", message);
        return newMessage;
      }
    } catch (e) {
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  // Get All Messages By Conversation ID
  getAllMessagesByConversationID: async (conversationID) => {
    try {
      let messages = await MessageModel.find({
        roomID: conversationID,
      })
        .sort("createdAt")
        .populate(["sender", "receiver"]);
      if (messages) {
        return messages;
      } else {
        let e = new Error("No Messages in the Conversation");
        e.statusCode = 404;
        throw e;
      }
    } catch (e) {
      throw e;
    }
  },
};
//------------------------------------------------------------------------------------------------
module.exports = MessageService;
