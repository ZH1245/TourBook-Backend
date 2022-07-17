//------------------------------------------------------------------------------------------------
/*
 * Orders Service OF TOURS
 */
//------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------
const pusher = require("../helpers/pusher");
const OrderModel = require("../models/Orders");
const TourModel = require("../models/TourPack");
const UserModel = require("../models/UserModel");
const { sendInfoEmail } = require("./SendEmail");
const Notification = require("../models/Notifications");
//------------------------------------------------------------------------------------------------
module.exports = {
  //------------------------------------------------------------------------------------------------
  // Get Tour Orders
  getOrders: async () => {
    let existingOrders = await OrderModel.find({});
    if (Object.keys(existingOrders).length > 0) {
      return existingOrders;
    } else {
      let e = new Error();
      e.message = `Orders Not Found`;
      e.statusCode = 404;
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  // Get MY TOUR ORDERS
  getMyOrders: async (user) => {
    let orders = await OrderModel.find({ touristID: user.id })
      .populate({
        path: "tourID",
        model: "tours",
        select: ["name", "description", "vendorID"],
      })
      .populate({
        path: "tourID",
        populate: {
          path: "vendorID",
          model: "users",
          select: ["fname", "lname", "email"],
        },
      })
      .sort("-updatedAt");
    if (orders) {
      return orders;
    } else {
      let e = new Error();
      e.message = "No Orders Found";
      e.statusCode = 404;
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  // Get Order by ID
  getOrderByID: async (id) => {
    let existingOrder = await OrderModel.findById(id);
    if (existingOrder) {
      return existingOrder;
    } else {
      let e = new Error();
      e.message = `Orders Not Found`;
      e.statusCode = 404;
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  // Get Refund Requests of TOURS based on Vendor ID that Created that TOUR
  getRefundRequestsByVendorID: async (user) => {
    let existingOrder = await OrderModel.find({
      requestRefund: true,
    })
      .populate({
        path: "tourID",
        model: "tours",
        select: "vendorID",
      })
      .populate({
        path: "touristID",
        model: "users",
        select: ["fname", "email", "lname"],
      });
    if (existingOrder) {
      let requests = existingOrder.filter((req) => {
        return String(req.tourID.vendorID) == String(user.id);
      });
      console.log(requests);
      return requests;
    } else {
      let e = new Error();
      e.message = `Orders Not Found`;
      e.statusCode = 404;
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  // Get Orders by Vendor ID
  getOrderByVendorID: async (user) => {
    let existingOrder = await OrderModel.find({
      $where: () => {
        this.tourID.vendorID == user.id;
      },
    }).populate("tourID");
    if (existingOrder) {
      return existingOrder;
    } else {
      let e = new Error();
      e.message = `Orders Not Found`;
      e.statusCode = 404;
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  // Get Orders by Amount.  QUERY
  getOrdersByAmount: async (amount) => {
    let existingOrder = await OrderModel.find({ amount: amount });
    if (Object.keys(existingOrder).length > 0) {
      return existingOrder;
    } else {
      let e = new Error();
      e.message = `NOT FOUND`;
      e.statusCode = 404;
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  // Get Orders by Approval Status
  getOrdersByApporval: async (data) => {
    let orders = await OrderModel.find({ isApproved: data.approved });
    if (Object.keys(orders).length > 0) {
      return orders;
    } else {
      let e = new Error();
      e.message = `NOT FOUND`;
      e.statusCode = 404;
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  // Get Orders by Approval Status of that USER
  getOrdersByApporvalByTouristID: async (data) => {
    let orders = await OrderModel.find({
      isApproved: data.approved,
      touristID: data.touristID,
    });
    if (Object.keys(orders).length > 0) {
      return orders;
    } else {
      let e = new Error();
      e.message = `NOT FOUND`;
      e.statusCode = 404;
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  // GET Refunded Orders
  getRefundedOrders: async () => {
    let orders = await OrderModel.find({ isRefunded: true });
    if (Object.keys(orders).length > 0) {
      return orders;
    } else {
      let e = new Error();
      e.message = `NOT FOUND`;
      e.statusCode = 404;
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  // GET Refunded Orders by TourID
  getRefundedOrdersByTourID: async (id) => {
    let orders = await OrderModel.find({ tourID: id, isRefunded: true });
    if (Object.keys(orders).length > 0) {
      return orders;
    } else {
      let e = new Error();
      e.message = `NOT FOUND`;
      e.statusCode = 404;
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  // GET Refunded Orders by TouristID
  getRefundedOrdersByTouristID: async (id) => {
    let orders = await OrderModel.find({ touristID: id, isRefunded: true });
    if (Object.keys(orders).length > 0) {
      return orders;
    } else {
      let e = new Error();
      e.message = `NOT FOUND`;
      e.statusCode = 404;
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  // CREATE Tour RESERVATIONS
  createOrder: async (data, user) => {
    if (!data?.touristID && !user) {
      let e = new Error(
        "TouristID not found in body or the user is not logged in"
      );
      e.statusCode = 400;
      throw e;
    }
    // console.log(user.id);
    let existinguser = await UserModel.findById(user.id).select("balance");
    if (existinguser.balance >= data.amount) {
      let existingOrder = await OrderModel.findOne({
        tourID: data?.tourID,
        seats: data?.seats,
        amount: data?.amount,
        touristID: user?.id,
      });
      if (!existingOrder) {
        let tour = await TourModel.findById(data.tourID);
        if (tour?.seats >= data.seats) {
          tour.seats = tour.seats - data.seats;
          await tour.save();
          let newOrder = await OrderModel({
            tourID: data.tourID,
            seats: data.seats,
            amount: data.amount,
            touristID: user.id,
          });
          existinguser.balance =
            Number(existinguser.balance) - Number(newOrder.amount);
          await existinguser.save();
          await newOrder.save();
          let notification = await Notification.create({
            text: `Your Reservation Request for Tour ${tour.name} has been sent to Vendor for Approval!`,
            userID: user?.id,
            contentID: newOrder._id,
            type: "order",
          });
          pusher.trigger(`${user.id}`, "notifications", notification);
          return { order: newOrder, balance: existinguser.balance };
        } else {
          let e = new Error("Not Enough Seats Left");
          e.statusCode = 400;
          throw e;
        }
      } else {
        let e = new Error();
        e.message = `Already Exists`;
        e.statusCode = 400;
        throw e;
      }
    } else {
      let e = new Error("Not Enough Credits to Reserve Tour");
      e.statusCode = 400;
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  // Reject Tour Reservation Request
  rejectTour: async (data) => {
    let existingOrder = await OrderModel.findOneAndUpdate(
      { _id: data.id },
      { $set: { isApproved: false } }
    );
    if (existingOrder) {
      let user = await UserModel.findById(existingOrder.touristID);
      user.balance = user.balance + existingOrder.amount;
      let tour = await TourModel.findById(existingOrder.tourID);
      tour.seats = tour.seats + existingOrder.seats;
      await user.save();
      await tour.save();
      let notification = await Notification.create({
        text: `Your Tour Reservation request got rejected by vendor and the amount ${existingOrder.amount} has been refunded to your account.`,
        contentID: tour._id,
        type: "order",
        userID: user._id,
      });
      pusher.trigger(`${user._id}`, "notifications", notification);
      await existingOrder.delete();
      return true;
    } else {
      let e = new Error();
      e.message = `NOT FOUND`;
      e.statusCode = 404;
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  // Approve Tour Reservation
  approveTour: async (data, usert) => {
    let existingOrder = await OrderModel.findOneAndUpdate(
      { _id: data.id },
      { $set: { isApproved: true } }
    );
    if (existingOrder) {
      let vendor = await UserModel.findById(usert.id);
      vendor.balance = vendor.balance + existingOrder.amount;
      await vendor.save();
      let user = await UserModel.findById(existingOrder.touristID);
      let tour = await TourModel.findById(existingOrder.tourID);
      try {
        await sendInfoEmail({
          email: user.email,
          name: `${user.fname} ${user.lname}`,
          html: `<div style={{textAlign:"center"}}>Dear ${user.fname} ${user.lname}! <br/>Your Tour <b>${tour.name}</b> has been approved<br/>For Further details visit TourBook<br/>Thank You</div>`,
          subject: `TourBook : Your Tour got approved`,
        });
        let notification = await Notification.create({
          text: `Your Tour ${tour.name} with charges ${existingOrder.amount} got Approved!`,
          userID: user._id,
          type: "order",
          contentID: tour._id,
        });
        pusher.trigger(`${user._id}`, "notifications", notification);
      } catch (e) {
        throw e;
      }
      return true;
    } else {
      let e = new Error();
      e.message = `NOT FOUND`;
      e.statusCode = 404;
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  // GET orders by touristID
  getOrdersByTouristID: async (data) => {
    let orders = await OrderModel.find({ touristID: data });
    if (Object.keys(orders) > 0) {
      return orders;
    } else {
      let e = new Error();
      e.message = `No Tours Found for Tourist ${data}`;
      e.statusCode = 404;
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  // REJECT Tour Refund Request
  rejectRefundRequest: async (data) => {
    let approval = await OrderModel.find({ _id: data.id, requestRefund: true });
    let tour = await TourModel.findById(order.tourID);
    if (Date.now() > tour.validTill) {
      let e = new Error();
      e.message = "Cannot Refund Order as it has Already Been Past the Date";
      e.statusCode = 404;
      approval.requestRefund = false;
      await approval.save();
      throw e;
    } else {
      approval.requestRefund = false;
      await approval.save();
      return true;
    }
  },
  //------------------------------------------------------------------------------------------------
  // REFUND Tour
  refundOrder: async (data, user) => {
    let existingOrder = await OrderModel.findOne({
      _id: data.id,
      isRefunded: false,
      requestRefund: true,
    });
    if (existingOrder) {
      let vendor = await UserModel.findById(user.id);
      let userToRefund = await UserModel.findById(existingOrder.touristID);
      if (vendor.balance >= existingOrder.amount) {
        vendor.balance = vendor.balance - existingOrder.amount;
        await vendor.save();
        await UserModel.updateOne(
          { _id: existingOrder.touristID },
          {
            $set: {
              balance:
                Number(userToRefund.balance) + Number(existingOrder.amount),
            },
          }
        );
        let refunded = await OrderModel.updateOne(
          { _id: data.id },
          {
            $set: {
              isRefunded: true,
              refundAmount: Number(existingOrder.amount),
            },
          }
        );
        let tour = await TourModel.findById(existingOrder.tourID);
        tour.seats = tour.seats + existingOrder.seats;
        await tour.save();
        userToRefund = await UserModel.findById(existingOrder.touristID);
        let notification = await Notification.create({
          text: `Your Refund Tour Request for tour ${tour.name} and seats ${existingOrder.seats} and price ${existingOrder.amount} just got approved!`,
          type: "order",
          userID: userToRefund._id,
          contentID: tour._id,
        });
        pusher.trigger(`${userToRefund._id}`, "notifications", notification);
        return { data: true, balance: userToRefund.balance };
      } else {
        let e = new Error("Not Enough Balance to Refund!");
        e.statusCode = 400;
        throw e;
      }
    } else {
      let e = new Error();
      e.message = `Either the Order was already Refunded or Not Found`;
      e.statusCode = 404;
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  // GET Orders by TOURID
  getOrdersByTourID: async (id) => {
    const orders = await OrderModel.find({ tourID: id });
    if (orders) {
      return orders;
    } else {
      let e = new Error();
      e.message = "not FOund";
      e.statusCode = 404;
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  // Request Refund of Tour
  requestRefund: async (body, user) => {
    let order = await OrderModel.findOneAndUpdate(
      { _id: body.orderID, touristID: user.id },
      { $set: { requestRefund: true } }
    ).populate("tourID");
    if (order) {
      let tour = await TourModel.findById(order.tourID).select("startDate");
      if (new Date.now() < new Date(tour.startDate)) {
        let tourist = await UserModel.findById(order.touristID).select([
          "fname",
          "lname",
        ]);
        let fullname = tourist.fname + " " + tourist.lname;
        let notification = await Notification.create({
          text: `${fullname} just requested a refund on your Tour ${order.tourID.name} of RS ${order.amount}`,
          type: "order",
          userID: order.tourID.vendorID,
          contentID: order._id,
        });
        pusher.trigger(
          `${order.tourID.vendorID}`,
          "notifications",
          notification
        );
        return true;
      } else {
        let e = new Error(
          "The Respective Tour has already passed Due Date. You cannot request Refund now!"
        );
        throw e;
      }
    } else {
      let e = new Error("Not Found");
      e.statusCode = 404;
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  // GET Pending Reservation Requests of that Tour Operator
  getPendingReservationRequests: async (user) => {
    let requests = await OrderModel.find({
      "tourID.vendorID": user.id,
      isApproved: false,
      isRefunded: false,
    })
      .populate(["tourID", "touristID"])
      .select("-password");
    if (requests) return requests;
    else {
      let e = new Error("Not Found");
      e.statusCode = 404;
      throw e;
    }
  },
};
//------------------------------------------------------------------------------------------------
