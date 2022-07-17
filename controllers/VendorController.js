//--------------------------------------------------------------------------------------------------
/*
 * Vendor Controller Containing Try, Catch of Services
 */
//--------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------
const OrderService = require("../services/OrderService");
const VendorService = require("../services/VendorService");
const Joi = require("joi");
//------------------------------------------------------------------------------------------------
module.exports = {
  //------------------------------------------------------------------------------------------------
  // Get Vendor By ID
  getVendorByID: async (req, res) => {
    try {
      const schema = Joi.object({
        id: Joi.string()
          .required()
          .messages({ "any.required": "Please provide id in params" }),
      });
      await schema.validateAsync(req.params);
      let vendor = await VendorService.getVendorByID(req.params.id);
      return res.send({ data: vendor, message: "Fetched" });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e.message });
    }
  },
  //------------------------------------------------------------------------------------------------
  // Get My Refund Tour requests
  getRefundTourRequests: async (req, res) => {
    try {
      let user = req.user;
      let requests = await VendorService.getRefundTourRequests(user);
      return res.send({ data: requests, message: "Fetched" });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e.message });
    }
  },
  //------------------------------------------------------------------------------------------------
  // Accept Tour Refund Request
  acceptRefundRequest: async (req, res) => {
    try {
      let refund = await OrderService.refundOrder(req.body);
      return res.send({ data: refund, message: "Refunded" });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e.message });
    }
  },
  //------------------------------------------------------------------------------------------------
  // Reject Tour Refund Request
  rejectRefundTourRequest: async (req, res) => {
    try {
      let rejectRefund = await OrderService.rejectRefundRequest(req.body);
      return res.send({ data: rejectRefund, message: "Rejected" });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e.message });
    }
  },
  //------------------------------------------------------------------------------------------------
  // GET dashboard
  getDashboard: async (req, res) => {
    try {
      let user = req.user;
      let dahsboard = await VendorService.getDashboard(user);
      return res.send({ data: dahsboard, message: "Fetched" });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e.message });
    }
  },
  //------------------------------------------------------------------------------------------------
  //Reject Reservation Request
  rejectReservationRequest: async (req, res) => {
    try {
      let user = req.user;
      let requests = await VendorService.rejectReservationRequest(
        req.body.id,
        user
      );
      return res.send({ data: requests, message: "Rejected" });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e.message });
    }
  },
};
//------------------------------------------------------------------------------------------------
