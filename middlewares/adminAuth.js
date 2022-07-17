/*
 * MiddleWare for checking Admin Auth in Token using Header.
 */

const authAdmin = (req, res, next) => {
  if (req.user.role != "admin") {
    console.log("NOT ADMIN");
    return res.status(401).send("You are not allowed to do that!");
  }
  next();
};
module.exports = authAdmin;
