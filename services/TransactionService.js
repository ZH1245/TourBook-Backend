//------------------------------------------------------------------------------------------------
/*
 * Payment Servive / TOURBOOK CREDITS
 */
//------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------
const pusher = require("../helpers/pusher");
const genToken = require("../helpers/Stripe");
const TransactionsModel = require("../models/Transactions.model");
const UserModel = require("../models/UserModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const Notification = require("../models/Notifications");
const Joi = require("joi");

// require("dotenv").config();
// const secret_key = process.env.STRIPE_SECRET;
// const public_key = process.env.STRIPE_PUBLIC;
// // const stripe = require("stripe")(secret_key);

// module.exports={
//     postPayment:async(data)=>{
//         stripe.customers.create({
//             email:
//             source
//         })
//     }
// }

//------------------------------------------------------------------------------------------------

module.exports = {
  //------------------------------------------------------------------------------------------------
  // Purchase Credits
  rechargeAccount: async (req) => {
    try {
      let { id } = req.user;
      let {
        CardNumber: n,
        Month: expmonth,
        Year: y,
        CVC: cvc,
        Amount,
      } = req.body.payment;
      let { email, name } = req.body.user;
      let card = {
        number: n,
        exp_month: parseInt(expmonth),
        exp_year: parseInt(y),
        cvc,
        currency: "pkr",
      };
      let token = await genToken(card);
      let customer = await stripe.customers.create({
        email,
        source: token.id,
        name,
      });
      let centtoPkr = Amount * 100;
      let charges = await stripe.charges.create({
        amount: centtoPkr,
        description: "TourBook Credits",
        currency: "pkr",
        customer: customer.id,
      });
      let user = await UserModel.findById(req.user.id);
      let transac = await new TransactionsModel({
        CardNumber: n,
        userID: user._id,
        TransID: charges.id,
        RechargedAmount: req.body.payment.Amount,
      }).save();
      await UserModel.updateOne(
        { _id: req.user.id },
        { balance: Number(user.balance) + Number(req.body.payment.Amount) }
      );
      let notification = await Notification.create({
        text: `Your Purchased ${req.body.payment.Amount} TourBook Credits`,
        contentID: transac._id,
        userID: user._id,
        type: "transaction",
      });
      pusher.trigger(`${user._id}`, "notifications", notification);
      return {
        charges: charges,
        balance: Number(user.balance) + Number(req.body.payment.Amount),
      };
    } catch (e) {
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  //  Refund Purchases
  refundPurchase: async (data) => {
    try {
      let { id } = data;
      let transcantion = await TransactionsModel.findOne({
        _id: id,
      });
      if (transcantion) {
        let user = await UserModel.findById(transcantion.userID);
        if (user.balance >= transcantion.RechargedAmount) {
          let refund = await stripe.refunds.create({
            charge: transcantion.TransID,
          });
          transcantion.refunded = true;
          await transcantion.save();
          user.balance = user.balance - transcantion.RechargedAmount;
          await user.save();
          let notification = await Notification.create({
            text: `Your transaction of ${transcantion.RechargedAmount} TourBook Credits has been refunded!`,
            userID: user._id,
            type: "transaction",
            contentID: transcantion._id,
          });
          pusher.trigger(`${user._id}`, "notifications", notification);
          return refund;
        } else {
          let e = new Error("Not Sufficient Balance to Process Refund");
          e.statusCode = 400;
          throw e;
        }
      } else {
        let e = new Error();
        e.message = `No Transactions found agains TransactionID ${TransID}`;
        e.statusCode = 404;
        throw e;
      }
    } catch (e) {
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  // Get Transactions by ID
  getTransactionByID: async (id) => {
    try {
      let transcantion = await TransactionsModel.findById(id);
      if (transcantion) {
        return transcantion;
      } else {
        let e = new Error();
        e.message = "Not Found";
        e.statusCode = 404;
        throw e;
      }
    } catch (e) {
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  // GET my Transactions
  getMyTransactions: async (user) => {
    try {
      let transcantions = await TransactionsModel.find({
        userID: user.id,
      }).sort("-updatedAt");
      if (transcantions) {
        return transcantions;
      } else {
        let e = new Error("No Transactions Found");
        e.statusCode = 404;
        throw e;
      }
    } catch (e) {
      throw e;
    }
  },
};
//------------------------------------------------------------------------------------------------
