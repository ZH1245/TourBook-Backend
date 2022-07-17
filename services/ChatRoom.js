//------------------------------------------------------------------------------------------------
/*
 * Conversations
 */
//------------------------------------------------------------------------------------------------

const ChatRoomModel = require("../models/ChatRoom");
//------------------------------------------------------------------------------------------------
const ChatRoomService = {
  // Initialize Conversation. If already had a conversation return ConversationID else Create New Conversation
  getorCreate: async (data) => {
    try {
      let existing = await ChatRoomModel.findOne({
        people: { $all: [data.sender, data.receiver] },
      })
        .populate({
          path: "lastMessage",
          model: "messages",
          select: ["message", "sender"],
        })
        .populate({
          path: "people",
          model: "users",
          select: ["fname", "lname", "email", "profilePicture"],
        })
        .populate({
          path: "lastMessage",
          populate: {
            path: "sender",
            model: "users",
            select: ["fname", "lname"],
          },
        });
      if (existing) {
        return { data: existing, message: "Fetched" };
      } else {
        let people = [data.sender, data.receiver];
        let newConversation = await ChatRoomModel.create({
          people,
        });
        if (newConversation)
          return { data: newConversation, message: "Created" };
        else {
          throw new Error("Cannot create in DB");
        }
      }
    } catch (e) {
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  // Get All Conversations based on User that is Currently Logged in
  getMyConversations: async (data) => {
    try {
      console.log(data);
      let room = await ChatRoomModel.find({
        people: { $all: [data.id] },
      })
        .sort("-updatedAt")
        .populate({
          path: "people",
          model: "users",
          select: ["fname", "lname", "email", "profilePicture"],
        })
        .populate({
          path: "lastMessage",
          model: "messages",
          select: ["message", "sender"],
        })
        .populate({
          path: "lastMessage",
          populate: {
            path: "sender",
            model: "users",
            select: ["fname", "lname"],
          },
        });

      if (room) return room;
      else {
        throw new Error("NOT FOUND");
      }
    } catch (e) {
      throw e;
    }
  },
};
//------------------------------------------------------------------------------------------------
module.exports = ChatRoomService;
