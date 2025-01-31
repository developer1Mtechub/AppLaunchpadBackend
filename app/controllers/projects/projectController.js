const { validationResult } = require("express-validator");
const { pool } = require("../../config/db");

class ProjectController {
  // Create a new project

  async createProject(req, res) {
    try {
      // Validate request body
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), error: true });
      }

      const { project_title, user_id, pages } = req.body;
      //find the user
      const userQuery = "SELECT * FROM users WHERE user_id = $1";
      const userResult = await pool.query(userQuery, [user_id]);
      //please validation rewq
      if (userResult.rows.length === 0) {
        return res.status(404).json({
          error: true,
          message: "User not found",
        });
      }

      // Ensure user_id and pages are integers
      if (!Number.isInteger(Number(user_id))) {
        return res
          .status(400)
          .json({ error: true, message: "User ID must be an integer" });
      }

      if (!Number.isInteger(Number(pages))) {
        return res
          .status(400)
          .json({ error: true, message: "pages must be an integer" });
      }

      const insertQuery = `
        INSERT INTO projects (project_title, user_id, pages)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;

      const result = await pool.query(insertQuery, [
        project_title,
        user_id,
        pages,
      ]);

      res.status(201).json({
        error: false,
        message: "Project created successfully",
        project: result.rows[0],
      });
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  }
  async getProjects(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = "project_id",
        sortOrder = "ASC",
      } = req.query; // Default sortBy 'project_id' and sortOrder 'ASC'
      const offset = (page - 1) * limit;

      // Whitelist valid columns to prevent SQL injection
      const validSortColumns = [
        "project_id",
        "project_title",
        "user_id",
        "created_at",
        "updated_at",
      ];
      const validSortOrders = ["ASC", "DESC"];

      // Validate the sortBy and sortOrder
      const column = validSortColumns.includes(sortBy) ? sortBy : "project_id"; // Default to 'project_id' if invalid
      const order = validSortOrders.includes(sortOrder.toUpperCase())
        ? sortOrder.toUpperCase()
        : "ASC"; // Default to 'ASC' if invalid

      const query = `
        SELECT * FROM projects
        ORDER BY ${column} ${order} 
        LIMIT $1 OFFSET $2
      `;

      const result = await pool.query(query, [limit, offset]);

      const totalResult = await pool.query("SELECT COUNT(*) FROM projects");
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
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // Read a single project by ID
  async getProjectById(req, res) {
    try {
      const { id } = req.params;

      const query = "SELECT * FROM projects WHERE project_id = $1;";
      const result = await pool.query(query, [id]);

      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ error: true, message: "Project not found" });
      }

      res.status(200).json({
        error: false,
        project: result.rows[0],
      });
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  }

  // Update a project
  async updateProject(req, res) {
    try {
      const { id } = req.params;
      const { project_title, user_id, pages } = req.body;

      const updateQuery = `
        UPDATE projects 
        SET project_title = $1, user_id = $2, pages = $3, updated_at = CURRENT_TIMESTAMP
        WHERE project_id = $4 
        RETURNING *;
      `;
      const result = await pool.query(updateQuery, [
        project_title,
        user_id,
        pages,
        id,
      ]);

      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ error: true, message: "Project not found" });
      }

      res.status(200).json({
        error: false,
        message: "Project updated successfully",
        project: result.rows[0],
      });
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  }

  // Delete a project
  async deleteProject(req, res) {
    try {
      const { id } = req.params;

      const deleteQuery =
        "DELETE FROM projects WHERE project_id = $1 RETURNING *;";
      const result = await pool.query(deleteQuery, [id]);

      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ error: true, message: "Project not found" });
      }

      res.status(200).json({
        error: false,
        message: "Project deleted successfully",
        project: result.rows[0],
      });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  }
}

module.exports = new ProjectController();
