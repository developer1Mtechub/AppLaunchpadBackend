const { pool } = require("../../config/db");

class Project {
  // Create or Update a project (Upsert)
  async upsertProject(req, res) {
    try {
      const { id, project_title } = req.body;

      if (id) {
        // If id exists, update the project
        const updateQuery = `
          UPDATE project 
          SET project_title = $1 
          WHERE project_id = $2 
          RETURNING *;
        `;
        const result = await pool.query(updateQuery, [project_title, id]);

        if (result.rows.length === 0) {
          return res
            .status(404)
            .json({ error: true, message: "Project not found" });
        }

        res.status(200).json({
          error: false,
          message: "Project updated",
          project: result.rows[0],
        });
      } else {
        // If id does not exist, create a new project
        const insertQuery = `
          INSERT INTO project (project_title) 
          VALUES ($1) 
          RETURNING *;
        `;
        const result = await pool.query(insertQuery, [project_title]);
        res.status(201).json({
          error: false,
          message: "Project created",
          project: result.rows[0],
        });
      }
    } catch (error) {
      console.error("Error creating/updating project:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  }

  // Get all projects
  async getProjects(req, res) {
    try {
      const result = await pool.query("SELECT * FROM project;");
      res.status(200).json({ error: false, projects: result.rows });
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  }

  // Get a single project by ID
  async getProjectById(req, res) {
    try {
      const { id } = req.params;
      const query = "SELECT * FROM project WHERE project_id = $1;";
      const result = await pool.query(query, [id]);

      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ error: true, message: "Project not found" });
      }

      res.status(200).json({ error: false, project: result.rows[0] });
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  }

  // Delete a project
  async deleteProject(req, res) {
    try {
      const { id } = req.params;
      const query = "DELETE FROM project WHERE project_id = $1 RETURNING *;";
      const result = await pool.query(query, [id]);

      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ error: true, message: "Project not found" });
      }

      res.status(200).json({
        error: false,
        message: "Project deleted",
        project: result.rows[0],
      });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  }
}

module.exports = new Project();
