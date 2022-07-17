//------------------------------------------------------------------------------------------------
/*
 * Notification Service
 */
//------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------
const NotificationsModel = require("../models/Notifications");
//------------------------------------------------------------------------------------------------
const NotificationService = {
  //------------------------------------------------------------------------------------------------
  // Get Notification Details by ID
  getNotificationByID: async (notificationID) => {
    try {
      let notification = await NotificationsModel.findById(notificationID);
      if (notification) {
        return notification;
      } else {
        let e = new Error("No Notifications Found!");
        e.statusCode = 404;
        throw e;
      }
    } catch (e) {
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  // Get Notifications By User ID / Logged IN USER
  getNotificationsByUserID: async (user) => {
    try {
      let notifications = await NotificationsModel.find({
        userID: user.id,
      }).sort("-createdAt");
      if (notifications) {
        return notifications;
      } else {
        let e = new Error("No Notifications Found!");
        e.statusCode = 404;
        throw e;
      }
    } catch (e) {
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  // Mark a Notification as Read
  markAsread: async (notificationID) => {
    try {
      let notification = await NotificationsModel.updateOne(
        { _id: notificationID },
        { $set: { isRead: true } }
      );
      if (notification.modifiedCount) {
        return notification.modifiedCount;
      } else {
        let e = new Error("No Notifications Found!");
        e.statusCode = 404;
        throw e;
      }
    } catch (e) {
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  // Mark ALL Notifications as Read
  markAllAsRead: async (user) => {
    try {
      let notification = await NotificationsModel.updateMany(
        { userID: user.id, isRead: false },
        { $set: { isRead: true } }
      );
      console.log(notification.modifiedCount);
      if (notification.modifiedCount >= 0) {
        return notification.modifiedCount;
      } else {
        let e = new Error("Something Went Wrong!");
        e.statusCode = 404;
        throw e;
      }
    } catch (e) {
      throw e;
    }
  },
};
//------------------------------------------------------------------------------------------------
module.exports = NotificationService;
