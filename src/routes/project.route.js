const express = require("express");

const router = express.Router();

const projectController = require("./controllers/project.controller");

router.route("/").post(projectController.createProject);

router
  .route("/:projectId")
  .put(projectController.editProject)
  .delete(projectController.deleteProject);

module.exports = router;
