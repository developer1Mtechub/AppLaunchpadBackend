const express = require("express");
const TextController = require("../controllers/Pages/TextsController");
const router = express.Router();
// Create a new text entry
router.post("/", TextController.createText);
// Get all text entries
router.get("/", TextController.getAllTexts);
// Get a single text entry by ID
router.get("/:id", TextController.getTextById);
// Get all text entries by page ID
router.get("/page/:page_id", TextController.getTextsByPageId);
// Update a text entry
router.put("/:id", TextController.updateText);
// Delete a text entry
router.delete("/:id", TextController.deleteText);

module.exports = router;
