/*
 * MiddleWare for checking Tour operator Auth in Token using Header.
 */
const authVendor = (req, res, next) => {
  // console.log(req.user.role);
  if (req.user.role == "vendor" || req.user.role == "tourguide") {
    // console.log("NOT AUTHORIZED");

    next();
  } else {
    return res.status(401).send("You are not allowed to do that!");
  }
};
module.exports = authVendor;
