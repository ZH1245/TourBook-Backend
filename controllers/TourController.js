//--------------------------------------------------------------------------------------------------
/*
 * TOUR Controller Containing Try, Catch of Services
 */
//--------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------
const TourModel = require("../models/TourPack");
const TourService = require("../services/TourService");
const Joi = require("joi");
//--------------------------------------------------------------------------------------------------
module.exports = {
  //--------------------------------------------------------------------------------------------------
  edit: async (req, res) => {
    try {
      let user = req?.user;
      let edited = await TourService.editTour(req.body, user);
      return res.send({ data: edited, message: "Edited" });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e?.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  markAsDone: async (req, res) => {
    try {
      const schema = Joi.object({
        tourID: Joi.string()
          .required()
          .error(() => {
            return Error("Please Provide tourID");
          }),
      });
      await schema.validateAsync(req.body);
      let tour = await TourService.markAsDone(req.body.tourID, req.user);
      res.send({ data: tour, message: "Marked as Completed" });
    } catch (e) {
      res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e?.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  getTour: async (req, res) => {
    try {
      let query = {};
      if (req.query?.id) {
        query._id = req.query?.id;
      }
      if (req.query?.name) {
        query.name = req.query?.name;
      }
      if (req.query?.city) {
        query.city = req.query?.city;
      }
      if (req.query?.source) {
        query.source = req.query?.source;
      }
      if (req.query?.destination) {
        query.destination = req.query?.destination;
      }
      if (req.query?.addedOn) {
        query.addedOn = req.query?.addedOn;
      }
      if (req.query?.seats) {
        query.seats = req.query?.seats;
      }
      if (req.query?.vendorId) {
        query.vendorId = req.query?.vendorId;
      }
      if (req.query?.price) {
        query.price = req.query?.price;
      }
      if (Object.keys(query).length > 0) {
        const existingTours = await TourModel.find(query).select(["-duration"]);
        if (existingTours.length > 0) {
          return res
            .status(200)
            .send({ message: "FOUND", data: existingTours });
        } else {
          return res.status(404).send("NOT FOUND");
        }
      } else {
        throw Error("Please Enter Query Params");
      }
    } catch (e) {
      return res.status(400).send(e.message);
    }
  },
  //--------------------------------------------------------------------------------------------------
  getmyTours: async (req, res) => {
    try {
      const tours = await TourService.getMyTours(req.user);
      return res.status(200).send({ data: tours, message: "Fetched" });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  createTour: async (req, res) => {
    try {
      const schema = Joi.object({
        meetLocation: Joi.string()
          .required()
          .error(() => {
            return Error("Please Provide meetLocation");
          }),
        places: Joi.string()
          .required()
          .error(() => {
            return Error("Please Provide places you will be visiting");
          }),
        validTill: Joi.date()
          .required()
          .error(() => {
            return Error(
              "Please Provide Date on which tour booking will expire"
            );
          }),
        name: Joi.string().required().min(10).messages({
          "any.required": "Please Provide name of tour",
          "string.min": "Name must be greater than 10 characters",
        }),
        price: Joi.number().min(700).required().messages({
          "any.required": "Please Provide price of tour",
          "number.min": "Price must be greater than 700",
        }),
        source: Joi.string()
          .required()
          .error(() => {
            return Error("Please Provide source city");
          }),
        destination: Joi.string()
          .required()
          .error(() => {
            return Error("Please Provide destination city");
          }),
        startDate: Joi.date()
          .required()
          .error(() => {
            return Error("Please Provide date when the tour will start");
          }),
        seats: Joi.number().min(2).required().messages({
          "any.required": "Please Provide seats",
          "number.min": "Seats must be greater than 2",
        }),
        hasGuide: Joi.boolean()
          .required()
          .error(() => {
            return Error("Please Provide Guide Requirement");
          }),
        hasFood: Joi.boolean()
          .required()
          .error(() => {
            return Error("Please Provide Food Requirement");
          }),
        hasHotel: Joi.boolean()
          .required()
          .error(() => {
            return Error("Please Provide Hotel Requirement");
          }),
        hasTransport: Joi.boolean()
          .required()
          .error(() => {
            return Error("Please Provide Transport Requirement");
          }),
        description: Joi.string()
          .required()
          .error(() => {
            return Error("Please Provide description");
          }),
      });
      await schema.validateAsync(req.body);
      let tours = await TourService.createTour(req);
      return res.status(200).send({ data: tours, message: "Created" });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  deleteTours: async (req, res) => {
    try {
      const schema = Joi.object({
        id: Joi.string()
          .required()
          .error(() => {
            return Error("Please Provide id");
          }),
      });
      await schema.validateAsync(req.body);
      let { id } = req.body;
      const tourToDelete = await TourService.deleteTours(id);
      return res.send({ data: tourToDelete, message: "Deleted" });
    } catch (e) {
      return res.status(400).send({ message: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  getAll: async (req, res) => {
    try {
      let tours = await TourService.getTours();
      return res.status(200).send({ data: tours, message: "Fetched" });
    } catch (e) {
      res.status(e?.statusCode || 400).send({ data: null, message: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  getTourByID: async (req, res) => {
    try {
      const schema = Joi.object({
        id: Joi.string()
          .required()
          .error(() => {
            return Error("Please Provide id");
          }),
      });
      await schema.validateAsync(req.params);
      let { id } = req.params;
      let user = req?.user;
      let tour = await TourService.getToursByID(id, user);
      return res.status(200).send({ data: tour, message: "Fetched" });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  filterTourSearch: async (req, res) => {
    try {
      let query = {};
      if (req?.query?.source) {
        query.source = req?.query?.source;
      }
      if (req?.query?.destination) {
        query.destination = req?.query?.destination;
      }
      if (req?.query?.price) {
        query.price = req?.query?.price;
      }
      if (req?.query?.seats) {
        query.seats = req?.query?.seats;
      }
      if (req?.query?.source) {
        query.source = req?.query?.source;
      }
      if (req?.query?.source) {
        query.source = req?.query?.source;
      }
      let tours = await TourService.TripFilterSearch(query);
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  home: async (req, res) => {
    try {
      let user = req.user;
      let tours = await TourService.home(req.body, user);
      return res.send({ data: tours, message: "Fetched" });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e.message });
    }
  },
};
//--------------------------------------------------------------------------------------------------
