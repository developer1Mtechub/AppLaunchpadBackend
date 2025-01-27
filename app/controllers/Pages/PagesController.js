const { pool } = require("../../config/db");

const PagesController = {
  // Create a new page
  async createPage(req, res) {
    try {
      const {
        project_id,
        height,
        width,
        background_color,
        background_image,
        background_image_type,
      } = req.body;

      const query = `
        INSERT INTO pages (project_id, height, width, background_color, background_image, background_image_type)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `;

      const result = await pool.query(query, [
        project_id,
        height,
        width,
        background_color,
        background_image,
        background_image_type,
      ]);

      res.status(201).json({
        error: false,
        message: "Page created successfully",
        page: result.rows[0],
      });
    } catch (error) {
      console.error("Error creating page:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },

  // Get all pages with optional pagination

  async getPages(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = "id",
        sortOrder = "ASC",
      } = req.query;

      const offset = (page - 1) * limit;

      // Whitelist valid columns to prevent SQL injection
      const validSortColumns = [
        "id",
        "project_id",
        "height",
        "width",
        "background_color",
        "created_at",
        "updated_at",
      ];
      const validSortOrders = ["ASC", "DESC"];

      // Validate the sortBy and sortOrder
      const column = validSortColumns.includes(sortBy) ? sortBy : "id"; // Default to 'id' if invalid
      const order = validSortOrders.includes(sortOrder.toUpperCase())
        ? sortOrder.toUpperCase()
        : "ASC"; // Default to 'ASC' if invalid

      // Query for fetching pages with sorting
      const query = `
        SELECT * FROM pages
        ORDER BY ${column} ${order}
        LIMIT $1 OFFSET $2;
      `;

      const result = await pool.query(query, [limit, offset]);

      // Query for total records
      const totalResult = await pool.query("SELECT COUNT(*) FROM pages");
      const total = totalResult.rows[0].count;

      res.status(200).json({
        data: result.rows,
        pagination: {
          totalRecords: parseInt(total),
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Error fetching pages:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },

  //Get By Project ID
  async getPagesByProject(req, res) {
    try {
      const {
        project_id, // Retrieve project_id from query params
        page = 1,
        limit = 10,
        sortBy = "id",
        sortOrder = "ASC",
      } = req.query;

      // Ensure project_id is provided
      if (!project_id) {
        return res
          .status(400)
          .json({ error: true, message: "Project ID is required" });
      }

      const offset = (page - 1) * limit;

      // Whitelist valid columns to prevent SQL injection
      const validSortColumns = [
        "id",
        "project_id",
        "height",
        "width",
        "background_color",
        "created_at",
        "updated_at",
      ];
      const validSortOrders = ["ASC", "DESC"];

      // Validate the sortBy and sortOrder
      const column = validSortColumns.includes(sortBy) ? sortBy : "id"; // Default to 'id' if invalid
      const order = validSortOrders.includes(sortOrder.toUpperCase())
        ? sortOrder.toUpperCase()
        : "ASC"; // Default to 'ASC' if invalid

      // Query for fetching pages by project_id with sorting
      const query = `
        SELECT * FROM pages
        WHERE project_id = $1
        ORDER BY ${column} ${order}
        LIMIT $2 OFFSET $3;
      `;

      const result = await pool.query(query, [project_id, limit, offset]);

      // Query for total records for the specific project_id
      const totalResult = await pool.query(
        "SELECT COUNT(*) FROM pages WHERE project_id = $1",
        [project_id]
      );
      const total = totalResult.rows[0].count;

      res.status(200).json({
        data: result.rows,
        pagination: {
          totalRecords: parseInt(total),
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Error fetching pages:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },
  // Get a single page by ID
  async getPageById(req, res) {
    try {
      const { id } = req.params;

      const query = `
        SELECT * FROM pages WHERE id = $1;
      `;
      const result = await pool.query(query, [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: true, message: "Page not found" });
      }

      res.status(200).json({
        error: false,
        page: result.rows[0],
      });
    } catch (error) {
      console.error("Error fetching page:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },

  // Update a page
  async updatePage(req, res) {
    try {
      const { id } = req.params;
      const {
        height,
        width,
        background_color,
        background_image,
        background_image_type,
      } = req.body;

      const query = `
        UPDATE pages
        SET 
          height = COALESCE($1, height),
          width = COALESCE($2, width),
          background_color = COALESCE($3, background_color),
          background_image = COALESCE($4, background_image),
          background_image_type = COALESCE($5, background_image_type),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $6
        RETURNING *;
      `;

      const result = await pool.query(query, [
        height,
        width,
        background_color,
        background_image,
        background_image_type,
        id,
      ]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: true, message: "Page not found" });
      }

      res.status(200).json({
        error: false,
        message: "Page updated successfully",
        page: result.rows[0],
      });
    } catch (error) {
      console.error("Error updating page:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },

  // Delete a page
  async deletePage(req, res) {
    try {
      const { id } = req.params;

      const query = `
        DELETE FROM pages WHERE id = $1 RETURNING *;
      `;

      const result = await pool.query(query, [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: true, message: "Page not found" });
      }

      res.status(200).json({
        error: false,
        message: "Page deleted successfully",
        page: result.rows[0],
      });
    } catch (error) {
      console.error("Error deleting page:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },
};

module.exports = PagesController;
