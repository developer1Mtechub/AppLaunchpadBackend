const express = require("express");
const router = express.Router();
const PagesController = require("../controllers/Pages/PagesController"); // Adjust the path as needed

// Create a page
router.post("/", PagesController.createPage);

// Get all pages with pagination and sorting
router.get("/", PagesController.getPages);

// Get all pages for a project
router.get("/project", PagesController.getPagesByProject);

// Get a single page by ID
router.get("/:id", PagesController.getPageById);

// Update a page
router.put("/:id", PagesController.updatePage);

// Delete a page
router.delete("/:id", PagesController.deletePage);

module.exports = router;
