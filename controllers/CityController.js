//--------------------------------------------------------------------------------------------------
/*
 * City Controller Containing Try, Catch of Services
 */
//--------------------------------------------------------------------------------------------------

//------------------------------- IMPORTS ----------------------------------------------------------
const CityService = require("../services/CityService");
const Joi = require("joi");
//--------------------------------------------------------------------------------------------------
module.exports = {
  //--------------------------------------------------------------------------------------------------
  getCities: async (req, res) => {
    try {
      let cities = await CityService.getCities();
      return res.status(200).send({ data: cities, message: "Fetched" });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, messagee: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  getCityByID: async (req, res) => {
    try {
      let city = await CityService.getCityByID(req.params.id);
      return res.status(200).send({ data: city, message: "Fetched" });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  addCity: async (req, res) => {
    try {
      const schema = Joi.object().keys({
        name: Joi.string().min(3).required().messages({
          "any.required": "Please provide name of City",
          "string.min": "Name must be greater than 3",
        }),
      });
      await schema.validateAsync(req.body);
      let { name } = req.body;
      let newCity = await CityService.addCity(name);
      return res
        .status(200)
        .send({ data: newCity, message: `Created New City with Name ${name}` });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e?.message });
    }
  },
};
//--------------------------------------------------------------------------------------------------
