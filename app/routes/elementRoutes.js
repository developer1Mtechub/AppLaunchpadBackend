const express = require("express");
const ElementController = require("../controllers/Pages/ElementsController");
const router = express.Router();
// Create a new element entry
router.post("/", ElementController.createElement);
// Get all element entries
router.get("/", ElementController.getAllElements);
// Get a specific element entry by ID
router.get("/:id", ElementController.getElementById);
// Get all element entries by page ID
router.get("/page/:page_id", ElementController.getElementsByPageId);
// Update an element entry
router.put("/:id", ElementController.updateElement);
// Delete an element entry
router.delete("/:id", ElementController.deleteElement);
module.exports = router;
