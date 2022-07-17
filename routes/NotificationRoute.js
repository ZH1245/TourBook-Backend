//--------------------------------------------------------------------------------------------------
/*
 * Notifications Route
 */
//--------------------------------------------------------------------------------------------------

//------------------------ IMPORTS -----------------------------------------------------------------
const NotificationController = require("../controllers/NotificationController");
const handleAuth = require("../middlewares/auth");
const router = require("express").Router();
//--------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------
router.get("/get/:id", NotificationController.getNotificationByID);
router.get("/mine", handleAuth, NotificationController.getMyNotifications);
router.put("/read/all", handleAuth, NotificationController.markAllAsRead);
router.put("/read/", handleAuth, NotificationController.markAsread);
//--------------------------------------------------------------------------------------------------
module.exports = router;
