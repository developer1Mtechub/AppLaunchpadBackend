const express = require("express");
const User = require("../controllers/usersController");
const {
  registerValidations,
  loginValidations,
  emailValidation,
  changePasswordValidation,
} = require("../validations/userValidations");
const Authrization = require("../services/Authrization");
const router = express.Router();

router.post("/register", [registerValidations], User.register);
router.post("/login", [loginValidations], User.login);
router.post("/send-otp", [emailValidation], User.sendOTP);
router.post(
  "/change-password",
  [changePasswordValidation],
  User.changePassword
);

module.exports = router;
