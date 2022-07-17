//--------------------------------------------------------------------------------------------------
/*
 * PromoCode Route
 */
//--------------------------------------------------------------------------------------------------

//--------------------------- IMPORTS --------------------------------------------------------------
const PromoController = require("../controllers/PromoController");
const router = require("express").Router();
const authVendor = require("../middlewares/vendorAuth");
const handleAuth = require("../middlewares/auth");
//--------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------
router.post("/create", handleAuth, authVendor, PromoController.createPromo);
router.put("/edit", handleAuth, authVendor, PromoController.editPromo);
router.get("/get", PromoController.getPromo);
router.get("/:id", PromoController.getPromoByID);
router.post("/delete", handleAuth, authVendor, PromoController.deletePromo);
//--------------------------------------------------------------------------------------------------
module.exports = router;
