//--------------------------------------------------------------------------------------------------
/*
 * Admin Controller Containing Try, Catch of Services
 */
//--------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------
const UserModel = require("../models/UserModel");
const AdminService = require("../services/AdminService");
const UserService = require("../services/UserService");
//--------------------------------------------------------------------------------------------------
module.exports = {
  //--------------------------------------------------------------------------------------------------
  blockUser: async (req, res) => {
    try {
      let blocked = await AdminService.blockUser(req.body.userID);
      return res
        .status(200)
        .send({ data: true, message: "User Blocked Successfully" });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  unBlockUser: async (req, res) => {
    try {
      let blocked = await AdminService.unBlockUser(req.body.userID);
      return res
        .status(200)
        .send({ data: true, message: "User UnBlocked Successfully" });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  createAdmins: async (req, res) => {
    try {
      let newAdmin = await AdminService.createAdmins(req.body);
      return res.status(200).send({ data: true, message: "Created Admin" });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  deleteUser: async (req, res) => {
    try {
      let deleteduser = await AdminService.deleteUser(req.body.id);
      return res.status(200).send({ data: true, message: "Deleted User" });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  rejectVendorRequest: async (req, res) => {
    try {
      let request = await AdminService.rejectVendorRequest(req.body.vendorID);
      return res.status(200).send({ data: request, message: "Rejected" });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  acceptVendorRequest: async (req, res) => {
    try {
      let request = await AdminService.acceptVendorRequest(req.body.vendorID);
      return res.status(200).send({ data: request, message: "Accepted" });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  getPendingVendorRequests: async (req, res) => {
    try {
      let requests = await AdminService.getpendingVendorsRequests();
      return res.send({ data: requests, message: "Fetched" });
    } catch (e) {
      return res
        .status(e?.status || 400)
        .send({ data: null, message: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  getDashBoard: async (req, res) => {
    try {
      let user = req.user;
      let dashboard = await AdminService.getDashboard(user);
      return res.send({ data: dashboard, message: "Fetched" });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  refundOrderbyID: async (req, res) => {
    try {
      let refund = await AdminService.refundPackageByID(req.body.orderID);

      return res.send({ data: refund, message: "Done" });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e.message });
    }
  },
};
//--------------------------------------------------------------------------------------------------
