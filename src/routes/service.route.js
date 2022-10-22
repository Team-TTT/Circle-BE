const express = require("express");

const router = express.Router();

const projectController = require("./controllers/project.controller");

router
  .route("/")
  .get(projectController.getProject);

module.exports = router;
