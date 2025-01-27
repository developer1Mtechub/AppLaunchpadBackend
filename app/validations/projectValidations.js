const { body } = require("express-validator");

module.exports.projectValidations = [
  body("user_id")
    .not()
    .isEmpty()
    .trim()
    .escape()
    .isInt()
    .withMessage("User ID must be a valid number"),
  body("pages")
    .not()
    .isEmpty()
    .trim()
    .escape()
    .isInt()
    .withMessage("Pages field must be a valid number"), // Adjusted message
];
