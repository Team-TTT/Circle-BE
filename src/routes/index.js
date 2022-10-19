const express = require("express");

const router = express.Router();

const authRoute = require("./auth.route");
const projectRoute = require("./project.route");

const setResponseHeader = require("./middleware/setResponseHeader");
const verifyToken = require("./middleware/verifyToken");

router.use(setResponseHeader);
router.use("/auth", authRoute);
router.use("/projects", verifyToken, projectRoute);

module.exports = router;
