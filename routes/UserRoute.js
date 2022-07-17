//--------------------------------------------------------------------------------------------------
/*
 * User Route
 */
//--------------------------------------------------------------------------------------------------

//------------------------------------ IMPORTS -----------------------------------------------------
const UserController = require("../controllers/UserController");
const router = require("express").Router();
const handleSingupAuth = require("../middlewares/signUpauth");
const authAdmin = require("../middlewares/adminAuth");
const handleAuth = require("../middlewares/auth");
const path = require("path");
const multer = require("multer");
//--------------------------------------------------------------------------------------------------

//------------------------------ MULTER FORM DATA MIDDLEWARE ---------------------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join("./public/images/profile-pictures"));
  },
  filename: (req, file, cb) => {
    const filename = file.originalname.split(".jpg")[0];
    cb(null, Date.now() + "-" + filename + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });
//--------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------
router.post("/login", UserController.loginUser);
router.post("/signup", UserController.createUser);
router.get("/validate", UserController.verifyUser);
router.get("/get", UserController.getUser);
router.get("/get/:id", UserController.getUserByID);
router.get("/all", handleAuth, authAdmin, UserController.getAll);
router.post("/forgot", UserController.forgotPassword);
router.put("/update/password", handleSingupAuth, UserController.updatePassword);
router.get("/mydetails", handleAuth, UserController.getmyDetails);
router.put("/verify/otp", UserController.verifyOTP);
router.put("/block", handleAuth, authAdmin, UserController.blockUser);
router.put("/delete", handleAuth, UserController.deleteUser);
router.put(
  "/update/picture",
  handleAuth,
  upload.single("picture"),
  UserController.updateProfilePicture
);
router.put("/update/profile", handleAuth, UserController.updateProfile);
router.get("/balance", handleAuth, UserController.getBalance);
//--------------------------------------------------------------------------------------------------
module.exports = router;
