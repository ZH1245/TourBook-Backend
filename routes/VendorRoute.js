//--------------------------------------------------------------------------------------------------
/*
 * VENDOR Route
 */
//--------------------------------------------------------------------------------------------------

//------------------------------- IMPORTS ----------------------------------------------------------
const OrderController = require("../controllers/OrderController");
const handleAuth = require("../middlewares/auth");
const authVendor = require("../middlewares/vendorAuth");
const VendorController = require("../controllers/VendorController");
const router = require("express").Router();
//--------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------
router.get("/get/:id", VendorController.getVendorByID);
router.get(
  "/requests/refunds",
  handleAuth,
  authVendor,
  VendorController.getRefundTourRequests
);
router.put(
  "/refund/accept/",
  handleAuth,
  authVendor,
  VendorController.acceptRefundRequest
);
router.put(
  "/refund/reject/",
  handleAuth,
  authVendor,
  VendorController.rejectRefundTourRequest
);
router.put(
  "/accept/order/",
  handleAuth,
  authVendor,
  OrderController.approveTour
);
router.get("/dashboard", handleAuth, authVendor, VendorController.getDashboard);
//--------------------------------------------------------------------------------------------------
module.exports = router;
