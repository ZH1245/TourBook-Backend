//--------------------------------------------------------------------------------------------------
/*
 * Transaction Controller Containing Try, Catch of Services
 */
//--------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------const TransactionService = require("../services/TransactionService");
const Joi = require("joi");
//--------------------------------------------------------------------------------------------------
module.exports = {
  //--------------------------------------------------------------------------------------------------
  purchaseCredits: async (req, res) => {
    try {
      const schema = Joi.object().keys({
        payment: Joi.object().keys({
          CardNumber: Joi.string()
            .required()
            .error(() => {
              return Error("Please Provide CardNumber");
            }),
          Month: Joi.number().min(1).max(12).required().messages({
            "any.required": "Please Provide Month",
            "number.min": "Month must be between 1 and 12",
            "number.max": "Month must be between 1 and 12",
          }),
          Year: Joi.number()
            .required()
            .error(() => {
              return Error("Please Provide Year");
            }),
          CVC: Joi.number()
            .required()
            .error(() => {
              return Error("Please Provide CVC");
            }),
          Amount: Joi.number().min(300).required().messages({
            "any.required": "Please Provide Amount",
            "number.min": "Amount must be greater than 300",
          }),
        }),
        user: Joi.object().keys({
          email: Joi.string().email().required().messages({
            "any.required": "Please Provide email",
            "string.email": "Must be a valid Email",
          }),
          name: Joi.string().min(5).required().messages({
            "any.required": "Please Provide name",
            "number.min": "name must be greater than 5 characters",
          }),
        }),
      });
      await schema.validateAsync(req.body);
      let purchase = await TransactionService.rechargeAccount(req);
      return res.status(200).send({
        data: purchase,
        message: "Successfull Purchase of Tourbook Credits",
      });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  refundPurchase: async (req, res) => {
    try {
      const schema = Joi.object({
        id: Joi.string()
          .required()
          .error(() => {
            return Error("Please Provide id");
          }),
      });
      await schema.validateAsync(req.body);
      let refund = await TransactionService.refundPurchase(req.body);
      return res
        .status(200)
        .send({ data: refund, message: "Refund Successfully" });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  getTransactionByID: async (req, res) => {
    try {
      const schema = Joi.object({
        id: Joi.string()
          .required()
          .error(() => {
            return Error("Please Provide id");
          }),
      });
      await schema.validateAsync(req.params);
      let transcantion = await TransactionService.getTransactionByID(
        req.params.id
      );
      return res.status(200).send({ data: transcantion, message: "Fetched" });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  getMyTranscations: async (req, res) => {
    try {
      let user = req.user;
      let transcantions = await TransactionService.getMyTransactions(user);
      return res.send({ data: transcantions, message: "Fetched Transactions" });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e?.message });
    }
  },
};
//--------------------------------------------------------------------------------------------------
