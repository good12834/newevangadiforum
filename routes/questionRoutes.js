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
router.get("/:id", getSingleQuestion);

// Update a question by ID
router.put("/:id", updateQuestion);

// Delete a question by ID
router.delete("/:id", deleteQuestion);

module.exports = router;
