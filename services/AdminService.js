// ---------------------------------------------------------------------------
/*
 * Admin Actions that can be performed By Admin
 */
// ---------------------------------------------------------------------------
const UserModel = require("../models/UserModel");
const OrderService = require("../services/OrderService");
const UserService = require("../services/UserService");
const TransactionModel = require("../models/Transactions.model");
const TourPack = require("../models/TourPack");
const OrderModel = require("../models/Orders");
const pusher = require("../helpers/pusher");
// ---------------------------------------------------------------------------
module.exports = {
  // Get All Tour Operators Detail
  getVendors: async () => {
    let e = new Error();
    const vendors = await UserService.getVendors();
    if (vendors) {
      return vendors;
    } else {
      e.message = "No Vendors Found";
      e.statusCode = 404;
      throw e;
    }
  },
  // ---------------------------------------------------------------------------
  // Get Tour operators based on Ratings.
  getVendorswithRating: async (rating) => {
    let vendors = await UserService.getVendors();
    if (vendors) {
      let filtered = vendors.filter((item) => {
        return item.rating >= rating;
      });
      return filtered;
    } else {
      let e = new Error();
      e.message = `Vendors with rating ${rating} not found`;
      e.statusCode = 404;
      throw e;
    }
  },
  // ---------------------------------------------------------------------------
  //Get Any user by ID
  getanyUser: async (id) => {
    let e = new Error();
    let user = await UserService.getUserByID(id);
    if (user) {
      return user;
    } else {
      e.message = "User Not Found";
      e.statusCode = 404;
      throw e;
    }
  },
  // ---------------------------------------------------------------------------
  // Accept Tour Operator's SignUP Request
  acceptVendorRequest: async (id) => {
    let e = new Error();
    const vendor = await UserModel.findOne({ _id: id, isDeleted: false });
    if (vendor) {
      if (!vendor.isActive) {
        vendor.isActive = true;
        await vendor.save();
        return true;
      } else {
        e.message = "Vendor Already Active";
        e.statusCode = 400;
        throw e;
      }
    } else {
      e.message = "Vendor not found";
      e.statusCode = 404;
      throw e;
    }
  },
  // ---------------------------------------------------------------------------
  // Reject Tour Operator's Signup Request.
  rejectVendorRequest: async (id) => {
    let e = new Error();
    const vendor = await UserModel.findOne({ _id: id, isDeleted: false });
    if (vendor) {
      await vendor.remove();
      return true;
    } else {
      e.message = "Vendor Already Deleted or Rejected";
      e.statusCode = 404;
      throw e;
    }
  },
  // ---------------------------------------------------------------------------
  // Accept all Pending Signup Requests.
  acceptAllPendingRequests: async () => {
    let requests = await module.exports.getpendingVendorsRequests();
    requests.forEach(async (request) => {
      await UserModel.updateOne({ _id: request._id }, { isActive: true });
    });
    return true;
  },
  // ---------------------------------------------------------------------------
  // Accept Admin Signup Requests
  pendingAdminRequests: async () => {
    let admins = await UserService.getPendingAdmins();
    if (admins) {
      return admins;
    } else {
      let e = new Error("Not Found");
      e.statusCode = 404;
      throw e;
    }
  },
  // ---------------------------------------------------------------------------
  // Get Pending Tour Operators Requests
  getpendingVendorsRequests: async () => {
    let vendors = await UserService.getPendingVendors();
    if (vendors) {
      return vendors;
    } else {
      let e = new Error();
      e.message = "No Vendors Found";
      e.statusCode = 404;
      throw e;
    }
  },
  // ---------------------------------------------------------------------------
  // Block user from TourBook
  blockUser: async (userID) => {
    try {
      let user = UserService.blockUser(userID);
      let e = new Error();
      if (user) {
        return true;
      } else throw e;
    } catch (e) {
      throw e;
    }
  },
  // ---------------------------------------------------------------------------
  // Unblock User
  unBlockUser: async (userID) => {
    try {
      let user = UserService.unBlockUser(userID);
      let e = new Error();
      if (user) {
        return true;
      } else throw e;
    } catch (e) {
      throw e;
    }
  },
  // ---------------------------------------------------------------------------
  // Get Admin DashBoard
  getDashboard: async (user) => {
    let dashboard = {};
    // Get Pending Tour Operator Signup Requests ->
    let pendingVendorRequests =
      await module.exports.getpendingVendorsRequests();
    // Get Pending Admin Signup Requests ->
    let pendingAdminRequests = await UserService.getPendingAdmins();
    // Get Total No of users for Analytics ->
    let totalNoOfUsers = await UserModel.find({ isDeleted: false }).count();
    // Get Total No of Active users for Analytics ->
    let totalNoOfActiveUsers = await UserModel.find({
      isActive: true,
      isDeleted: false,
    }).count();
    // Get Total No of Deleted users for Analytics ->
    let totalNoOfDeletedUsers = await UserModel.find({
      isDeleted: true,
    }).count();
    // Get All users Data ->
    let allUsers = await UserService.getAll(user);
    // Get All active Users for Analytics ->
    let activeUsers = await UserModel.find({ isActive: true })
      .populate("city")
      .select("-password");
    // Get Total No of Credits Users Bought for Analytics ->
    let credits = await TransactionModel.find({ refunded: false });
    let totalCredits = 0;
    credits.forEach((credit) => {
      totalCredits += credit.RechargedAmount;
    });
    // Get Total No of Tours Created by Tour Operators for Analytics ->
    let totalTours = await TourPack.find({}).count();
    // Get Total No of Ongoing Tours for Analytics ->
    let totalOngoingTours = await OrderModel.find({
      isApproved: true,
      isRefunded: false,
    }).count();
    dashboard.totalNoOfUsers = totalNoOfUsers;
    dashboard.pendingAdminRequests = pendingAdminRequests;
    dashboard.pendingVendorRequests = pendingVendorRequests;
    dashboard.totalNoOfActiveUsers = totalNoOfActiveUsers;
    dashboard.totalNoOfDeletedUsers = totalNoOfDeletedUsers;
    dashboard.allUsers = allUsers;
    dashboard.totalNoOfTours = totalTours;
    dashboard.totalOngoingTours = totalOngoingTours;
    dashboard.totalCredits = totalCredits;
    dashboard.activeUsers = activeUsers;
    return dashboard;
  },
  // ---------------------------------------------------------------------------
  deleteUser: async (id) => {
    // Delete User ->
    let existingUser = await UserService.getUserByID(id);
    let e = new Error();
    if (existingUser) {
      if (!existingUser.isDeleted) {
        await UserModel.updateOne(
          { _id: id },
          { isActive: false, isDeleted: true }
        );
        return true;
      }
      if (existingUser.isDeleted) {
        e.message = "AlreadyDeleted";
        e.statusCode = 400;
        throw e;
      }
    } else {
      e.message = "Not Found";
      e.statusCode = 404;
      throw e;
    }
  },
  // ---------------------------------------------------------------------------
  // Refund Order ->
  refundPackageByID: async (id) => {
    let package = await OrderService.refundOrder(id);
    pusher.trigger(`${order.touristID}`, "notifications", {
      date: Date.now(),
      text: `Your order of RS ${order.amount} has been refunded by TourBook.`,
    });
    if (package) return true;
    else {
      let e = new Error("Not Found");
      e.statusCode = 404;
      throw e;
    }
  },
  // ---------------------------------------------------------------------------
  // Refund a Specific Tour for all Tourists ->
  refundallTouristbyPackageID: async (id) => {
    let orders = await OrderService.getOrdersByTourID(id);
    orders.forEach((order) => {
      if (!order.isrefunded) this.refundPackageByID(order._id);
    });
    return true;
  },
};
//------------------------------------------------------------------------------------------------
