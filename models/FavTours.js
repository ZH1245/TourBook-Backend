const mongoose = require("mongoose");

/*
 * MongoDB model for Favoutite Tours
 * Add Your Favourite Tours
 * Can be used as Recommendation in Future
 */

const Schema = mongoose.Schema({
  touristID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  tours: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "tours",
    default: [],
  },
});

module.exports = mongoose.model("FavTours", Schema);
