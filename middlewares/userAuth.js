/*
 * MiddleWare for checking Tourist / User Auth in Token using Header.
 */
const authTourist = (req, res, next) => {
  if (req.user.role != "tourist") {
    // console.log("NOT AUTHORIZED");
    return res.status(401).send("You are not allowed to do that!");
  }
  next();
};
module.exports = authTourist;
