const express = require("express");

const router = express.Router();

router.route("/").get((req, res, next) => {
  res.json("서비스 작업 예정");
});

module.exports = router;
