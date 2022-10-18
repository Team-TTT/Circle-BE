const express = require("express");

const router = express.Router();

const verifyToken = require("./middleware/verifyToken");
const projectController = require("./controllers/project.controller");

router.route("/").post(verifyToken, projectController.saveProject);

module.exports = router;
