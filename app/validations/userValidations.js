const { body } = require("express-validator");
module.exports.registerValidations = [
  //   body("name").not().isEmpty().trim().escape().withMessage("name is required"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .trim()
    .escape()
    .withMessage("email is required"),
  body("signup_type")
    .isIn(["EMAIL", "GOOGLE"]) // Validate ENUM values
    .withMessage("Signup type must be either 'EMAIL' or 'GOOGLE'"),
  body("fcm").not().isEmpty().withMessage("FCM token is required"),
];

module.exports.loginValidations = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .trim()
    .escape()
    .withMessage("email is required"),
  body("fcm").not().isEmpty().withMessage("FCM token is required"),
  body("signup_type")
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
