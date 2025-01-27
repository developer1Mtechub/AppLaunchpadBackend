const express = require("express");
const Project = require("../controllers/projects/projectController");
const { projectValidations } = require("../validations/projectValidations");
const router = express.Router();

// Use the upsertProject method for both creating and updating projects
router.post("/", projectValidations, Project.createProject);

// Route to get all projects
router.get("/", Project.getProjects);

// Route to get a single project by ID
router.get("/:id", Project.getProjectById);

// Route to update a project by ID
router.put("/:id", Project.updateProject);

// Route to delete a project by ID
router.delete("/:id", Project.deleteProject);

module.exports = router;
