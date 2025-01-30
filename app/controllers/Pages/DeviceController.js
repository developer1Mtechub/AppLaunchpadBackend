const { pool } = require("../../config/db");

class DeviceController {
  constructor() {}

  async getAllDevices(req, res) {
    try {
      const devices = await pool.query("SELECT * FROM devices");
      res.json({
        error: false,
        message: "Devices fetched successfully",
        data: devices.rows,
      });
    } catch (error) {
      res.status(500).json({ error: true, message: error.message });
    }
  }

  async getDeviceById(req, res) {
    try {
      const result = await pool.query("SELECT * FROM devices WHERE id = $1", [
        req.params.id,
      ]);
      if (result.rows.length > 0) {
        res.json({
          error: false,
          message: "Device found",
          data: result.rows[0],
        });
      } else {
        res.status(404).json({ error: true, message: "Device not found" });
      }
    } catch (error) {
      res.status(500).json({ error: true, message: error.message });
    }
  }
  async getDevicesByPageId(req, res) {
    try {
      const result = await pool.query(
        "SELECT * FROM devices WHERE pages = $1",
        [req.params.page_id]
      );
      if (result.rows.length > 0) {
        res.json({
          error: false,
          message: "Devices found",
          data: result.rows,
        });
      } else {
        res.status(404).json({ error: true, message: "Devices not found" });
      }
    } catch (error) {
      res.status(500).json({ error: true, message: error.message });
    }
  }

  async createDevice(req, res) {
    try {
      const {
        pages,
        name,
        image_url,
        rotation_x,
        rotation_y,
        rotation_z,
        skew_x,
        skew_y,
        shadow_h,
        shadow_w,
        shadow_blur,
        shadow_color,
        x,
        y,
        width,
        height,
        z_index,
      } = req.body;

      const result = await pool.query(
        `INSERT INTO devices (pages, name, image_url, rotation_x, rotation_y, rotation_z, 
          skew_x, skew_y, shadow_h, shadow_w, shadow_blur, shadow_color, x, y, width, height, z_index)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
         RETURNING *`,
        [
          pages,
          name,
          image_url,
          rotation_x || 0,
          rotation_y || 0,
          rotation_z || 0,
          skew_x || 0,
          skew_y || 0,
          shadow_h || 0,
          shadow_w || 0,
          shadow_blur || 0,
          shadow_color || "#000000",
          x,
          y,
          width,
          height,
          z_index || 1,
        ]
      );
      res.status(201).json({
        error: false,
        message: "Device created successfully",
        data: result.rows[0],
      });
    } catch (error) {
      res.status(500).json({ error: true, message: error.message });
    }
  }

  async updateDevice(req, res) {
    try {
      const keys = Object.keys(req.body);
      const values = Object.values(req.body);
      const setQuery = keys
        .map((key, index) => `${key} = $${index + 2}`)
        .join(", ");

      const result = await pool.query(
        `UPDATE devices SET ${setQuery}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
        [req.params.id, ...values]
      );
      if (result.rows.length > 0) {
        res.json({
          error: false,
          message: "Device updated successfully",
          data: result.rows[0],
        });
      } else {
        res.status(404).json({ error: true, message: "Device not found" });
      }
    } catch (error) {
      res.status(500).json({ error: true, message: error.message });
    }
  }

  async deleteDevice(req, res) {
    try {
      const result = await pool.query(
        "DELETE FROM devices WHERE id = $1 RETURNING *",
        [req.params.id]
      );
      if (result.rowCount > 0) {
        res.json({ error: false, message: "Device deleted successfully" });
      } else {
        res.status(404).json({ error: true, message: "Device not found" });
      }
    } catch (error) {
      res.status(500).json({ error: true, message: error.message });
    }
  }
}

module.exports = new DeviceController();
