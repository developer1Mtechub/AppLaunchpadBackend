const { pool } = require("../../config/db");

class ImagesController {
  // Get all images
  async getAllImages(req, res) {
    try {
      const result = await pool.query(
        "SELECT * FROM imagesDevice ORDER BY created_at DESC"
      );
      res.json({
        error: false,
        message: "Images retrieved successfully",
        data: result.rows,
      });
    } catch (error) {
      console.error("Error fetching images:", error);
      res
        .status(500)
        .json({ error: true, message: "Internal Server Error", data: null });
    }
  }
  //get all images by page id
  async getAllImagesByPageId(req, res) {
    try {
      const { page_id } = req.params;
      const result = await pool.query(
        "SELECT * FROM imagesDevice WHERE page_id = $1 ORDER BY created_at DESC",
        [page_id]
      );
      res.json({
        error: false,
        message: "Images retrieved successfully",
        data: result.rows,
      });
    } catch (error) {
      console.error("Error fetching images:", error);
      res
        .status(500)
        .json({ error: true, message: "Internal Server Error", data: null });
    }
  }

  // Get a single image by ID
  async getImageById(req, res) {
    try {
      const { id } = req.params;
      const result = await pool.query(
        "SELECT * FROM imagesDevice WHERE id = $1",
        [id]
      );
      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ error: true, message: "Image not found", data: null });
      }
      res.json({
        error: false,
        message: "Image retrieved successfully",
        data: result.rows[0],
      });
    } catch (error) {
      console.error("Error fetching image:", error);
      res
        .status(500)
        .json({ error: true, message: "Internal Server Error", data: null });
    }
  }

  // Create a new image entry
  async createImage(req, res) {
    try {
      const {
        page_id,
        name,
        image_url,
        x,
        y,
        width,
        height,
        rotation_x,
        rotation_y,
        rotation_z,
        border_radius,
        border_color,
        border_width,
        shadow_h,
        shadow_w,
        shadow_blur,
        shadow_color,
        flip_x,
        flip_y,
        z_index,
      } = req.body;

      // Check if page_id exists in the database
      if (page_id) {
        const pageCheckQuery = `SELECT id FROM pages WHERE id = $1`;
        const pageCheckResult = await pool.query(pageCheckQuery, [page_id]);

        if (pageCheckResult.rows.length === 0) {
          return res.status(404).json({
            error: true,
            message: "Page not found",
            data: null,
          });
        }
      }
      const result = await pool.query(
        `INSERT INTO imagesDevice (page_id, name, image_url, x, y, width, height, rotation_x, rotation_y, rotation_z, border_radius, border_color, border_width, shadow_h, shadow_w, shadow_blur, shadow_color, flip_x, flip_y, z_index)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
        RETURNING *`,
        [
          page_id,
          name,
          image_url,
          x,
          y,
          width,
          height,
          rotation_x,
          rotation_y,
          rotation_z,
          border_radius,
          border_color,
          border_width,
          shadow_h,
          shadow_w,
          shadow_blur,
          shadow_color,
          flip_x,
          flip_y,
          z_index,
        ]
      );
      res.status(201).json({
        error: false,
        message: "Image created successfully",
        data: result.rows[0],
      });
    } catch (error) {
      console.error("Error creating image:", error);
      res
        .status(500)
        .json({ error: true, message: "Internal Server Error", data: null });
    }
  }

  // Update an existing image with optional fields
  async updateImage(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const { page_id } = updates; // Extract page_id from the request body

      // Check if page_id exists in the database
      if (page_id) {
        const pageCheckQuery = `SELECT id FROM pages WHERE id = $1`;
        const pageCheckResult = await pool.query(pageCheckQuery, [page_id]);

        if (pageCheckResult.rows.length === 0) {
          return res.status(404).json({
            error: true,
            message: "Page not found",
            data: null,
          });
        }
      }

      // Ensure at least one valid field is provided for updating
      const validFields = Object.entries(updates).filter(
        ([_, value]) => value !== undefined && value !== null
      );

      if (validFields.length === 0) {
        return res.status(400).json({
          error: true,
          message: "No valid fields provided for update",
          data: null,
        });
      }

      // Dynamically build the SET clause
      const fields = validFields.map(
        ([key], index) => `${key} = $${index + 1}`
      );
      const values = validFields.map(([_, value]) => value);

      // Add updated_at field
      fields.push(`updated_at = CURRENT_TIMESTAMP`);

      // Add the ID to values array
      values.push(id);

      // Construct the final SQL query
      const query = `UPDATE imagesDevice SET ${fields.join(", ")} WHERE id = $${
        values.length
      } RETURNING *`;

      // Execute query
      const result = await pool.query(query, values);

      // Check if the image exists
      if (result.rows.length === 0) {
        return res.status(404).json({
          error: true,
          message: "Image not found",
          data: null,
        });
      }

      // Success response
      res.json({
        error: false,
        message: "Image updated successfully",
        data: result.rows[0],
      });
    } catch (error) {
      console.error("Error updating image:", error);
      res.status(500).json({
        error: true,
        message: "Internal Server Error",
        data: null,
      });
    }
  }

  // Delete an image by ID
  async deleteImage(req, res) {
    try {
      const { id } = req.params;
      const result = await pool.query(
        "DELETE FROM imagesDevice WHERE id = $1 RETURNING *",
        [id]
      );
      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ error: true, message: "Image not found", data: null });
      }
      res.json({
        error: false,
        message: "Image deleted successfully",
        data: null,
      });
    } catch (error) {
      console.error("Error deleting image:", error);
      res
        .status(500)
        .json({ error: true, message: "Internal Server Error", data: null });
    }
  }
}

module.exports = new ImagesController();
