//--------------------------------------------------------------------------------------------------
/*
 * ORDER Route
 */
//--------------------------------------------------------------------------------------------------

//------------------------------ IMPORTS -----------------------------------------------------------
const router = require("express").Router();
const OrderController = require("../controllers/OrderController");
const authAdmin = require("../middlewares/adminAuth");
const authVendor = require("../middlewares/vendorAuth");
const handleAuth = require("../middlewares/auth");
//--------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------
router.get("/get", OrderController.getOrders);
router.get("/get/:id", OrderController.getOrderByID);
router.get("/refund/get", handleAuth, OrderController.getRefundedOrders);
router.put("/request/refund", handleAuth, OrderController.requestRefund);
router.post("/create/", handleAuth, OrderController.createOrder);
router.get("/mine", handleAuth, OrderController.getmyOrders);
router.put("/accept", handleAuth, authVendor, OrderController.approveTour);
router.put("/reject", handleAuth, authVendor, OrderController.rejectTour);
router.put(
  "/refund/accept",
  handleAuth,
  authVendor,
  OrderController.refundTour
);
router.put(
  "/refund/reject",
  handleAuth,
  authVendor,
  OrderController.rejectRefundRequest
);
//--------------------------------------------------------------------------------------------------

module.exports = router;
