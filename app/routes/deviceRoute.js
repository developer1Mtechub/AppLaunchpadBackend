const express = require("express");
const DeviceController = require("../controllers/Pages/DeviceController");
const router = express.Router();

//Create a new device entry
router.post("/", DeviceController.createDevice);
//Get all device entries
router.get("/", DeviceController.getAllDevices);

//Get a specific device entry by ID
router.get("/:id", DeviceController.getDeviceById);

//Update a device entry
router.put("/:id", DeviceController.updateDevice);
//Delete a device entry
router.delete("/:id", DeviceController.deleteDevice);

//Get all device entries by page ID

router.get("/page/:page_id", DeviceController.getDevicesByPageId);

module.exports = router;
