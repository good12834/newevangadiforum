const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  generateAiAnswer,
  generateAnswerSuggestions,
  suggestTags,
} = require("../controller/aiController");

// Generate AI answer for a question
router.get("/answer/:question_id", authMiddleware, generateAiAnswer);

// Generate answer suggestions as user types
router.post("/suggestions/:question_id", authMiddleware, generateAnswerSuggestions);

// Suggest tags for a question
router.post("/suggest-tags", authMiddleware, suggestTags);

module.exports = router;