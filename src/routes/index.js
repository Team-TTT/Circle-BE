const express = require("express");

const router = express.Router();

const authRoute = require("./auth.route");
const projectRoute = require("./project.route");
const serviceRoute = require("./service.route");

const setResponseHeader = require("./middleware/setResponseHeader");
const verifyToken = require("./middleware/verifyToken");
const setResponseServiceHeader = require("./middleware/setResponseServiceHeader");

router.use("/projects/:projectId/service/auth", setResponseServiceHeader, serviceRoute);
router.use(setResponseHeader);
router.use("/auth", authRoute);
router.use("/projects", verifyToken, projectRoute);

module.exports = router;
