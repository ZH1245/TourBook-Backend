//------------------------------------------------------------------------------------------------
/*
 * Tour Service
 */
//------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------
const TourModel = require("../models/TourPack");
const UserModel = require("../models/UserModel");
const OrderModel = require("../models/Orders");
const pusher = require("../helpers/pusher");
const Notification = require("../models/Notifications");
//------------------------------------------------------------------------------------------------

module.exports = {
  //------------------------------------------------------------------------------------------------
  // Mark Tour as COMPLETED
  markAsDone: async (tourID, user) => {
    let tour = await TourModel.findById(tourID);
    let updated = await tour.update({ isCompleted: true });
    let orders = await OrderModel.find({
      tourID: tourID,
      isApproved: true,
      isRefunded: false,
    }).select("touristID");
    orders.forEach(async (order) => {
      let notification = await Notification.create({
        text: `How was your Tour ${tour.name}? Please provide feedback.`,
        contentID: tour._id,
        userID: order.touristID,
        type: "tour",
      });
      pusher.trigger(`${order.touristID}`, "notifications", notification);
    });
  },
  //------------------------------------------------------------------------------------------------
  // Get all tours
  getTours: async () => {
    let tours = await TourModel.find({
      seats: { $gt: 0 },
      startDate: { $gte: Date.now() },
    }).populate(["source", "destination"]);
    let latestTours = await TourModel.find({
      seats: { $gt: 0 },
      startDate: { $gte: Date.now() },
    })
      .select(["tourpics", "vendorID", "seats", "name", "price"])
      .sort("-createdAt")
      .limit(5);
    if (Object.keys(tours).length > 0) {
      return { tours, carousal: latestTours };
    } else {
      let e = new Error();
      e.message = "No Tours FOUND";
      e.statusCode = 404;
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  // Get Personalized Tours
  home: async (body, user) => {
    try {
      let user1 = await UserModel.findById(user.id).select([
        "source",
        "destination",
      ]);
      let cityTours = await TourModel.find({ source: user1.city }).populate([
        "source",
        "destination",
      ]);
      let popularTours = await TourModel.find({
        rating: { $gt: 3 },
        source: user1.city,
      }).populate(["source", "destination"]);
      let tours = {
        cityTours: cityTours,
        popularTours: popularTours,
      };
      return tours;
    } catch (e) {
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  // Get Tour By ID
  getToursByID: async (id, user) => {
    let touristApproved = false;

    let tours = await TourModel.findById(id)
      .populate(["source", "destination"])
      .populate({
        path: "vendorID",
        model: "users",
        select: ["fname", "lname", "email", "profilePicture"],
      });
    if (tours) {
      if (user) {
        let order = await OrderModel.find({ touristID: user.id });
        if (order) {
          if (order?.isApproved) {
            touristApproved = true;
          }
        }
      }
      return { tours, touristApproved: touristApproved };
    } else {
      let e = new Error();
      e.message = `Tour Not Found by id ${id}`;
      e.statusCode = 404;
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  // GET my Tours
  getMyTours: async (user) => {
    let tours = await TourModel.find({ vendorID: user.id }).populate([
      "source",
      "destination",
    ]);
    if (tours) {
      return tours;
    } else {
      let e = new Error();
      e.message = "Not Found";
      e.statusCode = 404;
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  // Get Tours By Name
  getToursByName: async (name) => {
    let tours = await TourModel.find({ name: name });
    if (Object.keys(tours).length > 0) return tours;
    else {
      let e = new Error();
      e.message = `No Tours Found with name ${name}`;
      e.statusCode = 404;
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  // Get Tours by Vendor Ratings
  getToursByStoreRating: async (rating) => {
    let vendors = await UserModel.find({ role: "vendor", rating: rating });
    let tours = await TourModel.find({ vendorID: vendors._id });
    if (Object.keys(tours) > 0) return tours;
    else {
      let e = new Error();
      e.messag = `Tours with ratings ${rating} not Found`;
      e.statusCode = 404;
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  // GET Tours by Price
  getToursByPrice: async (price) => {
    let tours = await TourModel.find({ price: price });
    if (Object.keys(tours).length > 0) {
      return tours;
    } else {
      let e = new Error();
      e.message = `No Tours found with price ${price}`;
      e.statusCode = 404;
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  // Get Tours by CITY
  getToursByCity: async (source) => {
    let tours = await TourModel.find({ source: source });
    if (Object.keys(tours).length > 0) {
      return tours;
    } else {
      let e = new Error();
      e.message = `No Tours found in city : ${city}`;
      e.statusCode = 404;
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  // GET Tours in Price Range, QUERY
  getToursInPriceRange: async (data) => {
    let tours = await TourModel.find({
      price: { $gte: data.range1, $lte: data.range2 },
    });
    if (Object.keys(tours).length > 0) {
      return tours;
    } else {
      let e = new Error();
      e.message = `No Tours Found with price range ${
        data.range1 + " <-> " + data.range2
      }`;
      e.statusCode = 404;
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  // GET Tours from Source to Destination. QUERY
  getToursFromSourcetoDestination: async (data) => {
    let tours = await TourModel.find({
      source: data.source,
      destination: data.destination,
    });
    if (Object.keys(tours) > 0) {
      return tours;
    } else {
      let e = new Error();
      e.message = `No Tours Found from ${data.source} to ${data.destination}`;
      e.statusCode = 404;
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  // CREATE Tour
  createTour: async (req) => {
    try {
      req.body.meetLocation = JSON.parse(req.body.meetLocation);
      req.body.places = JSON.parse(req.body.places);
      const files = req.files.multiImages;
      const imageNames = [];
      const addedOn = Date.now();
      if (files.length > 0) {
        await Promise.all(
          files.map(async (file) => {
            // const data = await cloudinary.uploader.upload(file.path);
            imageNames.push(data.url);
          })
        );
      } else {
        // const data = await cloudinary.uploader.upload(files.path);
        imageNames.push(data.url);
      }
      req.body.validTill = new Date(req.body.validTill);
      const newTour = await TourModel({
        ...req.body,
        vendorID: req.user.id,
        tourpics: imageNames,
        places: req.body.places,
        addedOn: addedOn,
      });
      await newTour.save();
      return newTour;
    } catch (e) {
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  // Delete Tour
  deleteTours: async (id) => {
    let tour = await TourModel.findById(id);
    if (!tour) {
      let e = new Error();
      e.message = `Tour Not Found`;
      e.statusCode = 404;
      throw e;
    } else {
      if (tour.vendorID === data.vendorID && tour.isCompleted == false) {
        await TourModel.deleteOne(tour);
        return true;
      } else {
        let e = new Error();
        e.message = "You are Not Allowed to Do That";
        e.statusCode = 400;
        throw e;
      }
    }
  },
  //------------------------------------------------------------------------------------------------
  // Edit tour Details
  editTour: async (data) => {
    let existingTour = module.exports.getToursByID(data.id);
    if (!existingTour) {
      let e = new Error();
      e.message = `Tour Not Found to Edit`;
      e.statusCode = 404;
      throw e;
    } else {
      if (existingTour.vendorID === user.id) {
        let newTour = await TourModel.findOneAndReplace(
          { _id: data.id },
          ...data
        );
        let notification = await Notification.create({
          text: `Your Tour ${tour.name} Info was edited`,
          contentID: tour._id,
          userID: existingTour.vendorID,
          type: "tour",
        });
        pusher.trigger(
          `${existingTour.vendorID}`,
          "notifications",
          notification
        );
        return newTour;
      } else {
        let e = new Error();
        e.message = `You cannot DO THAT!`;
        e.statusCode = 400;
        throw e;
      }
    }
  },
  //------------------------------------------------------------------------------------------------
  // FILTER SEARCH TOURS
  TripFilterSearch: async (data) => {
    let tours = await TourModel.find({ data }).populate([
      "source",
      "destination",
    ]);
    if (tours) {
      return tours;
    } else {
      let e = new Error();
      e.message = "Not Found";
      e.statusCode = 404;
      throw e;
    }
  },
};
//------------------------------------------------------------------------------------------------
