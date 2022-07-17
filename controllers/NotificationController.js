//--------------------------------------------------------------------------------------------------
/*
 * Notifications Controller Containing Try, Catch of Services
 */
//--------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------
const NotificationService = require("../services/NotificationService");
const Joi = require("joi");
//--------------------------------------------------------------------------------------------------
const NotificationController = {
  //--------------------------------------------------------------------------------------------------
  getNotificationByID: async (req, res) => {
    try {
      const schema = Joi.object({
        id: Joi.string()
          .required()
          .error(() => {
            return Error("Please Provide id");
          }),
      });
      await schema.validateAsync(req.params);
      let id = req?.params?.id;
      let notification = await NotificationService.getNotificationByID(id);
      return res.send({ data: notification, message: "Fetched" });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e?.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  getMyNotifications: async (req, res) => {
    try {
      let user = req.user;
      let notifications = await NotificationService.getNotificationsByUserID(
        user
      );
      return res.send({ data: notifications, message: "Fetched Notificaions" });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e?.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  markAsread: async (req, res) => {
    try {
      const schema = Joi.object({
        notificationID: Joi.string()
          .required()
          .error(() => {
            return Error("Please Provide notificationID");
          }),
      });
      await schema.validateAsync(req.body);
      let { notificationID } = req.body;
      let status = await NotificationService.markAsread(notificationID);
      return res.send({
        data: status,
        message: `${status} Notifications Marked As Read!`,
      });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e?.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  markAllAsRead: async (req, res) => {
    try {
      let user = req.user;
      let status = await NotificationService.markAllAsRead(user);
      return res.send({
        data: status,
        message: `${
          status == 0
            ? "All Notifications are Already Marked As Read"
            : `${status} Notifications Marked As Read!`
        } `,
      });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e?.message });
    }
  },
};
//--------------------------------------------------------------------------------------------------
module.exports = NotificationController;
