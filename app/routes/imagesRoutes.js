const express = require("express");
const ImagesController = require("../controllers/Pages/ImagesController");
const router = express.Router();
//create add image route
router.post("/", ImagesController.createImage);
//create get all images route
router.get("/", ImagesController.getAllImages);
//create get images by page id route
router.get("/page/:page_id", ImagesController.getAllImagesByPageId);
//create get image by id route
router.get("/:id", ImagesController.getImageById);
//create update image route
router.put("/:id", ImagesController.updateImage);
//create delete image route
router.delete("/:id", ImagesController.deleteImage);

module.exports = router;
