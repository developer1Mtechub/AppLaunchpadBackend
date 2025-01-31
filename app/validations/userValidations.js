const { body } = require("express-validator");

module.exports.registerValidations = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .trim()
    .escape()
    .withMessage("Valid email is required"),

  body("type")
    .notEmpty()
    .trim()
    .isIn(["EMAIL", "GOOGLE", "APPLE"]) // Validate ENUM values
    .withMessage("Signup type must be either 'EMAIL', 'GOOGLE', or 'APPLE'"),

  // Conditionally require 'token' if type is 'GOOGLE' or 'APPLE'
  body("token")
    .if(body("type").isIn(["GOOGLE", "APPLE"]))
    .notEmpty()
    .trim()
    .withMessage("Token is required for GOOGLE or APPLE login"),

  // Conditionally require 'password' only if type is 'EMAIL'
  body("password")
    .if(body("type").equals("EMAIL"))
    .notEmpty()
    .withMessage("Password is required for EMAIL login")
    .trim()
    .isLength({ min: 8, max: 32 })
    .withMessage("Password must be between 8 and 32 characters"),
];

module.exports.loginValidations = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .trim()
    .escape()
    .withMessage("email is required"),
  body("fcm").not().isEmpty().withMessage("FCM token is required"),
  body("type")
    .isIn(["EMAIL", "GOOGLE"]) // Validate ENUM values
    .withMessage("Signup type must be either 'email' or 'google'"),
];
module.exports.emailValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .trim()
    .escape()
    .withMessage("email is required"),
];
module.exports.changePasswordValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .trim()
    .escape()
    .withMessage("email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("New Password must be at least 6 characters long"),
  body("otp").isNumeric().withMessage("OTP must be a number"),
  body("token").not().isEmpty().withMessage("Token is required"),
];
//profile update
module.exports.profileUpdateValidation = [
  body("name").optional().isString().withMessage("Name must be a string"),
  body("avatar").optional().isString().withMessage("Avatar must be a string"),
];
