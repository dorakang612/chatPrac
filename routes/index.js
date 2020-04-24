const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.locals.title = "Node Chat";
  res.render("index");
});

router.get("/chat", (req, res) => {
  res.render("chat");
});

module.exports = router;
