//--------------------------------------------------------------------------------------------------
/*
 * FavoriteTours Controller Containing Try, Catch of Services
 */
//--------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------
const FavToursService = require("../services/FavToursService");
//--------------------------------------------------------------------------------------------------
module.exports = {
  //--------------------------------------------------------------------------------------------------
  addFavTour: async (req, res) => {
    try {
      let favtour = await FavToursService.addFavTour(
        req?.user,
        req.body?.tourID
      );
      return res.status(200).send({ data: true, message: "Added" });
    } catch (e) {
      res.status(e?.statusCode || 400).send({ data: null, message: e.message });
    }
  },
};
