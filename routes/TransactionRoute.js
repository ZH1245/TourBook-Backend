//--------------------------------------------------------------------------------------------------
/*
 * Transaction Route
 */
//--------------------------------------------------------------------------------------------------

//------------------------------ IMPORTS -----------------------------------------------------------
const router = require("express").Router();
const TransactionController = require("../controllers/TranscantionController");
const handleAuth = require("../middlewares/auth");
//--------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------
router.post("/buy", handleAuth, TransactionController.purchaseCredits);
router.put("/refund", TransactionController.refundPurchase);
router.get("/get/:id", TransactionController.getTransactionByID);
router.get("/mine", handleAuth, TransactionController.getMyTranscations);
//--------------------------------------------------------------------------------------------------
module.exports = router;
