const { body, validationResult } = require("express-validator");

// Validation middleware
const validatePage = [
  body("project_id")
    .isInt({ gt: 0 })
    .withMessage("Project ID must be a positive integer"),
  body("height")
    .isInt({ gt: 0 })
    .withMessage("Height must be a positive integer"),
  body("width")
    .isInt({ gt: 0 })
    .withMessage("Width must be a positive integer"),
  body("background_color")
    .optional()
    .isString()
    .withMessage("Background color must be a string"),
  body("background_image")
    .optional()
    .isURL()
    .withMessage("Background image must be a valid URL"),
  body("background_image_type")
    .optional()
    .isString()
    .withMessage("Background image type must be a string"),
];

module.exports = { validatePage };
