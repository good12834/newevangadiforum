const express = require("express");
const router = express.Router();

// register route
router.post("/register", (req, res) => {
  res.send("register user");
});

// login user
router.post("/login", (req, res) => {
  res.send("login user");
});

// check user
router.get("/check", (req, res) => {
  res.send("check user");
});


module.exports = router;
