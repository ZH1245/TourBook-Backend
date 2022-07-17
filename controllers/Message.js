//--------------------------------------------------------------------------------------------------
/*
 * Message Controller Containing Try, Catch of Services
 */
//--------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------
const MessageService = require("../services/Message");
const Joi = require("joi");
//--------------------------------------------------------------------------------------------------
const MessageController = {
  //--------------------------------------------------------------------------------------------------
  getMessagesInConversation: async (req, res) => {
    try {
      const schema = Joi.object({
        id: Joi.string()
          .required()
          .error(() => {
            return Error("Please Provide id");
          }),
      });
      await schema.validateAsync(req.params);
      let messages = await MessageService.getAllMessagesByConversationID(
        req.params.id
      );
      return res.send({ data: messages, message: "Fetched" });
    } catch (e) {
      res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e?.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  sendMessage: async (req, res) => {
    try {
      const schema = Joi.object({
        message: Joi.string().required().messages({
          "any.required": "Please Provide message text",
        }),
        roomID: Joi.string()
          .required()
          .error(() => {
            return Error("Please Provide roomID");
          }),
        receiver: Joi.string().required(),
      });
      await schema.validateAsync(req.body);
      let user = req?.user;
      let message = await MessageService.createMessage(req.body, user);
      return res.send({ data: true, message: "Created" });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e?.message });
    }
  },
};
//--------------------------------------------------------------------------------------------------
module.exports = MessageController;
