const express = require("express");
const ImageGroupController = require("../controllers/Images/ImageGroupController");
const router = express.Router();

// Create a new image group
router.post("/", ImageGroupController.createImageGroup);
// Get all image groups
router.get("/", ImageGroupController.getAllImageGroups);
// Get a specific image group by ID
router.get("/:id", ImageGroupController.getImageGroupById);
// Update an image group
router.put("/:id", ImageGroupController.updateImageGroup);
// Delete an image group
router.delete("/:id", ImageGroupController.deleteImageGroup);

module.exports = router;
