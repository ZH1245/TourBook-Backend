//------------------------------------------------------------------------------------------------
/*
 * City Functions
 */
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
const CityModel = require("../models/Cities");
//------------------------------------------------------------------------------------------------
module.exports = {
  //------------------------------------------------------------------------------------------------
  // Create New City
  addCity: async (data) => {
    try {
      let cityname = data;
      let existing = await CityModel.findOne({ name: cityname });
      if (!existing) {
        let city = await CityModel.create({ name: cityname });
        return city;
      }
      return existing;
    } catch (e) {
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  // Get List of All Cities
  getCities: async () => {
    try {
      let cities = await CityModel.find({}).sort("name");
      if (Object.keys(cities).length > 0) {
        return cities;
      } else {
        let e = new Error();
        e.message = "No Cities Were Found";
        e.statusCode = 404;
        throw e;
      }
    } catch (e) {
      throw e;
    }
  },
  //------------------------------------------------------------------------------------------------
  // Get City By ID
  getCityByID: async (data) => {
    try {
      let city = await CityModel.findById(data);
      if (city) {
        return city;
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
};
//------------------------------------------------------------------------------------------------
