const { pool } = require("../../config/db");

class ImageGroupController {
  // Create a new image group
  async createImageGroup(req, res) {
    try {
      const { image_group_name } = req.body;

      if (!image_group_name) {
        return res.status(400).json({
          error: true,
          message: "Image group name is required",
          data: null,
        });
      }

      const query = `INSERT INTO imageGroup (image_group_name) VALUES ($1) RETURNING *`;
      const result = await pool.query(query, [image_group_name]);

      res.status(201).json({
        error: false,
        message: "Image group created successfully",
        data: result.rows[0],
      });
    } catch (error) {
      console.error("Error creating image group:", error);
      res.status(500).json({
        error: true,
        message: "Internal Server Error",
        data: null,
      });
    }
  }

  // Get all image groups with pagination or get a single image group by ID
  async getAllImageGroups(req, res) {
    try {
      let { page, limit, id } = req.query; // Get pagination params from query

      // If id exists, fetch the image group by id
      if (id) {
        const query = `SELECT * FROM imageGroup WHERE id = $1`;
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
          return res.status(404).json({
            error: true,
            message: "Image group not found",
            data: null,
          });
        }

        return res.json({
          error: false,
          message: "Image group retrieved successfully",
          data: result.rows[0],
        });
      }

      // Set default values for page and limit if not provided
      page = page ? parseInt(page) : 1;
      limit = limit ? parseInt(limit) : 10;

      // Calculate offset for pagination
      const offset = (page - 1) * limit;

      // Query to get image groups with pagination
      const query = `SELECT * FROM imageGroup ORDER BY created_at DESC LIMIT $1 OFFSET $2`;
      const result = await pool.query(query, [limit, offset]);

      // Query to get the total count of image groups
      const totalQuery = `SELECT COUNT(*) FROM imageGroup`;
      const totalResult = await pool.query(totalQuery);
      const totalCount = totalResult.rows[0].count;

      // Calculate total pages
      const totalPages = Math.ceil(totalCount / limit);

      res.json({
        error: false,
        message: "Image groups retrieved successfully",
        data: result.rows,
        pagination: {
          totalCount,
          totalPages,
          currentPage: page,
          pageSize: limit,
        },
      });
    } catch (error) {
      console.error("Error fetching image groups:", error);
      res.status(500).json({
        error: true,
        message: "Internal Server Error",
        data: null,
      });
    }
  }

  // Get a single image group by ID
  async getImageGroupById(req, res) {
    try {
      const { id } = req.params;
      const query = `SELECT * FROM imageGroup WHERE id = $1`;
      const result = await pool.query(query, [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          error: true,
          message: "Image group not found",
          data: null,
        });
      }

      res.json({
        error: false,
        message: "Image group retrieved successfully",
        data: result.rows[0],
      });
    } catch (error) {
      console.error("Error fetching image group:", error);
      res.status(500).json({
        error: true,
        message: "Internal Server Error",
        data: null,
      });
    }
  }

  // Update an image group
  async updateImageGroup(req, res) {
    try {
      const { id } = req.params;
      const { image_group_name } = req.body;

      if (!image_group_name) {
        return res.status(400).json({
          error: true,
          message: "No fields provided for update",
          data: null,
        });
      }

      const query = `UPDATE imageGroup SET image_group_name = $1, updated_at = NOW() WHERE id = $2 RETURNING *`;
      const result = await pool.query(query, [image_group_name, id]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          error: true,
          message: "Image group not found",
          data: null,
        });
      }

      res.json({
        error: false,
        message: "Image group updated successfully",
        data: result.rows[0],
      });
    } catch (error) {
      console.error("Error updating image group:", error);
      res.status(500).json({
        error: true,
        message: "Internal Server Error",
        data: null,
      });
    }
  }

  // Delete an image group
  async deleteImageGroup(req, res) {
    try {
      const { id } = req.params;
      const query = `DELETE FROM imageGroup WHERE id = $1 RETURNING *`;
      const result = await pool.query(query, [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          error: true,
          message: "Image group not found",
          data: null,
        });
      }

      res.json({
        error: false,
        message: "Image group deleted successfully",
        data: result.rows[0],
      });
    } catch (error) {
      console.error("Error deleting image group:", error);
      res.status(500).json({
        error: true,
        message: "Internal Server Error",
        data: null,
      });
    }
  }
}

module.exports = new ImageGroupController();
