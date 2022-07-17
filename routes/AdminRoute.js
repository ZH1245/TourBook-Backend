//--------------------------------------------------------------------------------------------------
/*
 * Admin Route
 */
//--------------------------------------------------------------------------------------------------

//------------------------------- IMPORTS ----------------------------------------------------------
const AdminController = require("../controllers/AdminController");
const UserController = require("../controllers/UserController");
const authAdmin = require("../middlewares/adminAuth");
const handleAuth = require("../middlewares/auth");
const router = require("express").Router();
//--------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------
router.put("/user/block", handleAuth, authAdmin, UserController.blockUser);
router.put("/user/unblock", handleAuth, authAdmin, AdminController.unBlockUser);
router.put("/user/delete", handleAuth, authAdmin, AdminController.deleteUser);
router.get(
  "/pendingVendors",
  handleAuth,
  authAdmin,
  AdminController.getPendingVendorRequests
);
router.put(
  "/user/accept",
  handleAuth,
  authAdmin,
  AdminController.acceptVendorRequest
);
router.put(
  "/user/reject",
  handleAuth,
  authAdmin,
  AdminController.rejectVendorRequest
);
router.get("/dashboard", handleAuth, authAdmin, AdminController.getDashBoard);
router.put(
  "/order/refund",
  handleAuth,
  authAdmin,
  AdminController.refundOrderbyID
);
//--------------------------------------------------------------------------------------------------
module.exports = router;
