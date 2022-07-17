//--------------------------------------------------------------------------------------------------
/*
 * GOOGLE OAUTH Route
 */
//--------------------------------------------------------------------------------------------------

//------------------------- IMPORTS ----------------------------------------------------------------
const router = require("express").Router();
const UserModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");
//--------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------
router.post("/google/createuser", async (req, res) => {
  let { email, profilePicture, lname, fname } = req.body;
  let existinguser = await UserModel.findOne({
    email: email,
    isDeleted: false,
  });
  if (!existinguser) {
    console.log("INSIDE CREATE");
    let newUser = await UserModel({
      email: email,
      profilePicture: profilePicture,
      lname: lname,
      fname: fname,
      source: "google",
      userType: "tourist",
      isVerified: true,
      isActive: true,
    }).save();
    let user = { email, lname, fname, id: newUser._id };
    const token = jwt.sign(user, process.env.PRIVATE_KEY);
    return res.send({
      data: {
        token: token,
        role: newUser.userType,
        profilePicture: newUser.profilePicture,
        name: fname + " " + lname,
        email: newUser.email,
        balance: newUser.balance,
      },
      message: "Fetched",
    });
  } else if (existinguser?.source == "google") {
    if (existinguser.isActive) {
      let user = {
        id: existinguser._id,
        fname: existinguser.fname,
        lname: existinguser.lname,
        email: existinguser.email,
      };
      const token = jwt.sign(user, process.env.PRIVATE_KEY);
      return res.send({
        data: {
          token: token,
          role: existinguser.userType,
          profilePicture: existinguser.profilePicture,
          name: existinguser.fname + " " + existinguser.lname,
          email: existinguser.email,
          balance: existinguser.balance,
        },
        message: "Fetched",
      });
    } else {
      let e = new Error("User is Blocked from using TourBook Services");
      e.statusCode = 400;
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e.message });
    }
  } else {
    return res.status(400).send({
      data: null,
      message: "You have previously signed up with a different signin method",
    });
  }
});
//--------------------------------------------------------------------------------------------------
module.exports = router;
