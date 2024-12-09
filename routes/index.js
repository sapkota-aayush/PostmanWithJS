const express = require("express");
const router = express.Router();

// Define the root route
router.get("/", (req, res) => {
  res.send("Welcome to the Todo API");
});

module.exports = router;
