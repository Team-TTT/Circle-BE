const express = require("express");

const router = express.Router();

const userRoute = require("./user.route");
const projectRoute = require("./project.route");

router.use("/users", userRoute);
router.use("/projects", projectRoute);

module.exports = router;
