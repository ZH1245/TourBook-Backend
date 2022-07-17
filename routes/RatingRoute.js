//--------------------------------------------------------------------------------------------------
/*
 * Rating Route
 */
//--------------------------------------------------------------------------------------------------

//-------------------------------- IMPORTS ---------------------------------------------------------
const router = require("express").Router();
const RatingController = require("../controllers/RatingController");
const authTourist = require("../middlewares/userAuth");
const handleAuth = require("../middlewares/auth");
//--------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------
router.get("/get/:id", RatingController.getRatingByID);
router.get("/get", RatingController.getRating);
router.get("/vendor", RatingController.getRatingByVendorID);
router.post("/delete", handleAuth, authTourist, RatingController.deleteRating);
router.post("/add", handleAuth, authTourist, RatingController.addRating);
//--------------------------------------------------------------------------------------------------
module.exports = router;
