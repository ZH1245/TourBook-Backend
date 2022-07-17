//--------------------------------------------------------------------------------------------------
/*
 * Tourist Controller Containing Try, Catch of Services
 */
//--------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------
const TouristService = require("../services/TouristService");
//--------------------------------------------------------------------------------------------------
module.exports = {
  //--------------------------------------------------------------------------------------------------
  getProfileInfo: async (req, res) => {
    try {
      let details = await TouristService.getProfileInfo(req.user);
      return res.send({ data: details, message: "Fetched Info" });
    } catch (e) {
      res.status(e?.statusCode || 400).send({ data: null, message: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  getMyTours: async (req, res) => {
    try {
      let myTours = await TouristService.getMyTours(req.user);
      return res.send({ data: myTours, message: "Fetched Tours" });
    } catch (e) {
      res.status(e?.statusCode || 400).send({ data: null, message: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  getDashboard: async (req, res) => {
    try {
      let dashboard = await TouristService.getDashboard(req.user);
      return res.send({ data: dashboard, message: "Fetched Dashboard" });
    } catch (e) {
      res.status(e?.statusCode || 400).send({ data: null, message: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  buyTBCredits: async (req, res) => {
    try {
      let creditTransaction = await TouristService.buyTBCredits(req);
      return res.send({ data: creditTransaction, message: "Credits Bought" });
    } catch (e) {
      res.status(e?.statusCode || 400).send({ data: null, message: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  refundTBCredits: async (req, res) => {
    try {
      let refund = await TouristService.refundTBCredits(req);
      return res.send({ data: refund, message: "Credits Refunded" });
    } catch (e) {
      res.status(e?.statusCode || 400).send({ data: null, message: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  reserveTour: async (req, res) => {
    try {
      let reservation = await TouristService.reserveTour(req.body);
      return res.send({ data: reservation, message: "Reservation Added" });
    } catch (e) {
      res.status(e?.statusCode || 400).send({ data: null, message: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  requestCustomTour: async (req, res) => {
    try {
      let tour = await TouristService.requestCustomTour(req.body);
      return res.send({ data: tour, message: "Request Created" });
    } catch (e) {
      res.status(e?.statusCode || 400).send({ data: null, message: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  addFavTours: async (req, res) => {
    try {
      let favTours = await TouristService.addFavTours({
        user: req.user,
        tourID: req.body.tourID,
      });
      return res.send({ data: favTours, message: "Updated Successfully" });
    } catch (e) {
      res.status(e?.statusCode || 400).send({ data: null, message: e.message });
    }
  },
};
//--------------------------------------------------------------------------------------------------
