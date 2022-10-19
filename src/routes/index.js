const express = require("express");

const router = express.Router();

const verifyToken = require("./middleware/verifyToken");
const userRoute = require("./user.route");
const projectRoute = require("./project.route");

router.use("/users", userRoute);
router.use("/projects", verifyToken, projectRoute);

module.exports = router;
