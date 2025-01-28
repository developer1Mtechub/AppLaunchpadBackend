const { pool } = require("../../config/db");

class TextController {
  // Create a new text entry
  async createText(req, res) {
    const {
      page_id,
      name,
      text,
      color,
      rotation,
      x,
      y,
      width,
      height,
      font_size,
      font_style,
      font_alignment,
      line_height,
      font_family,
      font_weight,
      text_decoration,
      text_transform,
      text_shadow,
      text_outline,
      text_background,
      text_border,
      border_radius,
      border_color,
      border_width,
      background_color,
      z_index,
    } = req.body;

    try {
      // Validate required fields
      if (!page_id || !name) {
        return res.status(400).json({
          error: true,
          message: 'The "page_id" and "name" fields are required.',
        });
      }

      // Check if the referenced page exists
      const pageExists = await pool.query(
        `SELECT id FROM pages WHERE id = $1`,
        [page_id]
      );
      if (pageExists.rows.length === 0) {
        return res.status(404).json({
          error: true,
          message: "The referenced page does not exist.",
        });
      }

      // Insert the new text entry
      const result = await pool.query(
        `INSERT INTO texts (
            page_id, name, text, color, rotation, x, y, width, height, font_size, font_style, font_alignment,
            line_height, font_family, font_weight, text_decoration, text_transform, text_shadow,
            text_outline, text_background, text_border, border_radius, border_color, border_width,
            background_color, z_index
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26) 
          RETURNING *`,
        [
          page_id,
          name,
          text || "",
          color || "#000000",
          rotation || 0,
          x || 0,
          y || 0,
          width || 0,
          height || 0,
          font_size || 16,
          font_style || "normal",
          font_alignment || "center",
          line_height || 20,
          font_family || "Arial",
          font_weight || "normal",
          text_decoration || "none",
          text_transform || "none",
          text_shadow || "",
          text_outline || "",
          text_background || "",
          text_border || "",
          border_radius || 0,
          border_color || "#000000",
          border_width || 0,
          background_color || "#FFFFFF",
          z_index || 1,
        ]
      );

      res.status(201).json({
        error: false,
        message: "Text entry created successfully!",
        data: result.rows[0],
      });
    } catch (err) {
      console.error("Error creating text entry:", err);
      res
        .status(500)
        .json({ error: true, message: "An internal server error occurred." });
    }
  }

  // Get all text entries
  async getAllTexts(req, res) {
    try {
      const result = await pool.query("SELECT * FROM texts");
      res.status(200).json({
        error: false,
        message: "Text entries fetched successfully",
        data: result.rows,
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: true, message: "Error fetching text entries" });
    }
  }

  // Get a single text entry by ID
  async getTextById(req, res) {
    const { id } = req.params;

    try {
      const result = await pool.query("SELECT * FROM texts WHERE id = $1", [
        id,
      ]);
      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ error: true, message: "Text entry not found" });
      }

      res.status(200).json({
        error: false,
        message: "Text entry fetched successfully",
        data: result.rows[0],
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: true, message: "Error fetching text entry" });
    }
  }

  //Get all text entries by page ID
  async getTextsByPageId(req, res) {
    const { page_id } = req.params;

    try {
      const result = await pool.query(
        "SELECT * FROM texts WHERE page_id = $1",
        [page_id]
      );

      res.status(200).json({
        error: false,
        message: "Text entries fetched successfully",
        data: result.rows,
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: true, message: "Error fetching text entries" });
    }
  }

  // Update a text entry by ID
  async updateText(req, res) {
    const { id } = req.params;
    const updates = req.body;

    try {
      // Dynamically build the SET clause for the update query
      const setClause = Object.keys(updates)
        .map((key, index) => `${key} = $${index + 1}`)
        .join(", ");

      const values = Object.values(updates);

      const result = await pool.query(
        `UPDATE texts SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $${
          values.length + 1
        } RETURNING *`,
        [...values, id]
      );

      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ error: true, message: "Text entry not found" });
      }

      res.status(200).json({
        error: false,
        message: "Text entry updated successfully",
        data: result.rows[0],
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: true, message: "Error updating text entry" });
    }
  }

  // Delete a text entry by ID
  async deleteText(req, res) {
    const { id } = req.params;

    try {
      const result = await pool.query(
        "DELETE FROM texts WHERE id = $1 RETURNING *",
        [id]
      );
      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ error: true, message: "Text entry not found" });
      }

      res
        .status(200)
        .json({ error: false, message: "Text entry deleted successfully" });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: true, message: "Error deleting text entry" });
    }
  }
}

module.exports = new TextController();
