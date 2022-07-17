//--------------------------------------------------------------------------------------------------
/*
 * PROMO Controller Containing Try, Catch of Services
 */
//--------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------
const PromoModel = require("../models/PromoModel");
const PromoService = require("../services/PromoService");
//--------------------------------------------------------------------------------------------------
module.exports = {
  //--------------------------------------------------------------------------------------------------
  createPromo: async (req, res) => {
    try {
      let data = req.body;
      let user = req?.user;
      let newPromo = await PromoService.createPromo(data, user);
      return res.status(200).send({ message: "Created", data: newPromo });
    } catch (e) {
      return res.status(400).send({ message: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  editPromo: async (req, res) => {
    try {
      const promo = await PromoService.editPromo(req.body);
      return res.send({ message: "UPDATED", data: promo });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ message: e.message, data: null });
    }
  },
  //--------------------------------------------------------------------------------------------------
  getPromoByID: async (req, res) => {
    try {
      let { id } = req.params;
      let promo = await PromoService.getPromoByID(id);
      return res.send({ data: promo, message: "Fetched" });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  getPromo: async (req, res) => {
    try {
      let query = {};
      if (req.query?.id) {
        query._id = req.query?.id;
      }
      if (req.query?.vendorID) {
        query._id = req.query?.vendorID;
      }
      if (req.query?.amount) {
        query._id = req.query?.amount;
      }
      if (Object.keys(query).length > 0) {
        const promo = await PromoModel.find(query);
        if (promo) {
          return res.status(200).send({ message: "FOUND", data: promo });
        } else {
          return res.status(404).send({ message: "NOT FOUND", data: null });
        }
      } else {
        return res.status(400).send({ message: "ADD ?q Params" });
      }
    } catch (e) {
      return res.status(400).send({ message: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  deletePromo: async (req, res) => {
    try {
      let promo = await PromoService.deletePromo(req.body.id);
      return res.send({ data: true, message: "Deleted" });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e.message });
    }
  },
};
//--------------------------------------------------------------------------------------------------
