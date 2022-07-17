//--------------------------------------------------------------------------------------------------
/*
 * INDEX Router, FOR ALL ROUTES IN 1 CALL
 */
//--------------------------------------------------------------------------------------------------

//----------------------------- IMPORTS ------------------------------------------------------------
const UserRoute = require("./UserRoute");
const OrderRoute = require("./OrderRoute");
const PromoRoute = require("./PromoRoute");
const RatingRoute = require("./RatingRoute");
const CityRoute = require("./CityRoute");
const TourRoutes = require("./TourRoutes");
const TransactionRoute = require("./TransactionRoute");
const FavTourRoute = require("./FavTourRoute");
const AdminRoute = require("./AdminRoute");
const TouristRoute = require("./TouristRoute");
const VendorRoute = require("./VendorRoute");
const CustomTourRoute = require("./CustomTourRoute");
const OAuth2 = require("./OAuth2");
const NotificationRoute = require("./NotificationRoute");
const ConversationRoute = require("./ConversationRoute");
const MessageRoute = require("./MessageRoute");
//--------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------
const getRoutes = (app) => {
  const prefix = "/api/";
  const routes = [
    { path: "auth", router: OAuth2 },
    { path: "orders", router: OrderRoute },
    { path: "users", router: UserRoute },
    { path: "ratings", router: RatingRoute },
    { path: "city", router: CityRoute },
    { path: "transactions", router: TransactionRoute },
    { path: "tours", router: TourRoutes },
    { path: "favtours", router: FavTourRoute },
    { path: "admin", router: AdminRoute },
    { path: "tourist", router: TouristRoute },
    { path: "customtours", router: CustomTourRoute },
    { path: "messages", router: MessageRoute },
    { path: "conversations", router: ConversationRoute },
    { path: "notifications", router: NotificationRoute },
    { path: "vendor", router: VendorRoute },
  ];
  routes.forEach((route) => {
    app.use(`${prefix}${route.path}`, route.router);
  });
};
//--------------------------------------------------------------------------------------------------
module.exports = getRoutes;
