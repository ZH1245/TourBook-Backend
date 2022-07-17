//--------------------------------------------------------------------------------------------------
/*
 * ORDER Controller Containing Try, Catch of Services
 */
//--------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------
const OrderService = require("../services/OrderService");
const UserService = require("../services/UserService");
let e = new Error();
const Joi = require("joi");
//--------------------------------------------------------------------------------------------------

module.exports = {
  //--------------------------------------------------------------------------------------------------
  getOrders: async (req, res) => {
    try {
      let orders = await OrderService.getOrders();
      return res.status(200).send(orders);
    } catch (e) {
      return res.status(e?.statusCode || 400).send(e.message);
    }
  },
  //--------------------------------------------------------------------------------------------------
  getmyOrders: async (req, res) => {
    try {
      let orders = await OrderService.getMyOrders(req.user);
      return res.status(200).send(orders);
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  getOrderByID: async (req, res) => {
    try {
      const schema = Joi.object({
        id: Joi.string()
          .required()
          .error(() => {
            return Error("Please Provide id");
          }),
      });
      await schema.validateAsync(req.params);
      let orders = await OrderService.getOrderByID(req.params.id);
      return res.send(orders);
    } catch (e) {
      return res.status(e?.statusCode || 400).send(e.message);
    }
  },
  //--------------------------------------------------------------------------------------------------
  getOrdersByAmount: async (req, res) => {
    try {
      const schema = Joi.object({
        amount: Joi.number()
          .required()
          .messages({ "any.required": "Please provide amount" }),
      });
      await schema.validateAsync(req.query);
      let orders = await OrderService.getOrdersByAmount(req.query?.amount);
      return res.send(orders);
    } catch (e) {
      return res.status(e?.statusCode || 400).send(e.message);
    }
  },
  //--------------------------------------------------------------------------------------------------
  getOrdersByApporval: async (req, res) => {
    try {
      const schema = Joi.object({
        approved: Joi.boolean()
          .required()
          .error(() => {
            return Error("Please Provide approved status");
          }),
      });
      await schema.validateAsync(req.query);
      let orders = await OrderService.getOrdersByApporval(req.query?.approved);
      return res.send(orders);
    } catch (e) {
      return res.status(e?.statusCode || 400).send(e.message);
    }
  },
  //--------------------------------------------------------------------------------------------------
  getOrdersByApporvalByTouristID: async (req, res) => {
    try {
      const schema = Joi.object({
        approved: Joi.boolean()
          .required()
          .error(() => {
            return Error("Please Provide approved status");
          }),
        touristID: Joi.boolean()
          .required()
          .error(() => {
            return Error("Please Provide touristID");
          }),
      });
      await schema.validateAsync(req.query);
      let orders = await OrderService.getOrdersByApporvalByTouristID({
        approved: req.query?.approved,
        touristID: req.query?.touristID,
      });
      return res.send(orders);
    } catch (e) {
      return res.status(e?.statusCode || 400).send(e.message);
    }
  },
  //--------------------------------------------------------------------------------------------------
  getRefundedOrders: async (req, res) => {
    try {
      let orders = await OrderService.getRefundedOrders();
      return res.send(orders);
    } catch (e) {
      return res.status(e?.statusCode || 400).send(e.message);
    }
  },
  //--------------------------------------------------------------------------------------------------
  getRefundedOrdersByTouristID: async (req, res) => {
    try {
      const schema = Joi.object({
        touristID: Joi.string()
          .required()
          .error(() => {
            return Error("Please Provide touristID");
          }),
      });
      await schema.validateAsync(req.query);
      let orders = await OrderService.getRefundedOrdersByTouristID(
        req.query?.touristID
      );
      return res.send(orders);
    } catch (e) {
      return res.status(e?.statusCode || 400).send(e.message);
    }
  },
  //--------------------------------------------------------------------------------------------------
  rejectTour: async (req, res) => {
    try {
      const schema = Joi.object({
        id: Joi.string()
          .required()
          .error(() => {
            return Error("Please Provide id");
          }),
      });
      await schema.validateAsync(req.body);
      let data = req.body;
      let user = req.user;
      let order = await OrderService.rejectTour(data, user);
      res.send({ data: order, message: "Rejected and Refunded!" });
    } catch (e) {
      return res.status(e?.statusCode || 400).send(e.message);
    }
  },
  //--------------------------------------------------------------------------------------------------
  approveTour: async (req, res) => {
    try {
      const schema = Joi.object({
        id: Joi.string()
          .required()
          .error(() => {
            return Error("Please Provide id");
          }),
      });
      await schema.validateAsync(req.body);
      let user = req.user;
      let orders = await OrderService.approveTour(req.body, user);
      return res.send({
        data: orders,
        message: "Accepted",
      });
    } catch (e) {
      return res.status(e?.statusCode || 400).send(e.message);
    }
  },
  //--------------------------------------------------------------------------------------------------
  createOrder: async (req, res) => {
    try {
      const schema = Joi.object({
        touristID: Joi.string()
          .required()
          .error(() => {
            return Error("Please Provide touristID");
          }),
        amount: Joi.number().required().min(50).messages({
          "any.required": "Please Provide amount",
          "number.min": "Amount must be greater than 50",
        }),
        tourID: Joi.string()
          .required()
          .error(() => {
            return Error("Please Provide tourID");
          }),
        seats: Joi.number().required().min(1).messages({
          "any.required": "Please Provide amount",
          "number.min": "Seats must be greater than 1",
        }),
      });
      await schema.validateAsync(req.body);
      let user = req.user;
      let orders = await OrderService.createOrder(req.body, user);
      return res.send({ data: orders, message: "Created" });
    } catch (e) {
      return res.status(e?.statusCode || 400).send(e.message);
    }
  },
  //--------------------------------------------------------------------------------------------------
  refundTour: async (req, res) => {
    try {
      const schema = Joi.object({
        id: Joi.string()
          .required()
          .error(() => {
            return Error("Please Provide id");
          }),
      });
      await schema.validateAsync(req.body);

      let orders = await OrderService.refundOrder(req.body);
      return res.send({ orders, message: "Refunded" });
    } catch (e) {
      return res.status(e?.statusCode || 400).send(e.message);
    }
  },
  //--------------------------------------------------------------------------------------------------
  rejectRefundRequest: async (req, res) => {
    try {
      const schema = Joi.object({
        id: Joi.string()
          .required()
          .error(() => {
            return Error("Please Provide id");
          }),
      });
      await schema.validateAsync(req.body);
      let data = req.body;
      let approval = await OrderService.rejectRefundRequest(data);
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  requestRefund: async (req, res) => {
    try {
      const schema = Joi.object({
        orderID: Joi.string()
          .required()
          .error(() => {
            return Error("Please Provide orderID");
          }),
      });
      await schema.validateAsync(req.body);
      let user = req.user;
      let request = await OrderService.requestRefund(req.body, user);
      res.send({ data: true, message: "Requested" });
    } catch (e) {
      res.status(e?.statusCode || 400).send({ data: null, message: e.message });
    }
  },
};
//--------------------------------------------------------------------------------------------------
