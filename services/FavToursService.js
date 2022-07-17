//------------------------------------------------------------------------------------------------
/*
 * Favorite Tour Service
 */
//------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------
const FavTourModel = require("../models/FavTours");
//------------------------------------------------------------------------------------------------
module.exports = {
  //------------------------------------------------------------------------------------------------
  // Add Tour to Favorites
  addFavTour: async (user, tourID) => {
    let favTours = await FavTourModel.findOne({ touristID: user.id });
    if (favTours) {
      if (favTours.tours.filter((item) => item == tourID).length == 0) {
        favTours.tours = [...favTours.tours, tourID];
        await favTours.save();
      } else {
        let e = new Error();
        e.message = "Already in FavTours";
        e.statusCode = 400;
        throw e;
      }
      return true;
    } else {
      console.log("else");
      let newFav = await FavTourModel({
        touristID: user.id,
        tours: [tourID],
      });
      await newFav.save();
      return true;
    }
  },
};
//------------------------------------------------------------------------------------------------
