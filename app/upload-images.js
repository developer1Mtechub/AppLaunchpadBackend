const express = require("express");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const { pool } = require("./config/db");
const router = express.Router();

// Multer storage setup for file uploads
const multerMiddleWareStorage = multer.diskStorage({
  destination: (req, res, callBack) => {
    callBack(null, "uploads/");
  },
  filename: (req, file, callBack) => {
    const originalname = file.originalname.replace(/\s/g, ""); // Remove spaces
    const timestamp = Date.now();
    const extension = path.extname(originalname);
    callBack(
      null,
      `${path.basename(originalname, extension)}${timestamp}${extension}`
    );
  },
});

// File filter for accepted file types
const fileFilter = (req, file, callBack) => {
  const allowedFileTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "routerlication/vnd.android.package-archive",
  ];
  if (allowedFileTypes.includes(file.mimetype)) {
    callBack(null, true);
  } else {
    callBack(null, false);
  }
};

// Initialize multer
const upload = multer({
  storage: multerMiddleWareStorage,
  limits: {
    fileSize: 1000000000, // 1000 MB
  },
  fileFilter: fileFilter,
});

// CRUD Routes

// 1. Create: Upload an image and save to the database
router.post("/image", upload.single("image"), async (req, res) => {
  try {
    const imagePath = req.file.path;

    const { user_id, imageType } = req.body; // Assuming user_id is sent with the form

    // Insert image data into the database
    const result = await pool.query(
      "INSERT INTO images (user_id, image, image_type) VALUES ($1, $2, $3) RETURNING *",
      [user_id, imagePath, imageType]
    );

    res.json({ message: "Image uploaded successfully", image: result.rows[0] });
  } catch (error) {
    res.status(500).send({ error: "Error uploading image" });
  }
});

// 2. Read: Get images for a specific user with optional image_type filter
router.get("/image", async (req, res) => {
  try {
    const { userId, image_type } = req.query; // Use query parameters instead of body for GET requests
    let query = "SELECT * FROM images WHERE user_id = $1";
    let queryParams = [userId];

    // If image_type is provided, add it to the query
    if (image_type) {
      query += " AND image_type = $2";
      queryParams.push(image_type);
    }

    const result = await pool.query(query, queryParams);
    res.json(result.rows);
  } catch (error) {
    res.status(500).send({ error: "Error fetching images" });
  }
});

// 4. Update: Update image details

router.put("/image/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the old image path from the database
    const result = await pool.query("SELECT image FROM images WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).send({ error: "Image not found" });
    }

    const oldImagePath = result.rows[0].image; // Old image path stored in the database

    // Construct the full path to the old image
    const oldImageFullPath = path.resolve(oldImagePath); // Adjusted to match absolute path

    // Check if the old image file exists and delete it
    if (fs.existsSync(oldImageFullPath)) {
      fs.unlinkSync(oldImageFullPath); // Delete the old image file
    }

    // Get the path of the new image
    const newImagePath = req.file.path; // Path of the new uploaded image

    // Update the database with the new image path
    const updateResult = await pool.query(
      "UPDATE images SET image = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
      [newImagePath, id]
    );

    // Respond with the success message and updated image data
    res.json({
      message: "Image updated successfully",
      image: updateResult.rows[0],
    });
  } catch (error) {
    console.error("Error updating image:", error);
    res.status(500).send({ error: "Error updating image" });
  }
});

// 5. Delete: Delete an image by ID
router.delete("/image/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch image data to get the file path from the database
    const result = await pool.query("SELECT * FROM images WHERE id = $1", [id]);

    // If no image found, return a 404 error
    if (result.rows.length === 0) {
      return res.status(404).send({ error: "Image not found" });
    }

    const imagePath = result.rows[0].image; // Retrieve the image path from the database

    // Construct the full path to the image file
    const imageFilePath = path.join(
      "D:",
      "MTechub",
      "AppLaunchpadBackend",
      imagePath
    );

    // Check if the file exists before attempting to delete it
    if (!fs.existsSync(imageFilePath)) {
      return res.status(404).send({ error: "Image file not found on server" });
    }

    // Delete the image file from the server
    fs.unlinkSync(imageFilePath); // Synchronously delete the file from the filesystem

    // Now, delete the image record from the database
    await pool.query("DELETE FROM images WHERE id = $1", [id]);

    // Send success response
    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    // Log the error to the console and send a 500 server error response
    console.error("Error deleting image:", error);
    res.status(500).send({ error: "Error deleting image" });
  }
});

module.exports = router;
