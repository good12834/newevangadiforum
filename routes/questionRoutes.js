const express = require("express");
const router = express.Router();

// Question Controller
const {
  createQuestion,
  getQuestion,
  getSingleQuestion,
  updateQuestion,
  deleteQuestion,
} = require("../controller/questionController");

// Question Endpoints

// Create a new question
router.post("/", createQuestion);

// Get all questions (with pagination, filters, search)
router.get("/", getQuestion);

// Get a single question by ID
router.get("/:question_id", getSingleQuestion);

// Update a question by ID
router.put("/:question_id", updateQuestion);

// Delete a question by ID
router.delete("/:question_id", deleteQuestion);

module.exports = router;
