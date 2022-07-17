//--------------------------------------------------------------------------------------------------
/*
 * Vendor Service
 */
//--------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------
const OrderService = require("./OrderService");
const OrderModel = require("../models/Orders");
const TourModel = require("../models/TourPack");
const { default: mongoose } = require("mongoose");
const CustomTour = require("../models/CustomTour");
const UserModel = require("../models/UserModel");
//--------------------------------------------------------------------------------------------------
module.exports = {
  //--------------------------------------------------------------------------------------------------
  //Get Vendor BY ID
  getVendorByID: async (id) => {
    let vendor = await UserModel.find({ _id: id, isDeleted: false }).select([
      "fname",
      "lname",
      "rating",
      "profilePicture",
      "email",
    ]);
    if (vendor) {
      let tours = await TourModel.find({ vendorID: id }).populate([
        "source",
        "destination",
      ]);
      if (tours) {
        return { vendor, tours };
      } else {
        return { vendor, tours: [] };
      }
    } else {
      let e = new Error("Not Found");
      e.statusCode = 404;
      throw e;
    }
  },
  //--------------------------------------------------------------------------------------------------
  // GET refund Tour Requests
  getRefundTourRequests: async (user) => {
    let refundRequests = await OrderService.getRefundRequestsByVendorID(user);
    if (refundRequests) {
      return refundRequests;
    } else {
      let e = new Error();
      e.message = "No Refund Requests";
      e.statusCode = 404;
      throw e;
    }
  },
  //--------------------------------------------------------------------------------------------------
  // GET Dashboard
  getDashboard: async (user) => {
    let dahsboard = {};
    let tours = await TourModel.find({ vendorID: user.id }).populate([
      "source",
      "destination",
    ]);
    let reservationRequests = await OrderModel.find({
      isApproved: false,
    })
      .populate(["tourID"])
      .populate({
        path: "touristID",
        model: "users",
        select: ["fname", "phoneNumber", "email", "profilePicture"],
      })
      .select(["-password"]);
    let resreq = [];
    reservationRequests = reservationRequests.map((item) => {
      if (String(item.tourID.vendorID) == String(user.id)) {
        resreq.push({
          _id: item._id,
          vendorID: item.tourID.vendorID,
          amount: item.amount,
          seats: item.seats,
          date: item.date,
          email: item.touristID.email,
          name: item.touristID.fname,
          touristID: item.touristID._id,
        });
      }
    });
    let refundRequests = await module.exports.getRefundTourRequests(user);
    let customTourRequests = await CustomTour.find({
      $or: [{ fulfilledBy: user.id }, { fulfilledBy: null }],
    })
      .populate([
        {
          path: "by",
          model: "users",
          select: ["fname", "phoneNumber", "email", "profilePicture", "lname"],
        },
      ])
      .populate({
        path: "fulfilledBy",
        model: "users",
        select: ["fname", "email", "lname"],
      });
    let approvedCustomTourRequests = await CustomTour.find({
      fulfilledBy: user.id,
    }).populate({
      path: "by",
      model: "users",
      select: ["fname", "phoneNumber", "email", "profilePicture", "lname"],
    });
    dahsboard.reservationRequests = resreq;
    dahsboard.refundRequests = refundRequests;
    dahsboard.myTours = tours;
    dahsboard.customTourRequests = customTourRequests;
    dahsboard.myApprovedCustomTours = approvedCustomTourRequests;
    return dahsboard;
  },
  //--------------------------------------------------------------------------------------------------
  // Reject Reservation Requests
  rejectReservationRequest: async (id, user) => {
    let requests = await OrderService.rejectTour(id);
    if (reqquests) return requests;
    else {
      let e = new Error("NOT FOUND");
      e.statusCode = 404;
      throw e;
    }
  },
};
//--------------------------------------------------------------------------------------------------
