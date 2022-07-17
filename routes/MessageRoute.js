//--------------------------------------------------------------------------------------------------
/*
 * Message Route
 */
//--------------------------------------------------------------------------------------------------

//----------------------- IMPORTS ------------------------------------------------------------------
const router = require("express").Router();
const MessageController = require("../controllers/Message");
const handleAuth = require("../middlewares/auth");
//--------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------
router.post("/create", handleAuth, MessageController.sendMessage);
router.get(
  "/conversation/:id",
  handleAuth,
  MessageController.getMessagesInConversation
);
//--------------------------------------------------------------------------------------------------
module.exports = router;
