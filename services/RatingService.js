//------------------------------------------------------------------------------------------------
/*
 * Rating Service
 */
//------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------
const RatingModel = require("../models/Rating");
const TourPack = require("../models/TourPack");
const UserModel = require("../models/UserModel");
//------------------------------------------------------------------------------------------------
module.exports = {
  //------------------------------------------------------------------------------------------------
  getRatingsByID: async (id) => {
    let rating = await RatingModel.findById(id).select(["message", "ratings"]);
    if (rating) {
      return rating;
    } else {
      let e = new Error();
      e.message = `Not Found`;
      e.statusCode = 404;
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  getAllRatings: async () => {
    let ratings = RatingModel.find({});
    if (Object.keys(ratings).length > 0) {
      return ratings;
    } else {
      let e = new Error();
      e.message = `Ratings Not FOUND`;
      e.statusCode = 404;
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  getRatingsByTourID: async (data) => {
    let tourRating = await RatingModel.find({ tourID: data.tourID });
    if (Object.keys(tourRating) > 0) {
      return tourRating;
    } else {
      let e = new Error();
      e.message = `No Ratings Found`;
      e.statusCode = 404;
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  getRatingsByVendorID: async (data) => {
    let tourRating = await RatingModel.find({ vendorID: data.vendorID });
    if (Object.keys(tourRating) > 0) {
      return tourRating;
    } else {
      let e = new Error();
      e.message = `No Ratings Found`;
      e.statusCode = 404;
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  getRatingsByTouristID: async (data) => {
    let touristRatings = await RatingModel.find({ touristID: data.touristID });
    if (Object.keys(touristRatings) > 0) {
      return touristRatings;
    } else {
      let e = new Error();
      e.message = `No Ratings Found`;
      e.statusCode = 404;
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  getRatingsByValue: async (data) => {
    let comments = await RatingModel.find({ rating: data.ratings });
    if (Object.keys(comments) > 0) {
      return comments;
    } else {
      let e = new Error();
      e.message = `No Ratings Found`;
      e.statusCode = 404;
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  getRatings: async (query) => {
    let finalQuery = {};
    if (query?.touristid) {
      finalQuery.touristID = query?.touristid;
    }
    if (query?.rating) {
      finalQuery.rating = query?.rating;
    }
    if (query?.to) {
      finalQuery.to = query?.to;
    }
    if (query?.tourid) {
      finalQuery.tourID = query?.tourid;
    }
    console.log(finalQuery);
    if (Object.keys(finalQuery).length > 0) {
      let results = await RatingModel.find(finalQuery).select([
        "message",
        "rating",
      ]);
      if (results) {
        return results;
      } else {
        let e = new Error("Not Found");
        e.statusCode = 404;
        throw e;
      }
    } else {
      let e = new Error("PLease enter query Params");
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  addRatings: async (data, user) => {
    let existingRating = await RatingModel.findOne({
      touristID: user.id,
      tourID: data.tourID,
    }).select(["rating", "message"]);
    if (existingRating) {
      return existingRating;
    } else {
      let vendor = await TourPack.findById(data.tourID).select("vendorID");
      let newRatings = await RatingModel({
        tourID: data.tourID,
        message: data.message,
        rating: data.rating,
        touristID: user.id,
        vendorID: vendor.vendorID,
      });
      await newRatings.save();
      return newRatings;
    }
  },
  //------------------------------------------------------------------------------------------------
  updateVendorRatings: async (data) => {
    let exitinguser = await UserModel.findById(data);
    let ratings = await RatingModel.find({ vendorID: data });
    let average = 0;
    if (ratings) {
      ratings.map((item) => {
        average += item.rating;
      });
      average = average / ratings.length;
      exitinguser.update({ rating: average });
    }
    return;
  },
  //------------------------------------------------------------------------------------------------
  editRatings: async (data) => {
    let existingRating = await this.getRatingsByID(data.id);
    if (existingRating) {
      let newDetails = await RatingModel.findOneAndReplace(
        { _id: existingRating._id },
        {
          touristID: data.touristID,
          tourID: data.tourID,
          rating: data.rating,
          message: data.message,
        }
      );
      module.exports.updateVendorRatings(data.vendorID);
      return newDetails;
    } else {
      let e = new Error();
      e.message = `Not Found`;
      e.statusCode = 404;
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  deleteRating: async (data) => {
    let existingRating = await RatingModel.findOneAndDelete({
      _id: data.id,
    }).select(["message", "rating"]);
    if (existingRating) {
      return existingRating;
    } else {
      let e = new Error();
      e.message = `Ratings not Found To be Deleted`;
      e.statusCode = 404;
      throw e;
    }
  },
};
//------------------------------------------------------------------------------------------------
