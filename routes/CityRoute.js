//--------------------------------------------------------------------------------------------------
/*
 * City Route
 */
//--------------------------------------------------------------------------------------------------

//---------------------- IMPORTS -------------------------------------------------------------------
const router = require("express").Router();
const CityController = require("../controllers/CityController");
//--------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------
router.get("/all", CityController.getCities);
router.post("/create", CityController.addCity);
router.get("/:id", CityController.getCityByID);
//--------------------------------------------------------------------------------------------------
module.exports = router;
