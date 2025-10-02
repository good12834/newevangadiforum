const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware')

// Question Controller
const {
  createQuestion,
  getAllQuestion,
  getSingleQuestion
} = require("../controller/questionController");

// Question Endpoints
// Create a new question
router.post("/", authMiddleware, createQuestion);

// Get all questions (with pagination, filters, search)
router.get("/", authMiddleware, getAllQuestion);

// Get a single question by ID
router.get("/:question_id", authMiddleware, getSingleQuestion);

// // Update a question by ID
// router.put("/:question_id", updateQuestion);

// // Delete a question by ID
// router.delete("/:question_id", deleteQuestion);

module.exports = router;
