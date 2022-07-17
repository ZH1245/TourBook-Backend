const mongoose = require("mongoose");

/*
 * MongoDB model for Cities
 * Create and Get Cities
 */

const Schema = mongoose.Schema({
  name: { type: String, unique: true, required: true },
});

module.exports = mongoose.model("cities", Schema);
