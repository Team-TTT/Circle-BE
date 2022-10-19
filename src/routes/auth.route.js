const express = require("express");

const router = express.Router();

const verifyToken = require("./middleware/verifyToken");
const createSessionCookie = require("./middleware/createSessionCookie");
const userController = require("./controllers/auth.controller");

router
  .route("/users")
  .get(verifyToken, userController.getUser)
  .post(createSessionCookie, userController.findOrCreateUser);

router.route("/logout").post(verifyToken, userController.deleteSessioncookie);

module.exports = router;
