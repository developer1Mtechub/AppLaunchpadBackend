const express = require("express");
const User = require("../controllers/users/usersController");
const {
  registerValidations,

  emailValidation,
  changePasswordValidation,
  profileUpdateValidation,
} = require("../validations/userValidations");
const Authrization = require("../services/Authrization");
const router = express.Router();

router.post("/register", [registerValidations], User.register);
router.post("/login", [registerValidations], User.login);
router.post("/send-otp", [emailValidation], User.sendOTP);
router.post(
  "/change-password",
  [changePasswordValidation],
  User.changePassword
);
router.put("/profile/:user_id", [profileUpdateValidation], User.updateUser);
router.get("/:user_id", User.getUserById);

module.exports = router;
