//--------------------------------------------------------------------------------------------------
/*
 * Vendor Controller Containing Try, Catch of Services
 */
//--------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------
const multer = require("multer");
const UserService = require("../services/UserService");
const Joi = require("joi");
const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "public/images/profile-pictures");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });
//--------------------------------------------------------------------------------------------------
module.exports = {
  //--------------------------------------------------------------------------------------------------
  getmyDetails: async (req, res) => {
    try {
      let user1 = req.user;
      let user = await UserService.getProfileInfo(user1.id);
      return res.send({ data: user, message: "Fetched" });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  getUser: async (req, res) => {
    try {
      let users = await UserService.getUsers(req.query);
      return res.send({ data: users, message: "Fetched" });
    } catch (e) {
      return res.status(e.statusCode).send({ message: e.message, data: null });
    }
  },
  //--------------------------------------------------------------------------------------------------
  createUser: async (req, res) => {
    try {
      let user = await UserService.createUser(req.body);
      return res.send({ data: user, message: "Created" });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ message: e.message, data: null });
    }
  },
  //--------------------------------------------------------------------------------------------------
  loginUser: async (req, res) => {
    try {
      let user = await UserService.loginUser(req.body);
      return res.send({ data: user, message: "Fetched" });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ message: e.message, data: null });
    }
  },
  //--------------------------------------------------------------------------------------------------
  verifyUser: async (req, res) => {
    try {
      const schema = Joi.object({
        email: Joi.string().email().required().messages({
          "any.required": "Please Provide email",
          "string.email": "Email must be valid",
        }),
        code: Joi.string()
          .required()
          .error(() => {
            return Error("Please Provide code");
          }),
      });
      await schema.validateAsync(req.query);
      if (Object.keys(req?.query).length > 0) {
        let user = await UserService.verifyUser({
          email: req.query.email,
          code: req.query.code,
        });
        return res.send(
          `<div style="align-self:center;justify-content:center;display:flex;"><h1>User Verified you can Continue to Use ToorBook</h1></div>`
        );
      } else {
        let e = new Error();
        e.message = "Missing Validation Code and Email";
        e.statusCode = 400;
        throw e;
      }
    } catch (e) {
      return res
        .status(400)
        .send(
          `<div style="align-self:center;justify-content:center;display:flex;"><h1>${e.message}</h1></div>`
        );
    }
  },
  //--------------------------------------------------------------------------------------------------
  blockUser: async (req, res) => {
    try {
      let { id } = req.body;
      const schema = Joi.object({
        id: Joi.string()
          .required()
          .error(() => {
            return Error("Please Provide id");
          }),
      });
      await schema.validateAsync(req.body);
      let user = await UserService.blockUser(id);
      if (user)
        return res
          .status(200)
          .send({ data: true, message: "User Blocked Successfully" });
      else throw Error();
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  forgotPassword: async (req, res) => {
    try {
      let { email } = req.body;
      const schema = Joi.object({
        email: Joi.string().email().required().messages({
          "any.required": "Please Provide email",
          "number.min": "Email must be valid",
        }),
      });
      await schema.validateAsync(req.body);
      let code = await UserService.forgotPassword(email);
      return res.send({
        data: code,
        message: "Verification Code Sent to Email",
      });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  updatePassword: async (req, res) => {
    try {
      let { email, password } = req.body;
      const schema = Joi.object({
        email: Joi.string().email().required().messages({
          "any.required": "Please Provide email",
          "string.email": "Email must be valid",
        }),
        password: Joi.string().min(8).required().messages({
          "any.required": "Please Provide password",
          "string.min": "Password must be greater than 8 characters",
        }),
      });
      await schema.validateAsync(req.body);
      let changes = await UserService.updatePassword(email, password);
      return res.send({
        data: changes,
        message: "Password Changed Successfully",
      });
    } catch (e) {
      res.status(e?.statusCode || 400).send({ data: null, message: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  updateProfile: async (req, res) => {
    try {
      let user = req.user;
      const schema = Joi.object({
        email: Joi.string().email().messages({
          "any.required": "Please Provide email",
          "string.email": "Email must be valid",
        }),
        fname: Joi.string().min(3).messages({
          "any.required": "Please Provide First Name",
          "string.min": "First Name must be greater than 5 characters",
        }),
        lname: Joi.string().min(3).messages({
          "any.required": "Please Provide Last Name",
          "string.min": "Last Name must be greater than 5 characters",
        }),
        city: Joi.string().error(() => {
          return Error("Please Provide city");
        }),
        phoneNumber: Joi.string().min(11),
      });
      await schema.validateAsync(req.body);
      let newDetails = await UserService.updateProfile(req.body, user);
      return res.send({ data: true, message: "Updated Changes" });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  updateProfilePicture: async (req, res) => {
    try {
      console.log(req.body);
      let user = req?.user;
      let newPicture = await UserService.updatePicture(req, user);
      return res.send({ data: newPicture, message: "Updated" });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  deleteUser: async (req, res) => {
    try {
      let { id } = req.user;
      let isDeleted = await UserService.deleteUser(id);
      return res.send({ data: isDeleted, message: "Deleted" });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  verifyOTP: async (req, res) => {
    try {
      const schema = Joi.object({
        email: Joi.string().email().required().messages({
          "any.required": "Please Provide email",
          "string.email": "Email must be valid",
        }),
        code: Joi.string()
          .required()
          .error(() => {
            return Error("Please Provide code");
          }),
      });
      await schema.validateAsync(req.body);
      let otpmatched = await UserService.verifyOTP(req.body);
      return res.send({ data: otpmatched, message: "Matched" });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: false, message: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  getBalance: async (req, res) => {
    try {
      let balance = await UserService.getBalance(req?.user);
      return res.send({ data: balance, message: "Fetched" });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  getAll: async (req, res) => {
    try {
      let user = req?.user;
      let users = await UserService.getAll(user);
      return res.send({ data: users, message: "Fetched" });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e.message });
    }
  },
  //--------------------------------------------------------------------------------------------------
  getUserByID: async (req, res) => {
    try {
      let userFetched = await UserService.getUserByID(req.params.id);
      return res.send({ data: userFetched, message: "Fetched" });
    } catch (e) {
      return res
        .status(e?.statusCode || 400)
        .send({ data: null, message: e.message });
    }
  },
};
//--------------------------------------------------------------------------------------------------
