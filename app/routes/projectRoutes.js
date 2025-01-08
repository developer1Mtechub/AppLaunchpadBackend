const express = require("express");
const Project = require("../controllers/projects/projectController");
const router = express.Router();

// Use the upsertProject method for both creating and updating projects
router.post("/project", Project.upsertProject);

// Route to get all projects
router.get("/project", Project.getProjects);

// Route to get a single project by ID
router.get("/project/:id", Project.getProjectById);

// Route to delete a project by ID
router.delete("/project/:id", Project.deleteProject);

module.exports = router;
