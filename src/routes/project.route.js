const express = require("express");

const router = express.Router();

const projectController = require("./controllers/project.controller");

router
  .route("/")
  .get(projectController.getAllProjects)
  .post(projectController.createProject);

router
  .route("/:projectId")
  .get(projectController.getProject)
  .put(projectController.editProject)
  .delete(projectController.deleteProject);

module.exports = router;
