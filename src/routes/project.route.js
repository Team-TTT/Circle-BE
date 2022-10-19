const express = require("express");

const router = express.Router();

const projectController = require("./controllers/project.controller");

router.route("/").post(projectController.createProject);

module.exports = router;
