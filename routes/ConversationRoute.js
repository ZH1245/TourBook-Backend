//--------------------------------------------------------------------------------------------------
/*
 * Conversation Route
 */
//--------------------------------------------------------------------------------------------------

//----------------------- IMPORTS ------------------------------------------------------------------
const router = require("express").Router();
const handleAuth = require("../middlewares/auth");
const ConversationController = require("../controllers/Conversations");
//--------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------
router.get("/mine", handleAuth, ConversationController.getMyConversations);
router.post("/init", handleAuth, ConversationController.initializeChat);
//--------------------------------------------------------------------------------------------------
module.exports = router;
