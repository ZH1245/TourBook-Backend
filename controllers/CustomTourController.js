//--------------------------------------------------------------------------------------------------
/*
 * CustomTour Controller Containing Try, Catch of Services
 */
//--------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------
const CustomTourService = require("../services/CustomTourService");
const CustomTour = require("../services/CustomTourService");
const Joi = require("joi");
//--------------------------------------------------------------------------------------------------
module.exports = {
  //--------------------------------------------------------------------------------------------------
  requestCustomTour: async (req, res) => {
    try {
      console.log("CUSTOM TOUR REQ", req.body);
      const schema = Joi.object({
        requirements: Joi.object().keys({
          maxBudget: Joi.number().min(100).max(99999).required().messages({
            "any.required": "Please provide # of seats!",
            "number.min": "Number of maxBudget must be greater than 100",
            "number.max": "Number of maxBudget must be less than 99999",
          }),
          seats: Joi.number().min(1).max(200).required().messages({
            "any.required": "Please provide # of seats!",
            "number.min": "Number of seats must be greater than 1",
            "number.max": "Number of seats must be less than 200",
          }),
          description: Joi.string()
            .required()
            .error(() => {
              return Error("Please provide Description!");
            }),
          source: Joi.string()
            .required()
            .error(() => {
              return Error("Please provide Source City!");
            }),
          destination: Joi.string()
            .required()
            .error(() => {
              return Error("Please provide Destination City!");
            }),
          isHotel: Joi.boolean().required("Please provide Hotel Requirement!"),
          isGuide: Joi.boolean()
            .required()
            .error(() => {
              return Error("Please provide Guide Requirement!");
            }),
          places: Joi.array()
            .required()
            .label("places")
            .error(() => {
              return Error("Please provide places you want to visit!");
            }),
          startDate: Joi.date().required().messages({
            "any.required": "Please provide Date when you want to go!",
            "date.format": "Please provide the correct format for Date!",
          }),
          endDate: Joi.date().required().messages({
            "any.required":
              "Please provide Date when your tour will be ending or duration of tour!",
            "date.format": "Please provide the correct format for Date!",
          }),
        }),
      });
      await schema.validateAsync(req.body);
      let user = req?.user;
      let newTourRequest = await CustomTour.requestCustomTour(req.body, user);
      return res.send({ data: newTourRequest, message: "Request Created" });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  getCustomTourRequests: async (req, res) => {
    try {
      let requests = await CustomTourService.getCustomTourRequests(req?.user);
      return res.send({
        data: requests,
        message: "Fetched Custom Tour Requests",
      });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  getCustomTourRequestsByTouristID: async (req, res) => {
    try {
      const schema = Joi.object({
        id: Joi.string()
          .required()
          .messages({ "any.required": "Please provide id" }),
      });
      await schema.validateAsync(req.body);
      let requests = await CustomTourService.getCustomTourRequestsBytouristID(
        req.body.id
      );
      return res.send({ data: requests, message: "Fetched" });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  getMYCustomTourRequests: async (req, res) => {
    try {
      let user = req.user;
      let myRequests = await CustomTourService.getCustomTourRequestsBytouristID(
        user.id
      );
      return res.send({ data: myRequests, message: "Fetched" });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  getCustomTourByID: async (req, res) => {
    try {
      const schema = Joi.object({
        id: Joi.string()
          .min(3)
          .required()
          .messages({ "any.required": "Please provide id" }),
      });
      await schema.validateAsync(req.params);
      let request = await CustomTourService.getCustomTourRequestByID(
        req.params.id
      );
      return res.send({ data: request, message: "Fetched" });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  deleteCustomTourRequest: async (req, res) => {
    try {
      const schema = Joi.object({
        id: Joi.string()
          .min(3)
          .required()
          .messages({ "any.required": "Please provide id" }),
      });
      await schema.validateAsync(req.body);
      let request = await CustomTourService.deleteCustomTourRequest(
        req.body,
        req.user
      );
      return res.send({ data: request, message: "Deleted" });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  acceptCustomTourRequest: async (req, res) => {
    try {
      let user = req?.user;
      let aceptReq = await CustomTourService.acceptCustomTourRequest(
        req.body,
        user
      );
      return res.send({ data: aceptReq, message: "Accepted" });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  rejectOffer: async (req, res) => {
    try {
      const schema = Joi.object({
        id: Joi.string()
          .min(3)
          .required()
          .error(() => {
            return Error("Please Provide id");
          }),
      });
      await schema.validateAsync(req.body);
      let reject = await CustomTourService.rejectOffer(req.body, req?.user);
      res.send({
        data: reject,
        message: "Rejected, It wont appear in your feed!",
      });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  getCustomTourByVendorID: async (req, res) => {
    try {
      let user = req?.user;
      let myRequests = await CustomTourService.getCustomTourRequestByVendorID({
        vendorID: req?.user?.id,
      });
      return res.send({ data: myRequests, message: "Fetched" });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  giveOffer: async (req, res) => {
    try {
      const schema = Joi.object({
        amount: Joi.number().min(50).required().messages({
          "any.required": "Please provide amount",
          "number.min": "Amount must be greater than 50",
        }),
        description: Joi.string()
          .required()
          .error(() => {
            return Error("Please Provide description");
          }),
        requestID: Joi.string()
          .required()
          .error(() => {
            return Error("Please Provide requestID");
          }),
      });
      await schema.validateAsync(req.body);
      let user = req.user;
      let isOffer = CustomTourService.giveOffer(req.body, user);
      return res.send({ data: isOffer, message: "Offer Presented to User" });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  acceptOffer: async (req, res) => {
    try {
      const schema = Joi.object({
        requestID: Joi.string()
          .required()
          .error(() => {
            return Error("Please Provide requestID");
          }),
        vendorID: Joi.string()
          .required()
          .error(() => {
            return Error("Please Provide vendorID");
          }),
      });
      await schema.validateAsync(req.body);
      let user = req.user;
      let isOffer = CustomTourService.acceptOffer(req.body, user);
      return res.send({ data: isOffer, message: "Offer Accepted" });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e.message });
    }
  },
};
//--------------------------------------------------------------------------------------------------
