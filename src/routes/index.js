const express = require("express");

const router = express.Router();

router.get("/api", (req, res, next) => {
  res.json("홈페이지");
});

module.exports = router;
