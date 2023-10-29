const express = require("express");
const path = require("path");
const router = express.Router();

const root = path.resolve(path.join(__dirname, "../", "/templates"));

router.get("/dashboard", (req, res) => {
  return res.sendFile(path.join(root, "dashboard.html"));
});

router.get("/register", (req, res) => {
  return res.sendFile(path.join(root, "register.html"));
});

router.get("/login", (req, res) => {
  return res.sendFile(path.join(root, "login.html"));
});

module.exports = router;
