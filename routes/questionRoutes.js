const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware')

// Question Controller
const {
  createQuestion,
  getAllQuestion,
  getSingleQuestion,
} = require("../controller/questionController");

// Question Endpoints
// Create a new question
router.post("/", authMiddleware, createQuestion);

// Get all questions (with pagination, filters, search)
router.get("/", getAllQuestion);

// Get a single question by ID
router.get("/:question_id", getSingleQuestion);


module.exports = router;
