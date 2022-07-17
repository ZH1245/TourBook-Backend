//------------------------------------------------------------------------------------------------
/*
 * Custom Tour Service
 */
//------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------
const pusher = require("../helpers/pusher");
const CustomTour = require("../models/CustomTour");
const UserModel = require("../models/UserModel");
const Notification = require("../models/Notifications");
//------------------------------------------------------------------------------------------------
const CustomTourService = {
  //------------------------------------------------------------------------------------------------
  // Send a Custom Tour Request to all Tour Operators
  requestCustomTour: async (data, user) => {
    let newrequest = await CustomTour.create({ ...data, by: user.id });
    let username = await UserModel.findById(user.id).select(["fname", "lname"]);
    let fullname = username.fname + " " + username.lname;
    let all_vendors = await UserModel.find({ userType: "vendor" }).select(
      "_id"
    );
    if (newrequest) {
      all_vendors.forEach(async (vendor) => {
        let notification = await Notification.create({
          userID: vendor._id,
          text: `There is a new CustomTour Request by ${fullname} for you.`,
          type: "customtour",
          contentID: newrequest._id,
        });
        pusher.trigger(`${vendor._id}`, "notifications", notification);
      });
      return newrequest;
    } else {
      let e = new Error("Cannot Create CustomTour in DB");
      e.statusCode = 400;
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  // Get Custom Tour Requests
  getCustomTourRequests: async (user) => {
    let e = new Error();
    let requests = await CustomTour.find({ fulfilledBy: null })
      .populate({
        path: "by",
        model: "users",
        select: ["fname", "phoneNumber", "email"],
      })
      .populate(["requirements.source", "requirements.destination"]);
    if (Object.keys(requests).length > 0) {
      let requests2 = requests.filter((req) => {
        return !req.hiddenFrom.includes(user.id);
      });
      return requests2;
    } else {
      e.message = "Not Found";
      e.statusCode = 404;
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  // Custom Tour Requests by Tourist ID
  getCustomTourRequestsBytouristID: async (id) => {
    let e = new Error();
    let myRequests = await CustomTour.find({ by: id })
      .populate({
        path: "by",
        model: "users",
        select: ["fname", "phoneNumber", "email"],
      })
      .populate({
        path: "fulfilledBy",
        model: "users",
        select: ["fname", "email", "lname"],
      })
      .populate(["requirements.source", "requirements.destination"]);
    console.log(myRequests);
    if (Object.keys(myRequests).length > 0) {
      return myRequests;
    } else {
      e.message = "Not Found";
      e.statusCode = 404;
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  // GET CustomTours that are fulfilled by Those Tour Operators whose Offered were accepted by Tourists
  getCustomTourRequestByVendorID: async (data) => {
    let e = new Error();
    let myRequests = await CustomTour.find({ fulfilledBy: data.vendorID })
      .populate({
        path: "by",
        model: "users",
        select: ["fname", "phoneNumber", "email"],
      })
      .populate({
        path: "fulfilledBy",
        model: "users",
        select: ["fname", "phoneNumber", "email"],
      })
      .populate(["requirements.source", "requirements.destination"]);
    if (Object.keys(myRequests).length > 0) {
      return myRequests;
    } else {
      e.message = "Not Found";
      e.statusCode = 404;
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  // Get CustomTour by ID
  getCustomTourRequestByID: async (id) => {
    let e = new Error();
    let requests = await CustomTour.findById(id)
      .populate({
        path: "by",
        model: "users",
        select: ["fname", "phoneNumber", "email"],
      })
      .populate(["requirements.source", "requirements.destination"]);
    if (requests) {
      return requests;
    } else {
      e.message = "Not Found";
      e.statusCode = 404;
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  // Accept Custom Tour Request. **DEPRECIATED**
  acceptCustomTourRequest: async (data, user) => {
    let e = new Error();
    let request = await CustomTour.findOne({ _id: data.id, fulfilledBy: null })
      .populate({
        path: "by",
        model: "users",
        select: ["fname", "phoneNumber", "email"],
      })
      .populate(["requirements.source", "requirements.destination"]);
    if (request) {
      request.fulfilledBy = user.id;
      request.amountTaken = data?.amountTaken;
      await request.save();
      return request;
    } else {
      e.message = "Not Found";
      e.statusCode = 404;
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  // Delete Custom Tour Request. **DEPRECIATED**
  deleteCustomTourRequest: async (data, user) => {
    let e = new Error();
    let request = await CustomTour.findById(data.id).populate([
      "requirements.source",
      "requirements.destination",
    ]);
    if (request) {
      if (String(user.id) == String(request.by._id)) {
        await request.delete();
        return true;
      } else {
        e.message = "You Cannot do that";
        e.statusCode = 400;
        throw e;
      }
    } else {
      e.message = "Not Found";
      e.statusCode = 404;
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  // Delete My Custom Tour Requests. FUTURE
  deleteAllMyRequests: async (user) => {
    let e = new Error();
    let myRequests = await CustomTour.find({ by: user.id });
    if (myRequests) {
      await myRequests.delete();
      return true;
    } else {
      e.message = "Not Found";
      e.statusCode = 404;
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  // Give Offer against some CustomTour
  giveOffer: async (data, user) => {
    let customTourReq = await CustomTour.findById(data.requestID);
    if (customTourReq) {
      let vendor = await UserModel.findById(user.id).select(["fname", "lname"]);
      let offers = customTourReq.offers;
      let offer = {};
      offer.date = Date.now();
      offer.amount = Number(data.amount);
      offer.vendorID = user.id;
      offer.description = data.description;
      if (!offers.includes(offer)) {
        offers.push(offer);
      }
      customTourReq.offers = offers;
      await customTourReq.save();
      // Sending Notification to user that he/she got an offer on his/her Custom Tour request
      let notification = await Notification.create({
        text: `${vendor.fname} ${vendor.lname} gave you an offer of RS${offer.amount} on your Custom Tour Request of ${customTourReq.description}`,
        userID: customTourReq.by,
        contentID: customTourReq._id,
        type: "customtour",
      });
      pusher.trigger(`${customTourReq.by}`, "notifications", notification);
      return true;
    } else {
      let e = new Error("Not Found");
      e.statusCode = 404;
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  // Accept Offer of specific Tour Opertor
  acceptOffer: async (data, user) => {
    let customTourReq = await CustomTour.findById(data.requestID);
    if (customTourReq) {
      let offers = customTourReq.offers;
      let offer = offers.filter((offer) => offer.vendorID == data.vendorID);

      customTourReq.offers = [];
      customTourReq.fulfilledBy = offer[0].vendorID;
      customTourReq.agreedAmount = offer[0].amount;
      let user = await UserModel.findById(customTourReq.by).select([
        "fname",
        "lname",
      ]);
      let fullname = user.fname + " " + user.lname;
      // Sending Notification to Tour Operator that user accepted the offer
      let notification = await Notification.create({
        userID: offer[0].vendorID,
        text: `${fullname} just Accepted your Custom Tour Offer of RS ${offer[0].amount} on ${customTourReq.requirements.description}`,
        contentID: customTourReq._id,
        type: "customtour",
      });
      pusher.trigger(`${offer[0].vendorID}`, "notifications", notification);
      await customTourReq.save();
    } else {
      let e = new Error("Not Found");
      e.statusCode = 404;
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  // Reject Offer so that it will not be shown on Tour Operator Dashboard
  rejectOffer: async (data, user) => {
    let customTour = await CustomTour.findbyId(data.id);
    if (customTour) {
      let hidden = customTour.hiddenFrom;
      customTour.hiddenFrom = [...hidden, user.id];
      await customTour.save();
      return true;
    } else {
      let e = new Error("Not Found");
      e.statusCode = 404;
      throw e;
    }
  },
};
//------------------------------------------------------------------------------------------------
module.exports = CustomTourService;
