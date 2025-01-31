const express = require("express");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const { pool } = require("./config/db");
const router = express.Router();

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/project/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true }); // Ensure directory exists
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter for images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Multer upload configuration for multiple files
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // 10 MB max file size
  fileFilter: fileFilter,
});

// ------------------ CREATE: Upload Multiple Images ------------------
router.post("/images", upload.array("images"), async (req, res) => {
  try {
    //user expects project_id, user_id

    const { project_id, user_id } = req.body;
    //please check the user exsists
    const userExists = await pool.query(
      "SELECT * FROM users WHERE user_id = $1",
      [user_id]
    );
    if (userExists.rows.length === 0) {
      return res.status(404).json({ error: true, message: "User not found" });
    }
    //please check the project exsists
    const projectExists = await pool.query(
      "SELECT * FROM projects WHERE project_id = $1",
      [project_id]
    );
    if (projectExists.rows.length === 0) {
      return res
        .status(404)
        .json({ error: true, message: "Project not found" });
    }

    if (!project_id || !user_id || !req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ error: true, message: "Missing fields or no images uploaded" });
    }

    const imagePaths = req.files.map((file) => file.path); // Store file paths

    const result = await pool.query(
      "INSERT INTO projectMultipleImages (project_id, user_id, multiple_image) VALUES ($1, $2, $3) RETURNING *",
      [project_id, user_id, JSON.stringify(imagePaths)]
    );

    res.status(201).json({
      error: false,
      message: "Images uploaded successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(500).json({ error: true, message: "Error uploading images" });
  }
});

// ------------------ READ: Get Images by Project ID ------------------
router.get("/project-images/:project_id", async (req, res) => {
  try {
    const { project_id } = req.params;

    const result = await pool.query(
      "SELECT * FROM projectMultipleImages WHERE project_id = $1",
      [project_id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: true, message: "No images found for this project" });
    }

    res.status(200).json({ error: false, data: result.rows });
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ error: true, message: "Error fetching images" });
  }
});

// ------------------ UPDATE: Replace Images ------------------
router.put("/project-images/:id", upload.array("images"), async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch existing images
    const existing = await pool.query(
      "SELECT multiple_image FROM projectMultipleImages WHERE id = $1",
      [id]
    );
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: true, message: "Record not found" });
    }

    const oldImages = JSON.parse(existing.rows[0].multiple_image);

    // Delete old images
    oldImages.forEach((image) => {
      const filePath = path.resolve(image);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    // Save new images
    const newImagePaths = req.files.map((file) => file.path);

    const updateResult = await pool.query(
      "UPDATE projectMultipleImages SET multiple_image = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
      [JSON.stringify(newImagePaths), id]
    );

    res.json({
      error: false,
      message: "Images updated successfully",
      data: updateResult.rows[0],
    });
  } catch (error) {
    console.error("Error updating images:", error);
    res.status(500).json({ error: true, message: "Error updating images" });
  }
});

// ------------------ DELETE: Remove Image by ID ------------------
router.delete("/project-images/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch images from DB
    const result = await pool.query(
      "SELECT multiple_image FROM projectMultipleImages WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: true, message: "Images not found" });
    }

    const images = JSON.parse(result.rows[0].multiple_image);

    // Delete images from storage
    images.forEach((image) => {
      const filePath = path.resolve(image);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    // Delete record from DB
    await pool.query("DELETE FROM projectMultipleImages WHERE id = $1", [id]);

    res
      .status(200)
      .json({ error: false, message: "Images deleted successfully" });
  } catch (error) {
    console.error("Error deleting images:", error);
    res.status(500).json({ error: true, message: "Error deleting images" });
  }
});

module.exports = router;
