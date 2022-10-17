const express = require("express");

const router = express.Router();

const userRoute = require("./user.route");

router.use("/users", userRoute);

module.exports = router;
