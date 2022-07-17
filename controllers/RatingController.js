//--------------------------------------------------------------------------------------------------
/*
 * RATINGS Controller Containing Try, Catch of Services
 */
//--------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------
const RatingService = require("../services/RatingService");
const Orders = require("../models/Orders");
const Joi = require("joi");
//--------------------------------------------------------------------------------------------------

module.exports = {
  //--------------------------------------------------------------------------------------------------
  getRatingByVendorID: async (req, res) => {
    try {
      let ratings = await RatingService.getRatingsByVendorID(req.body);
      return res.send({ data: ratings, message: "Fetched" });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: e.data || null, message: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  addRating: async (req, res) => {
    try {
      let user = req.user;
      const schema = Joi.object({
        tourID: Joi.string()
          .required()
          .error(() => {
            return Error("Please Provide roomID");
          }),
        message: Joi.string()
          .required()
          .error(() => {
            return Error("Please Provide Feedback Message");
          }),
        rating: Joi.number().min(1).max(5).required().messages({
          "any.required": "Please Provide amount",
          "number.min": "Rating must be between 1 and 5",
          "number.max": "Rating must be between 1 and 5",
        }),
      });
      await schema.validateAsync(req.body);
      let newRating = await RatingService.addRatings(req.body, user);
      return res.send({ data: newRating, message: "Created" });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: e.data || null, message: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  getRatingByID: async (req, res) => {
    try {
      let rating = await RatingService.getRatingsByID(req.params.id);
      return res.send({ data: rating, message: "Fetched" });
    } catch (e) {
      res.status(e?.statusCode || 400).send({ data: null, message: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  getRating: async (req, res) => {
    try {
      let query = req.query;
      let rating = await RatingService.getRatings(query);
      res.send({ data: rating, message: "Fetched" });
    } catch (e) {
      res.status(e?.statusCode || 400).send({ data: null, message: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  deleteRating: async (req, res) => {
    try {
      const schema = Joi.object({
        id: Joi.string()
          .required()
          .error(() => {
            return Error("Please Provide id");
          }),
      });
      await schema.validateAsync(req.body);
      let rating = await RatingService.deleteRating(req.body);
      return res.send({ data: rating, message: "deleted" });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e.message });
    }
  },
};
//--------------------------------------------------------------------------------------------------
