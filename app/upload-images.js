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

// Route to upload an image
router.post("/image", upload.single("image"), async (req, res) => {
  try {
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({ error: true, message: "No file uploaded" });
    }

    // Extract form fields
    const { user_id, image_type, image_group_id } = req.body;

    // Validate required fields
    if (!user_id || !image_type || !image_group_id) {
      return res
        .status(400)
        .json({ error: true, message: "Missing required fields" });
    }

    // Get the uploaded image path
    const imagePath = req.file.path;

    // Insert image data into PostgreSQL
    const result = await pool.query(
      "INSERT INTO uploadImages (user_id, image, image_type, image_group_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [user_id, imagePath, image_type, image_group_id]
    );

    res.status(201).json({
      error: false,
      message: "Image uploaded successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error in image upload:", error);
    res.status(500).json({ error: true, message: "Error uploading image" });
  }
});

// 2. Read: Get uploadImages for a specific user with optional image_type filter
router.get("/image", async (req, res) => {
  try {
    const { userId, image_type, image_group_id } = req.query; // Use query parameters for GET requests

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    let query = "SELECT * FROM uploadImages WHERE user_id = $1";
    let queryParams = [userId];
    let paramIndex = 2; // PostgreSQL uses numbered placeholders ($1, $2, etc.)

    // Add optional filters
    if (image_type) {
      query += ` AND image_type = $${paramIndex}`;
      queryParams.push(image_type);
      paramIndex++;
    }

    if (image_group_id) {
      query += ` AND image_group_id = $${paramIndex}`;
      queryParams.push(image_group_id);
    }

    const result = await pool.query(query, queryParams);
    res.status(200).json({ error: false, data: result.rows });
  } catch (error) {
    console.error("Error fetching uploadImages:", error);
    res
      .status(500)
      .json({ error: true, message: "Error fetching uploadImages" });
  }
});

// 4. Update: Update image details

router.put("/image/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the old image path from the database
    const result = await pool.query(
      "SELECT image FROM uploadImages WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send({ error: true, message: "Image not found" });
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
      "UPDATE uploadImages SET image = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
      [newImagePath, id]
    );

    // Respond with the success message and updated image data
    res.json({
      error: false,
      message: "Image updated successfully",
      data: updateResult.rows[0],
    });
  } catch (error) {
    console.error("Error updating image:", error);
    res.status(500).send({ error: true, message: "Error updating image" });
  }
});

// 5. Delete: Delete an image by ID
router.delete("/image/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch image data to get the file path from the database
    const result = await pool.query(
      "SELECT image FROM uploadImages WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: true, message: "Image not found" });
    }

    const imagePath = result.rows[0].image; // Path stored in DB (could be relative)
    const baseDirectory = path.join(__dirname, ".."); // Adjust as needed

    // Construct the absolute path to the image file
    const imageFilePath = path.join(baseDirectory, imagePath);

    // Check if the file exists before attempting to delete it
    if (fs.existsSync(imageFilePath)) {
      fs.unlinkSync(imageFilePath); // Delete the image file
    } else {
      console.warn(`File not found: ${imageFilePath}`);
    }

    // Delete the image record from the database
    await pool.query("DELETE FROM uploadImages WHERE id = $1", [id]);

    res
      .status(200)
      .json({ error: false, message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ error: true, message: "Error deleting image" });
  }
});

module.exports = router;
