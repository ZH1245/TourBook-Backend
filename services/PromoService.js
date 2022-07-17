//------------------------------------------------------------------------------------------------
/*
 * Promo Code Service. Coded But Not Added (Future)
 */
//------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------
const PromoModel = require("../models/PromoModel");
//------------------------------------------------------------------------------------------------

module.exports = {
  //------------------------------------------------------------------------------------------------
  createPromo: async (data, user) => {
    const existingPromo = await PromoModel.findOne({ code: data.code });
    if (existingPromo) {
      let e = new Error("Already Exists");
      e.statusCode = 404;
      throw e;
    } else {
      let newPromo = await PromoModel({
        code: data.code,
        vendorID: user.id,
        dateAdded: data.dateAdded,
        validTill: data.validTill,
        amount: data.amount,
        isPercent: data.isPercent,
      });
      await newPromo.save();
      return newPromo;
    }
  },
  //------------------------------------------------------------------------------------------------
  editPromo: async (data) => {
    const existingPromo = await PromoModel.findById(data.id);
    if (existingPromo) {
      existingPromo.code = data.code;
      existingPromo.amount = data.amount;
      existingPromo.isPercent = data.isPercent;
      existingPromo.dateAdded = data.dateAdded;
      existingPromo.validTill = data.validTill;
      await existingPromo.save();
      return existingPromo;
    } else {
      let e = new Error("Not Found or Missing Arguments");
      e.statusCode = 404;
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  getPromoByID: async (id) => {
    let promo = await PromoModel.findById(id);
    if (promo) return promo;
    else {
      let e = new Error("Not Found");
      e.statusCode = 404;
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  deletePromo: async (id) => {
    let promo = await PromoModel.findById(id);
    if (promo) {
      await promo.delete();
      return true;
    } else {
      let e = new Error("Not Found");
      e.statusCode = 404;
      throw e;
    }
  },
};
//------------------------------------------------------------------------------------------------
