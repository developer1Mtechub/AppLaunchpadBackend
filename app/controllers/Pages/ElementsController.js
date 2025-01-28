const { pool } = require("../../config/db");

class ElementsController {
  // Create a new element
  async createElement(req, res) {
    const {
      page_id,
      name,
      rotation_z,
      x,
      y,
      width,
      height,
      z_index,
      background_color,
    } = req.body;

    try {
      const result = await pool.query(
        `INSERT INTO elements (
          page_id, name, rotation_z, x, y, width, height, z_index, background_color
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [
          page_id,
          name,
          rotation_z,
          x,
          y,
          width,
          height,
          z_index,
          background_color,
        ]
      );
      res.status(201).json({ error: false, data: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: true, message: "Error creating element" });
    }
  }

  // Get all elements
  async getAllElements(req, res) {
    try {
      const result = await pool.query("SELECT * FROM elements ORDER BY id ASC");
      res.status(200).json({ error: false, data: result.rows });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: true, message: "Error fetching elements" });
    }
  }

  // Get a single element by ID
  async getElementById(req, res) {
    const { id } = req.params;

    try {
      const result = await pool.query("SELECT * FROM elements WHERE id = $1", [
        id,
      ]);
      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ error: true, message: "Element not found" });
      }
      res.status(200).json({ error: false, data: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: true, message: "Error fetching element" });
    }
  }

  // Get elements by page ID
  async getElementsByPageId(req, res) {
    const { page_id } = req.params;

    try {
      const result = await pool.query(
        "SELECT * FROM elements WHERE page_id = $1 ORDER BY id ASC",
        [page_id]
      );
      res.status(200).json({ error: false, data: result.rows });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: true, message: "Error fetching elements" });
    }
  }

  // Update an element by ID
  async updateElement(req, res) {
    const { id } = req.params;
    const updates = req.body;

    try {
      // Dynamically build the SET clause for the update query
      const setClause = Object.keys(updates)
        .map((key, index) => `${key} = $${index + 1}`)
        .join(",");

      const values = Object.values(updates);

      const result = await pool.query(
        `UPDATE elements SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $${
          values.length + 1
        } RETURNING *`,
        [...values, id]
      );

      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ error: true, message: "Element not found" });
      }

      res.status(200).json({ error: false, data: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: true, message: "Error updating element" });
    }
  }

  // Delete an element by ID
  async deleteElement(req, res) {
    const { id } = req.params;

    try {
      const result = await pool.query(
        "DELETE FROM elements WHERE id = $1 RETURNING *",
        [id]
      );
      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ error: true, message: "Element not found" });
      }
      res.status(200).json({
        error: false,
        message: "Element deleted successfully",
        data: result.rows[0],
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: true, message: "Error deleting element" });
    }
  }
}

module.exports = new ElementsController();
