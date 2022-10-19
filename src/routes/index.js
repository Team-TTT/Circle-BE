const express = require("express");

const router = express.Router();

const authRoute = require("./auth.route");
const projectRoute = require("./project.route");
const serviceRoute = require("./service.route");

const setResponseHeader = require("./middlewares/setResponseHeader");
const verifyToken = require("./middlewares/verifyToken");

router.use(setResponseHeader);
router.use("/auth", authRoute);
router.use("/projects/:projectId/service/auth", serviceRoute);
router.use("/projects", verifyToken, projectRoute);

module.exports = router;
