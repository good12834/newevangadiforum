const express = require("express");
const answerRoute = express.Router();
const middleware = require("../middleware/authMiddleware");
const {
  deleteAnswer,
  editAnswer,
  postAnswer,
  allAnswers,
  getAnswerById,
} = require("../controller/answerController");

// ✅ Fixed routes - remove duplicate "answers/" since app.js already uses "/api/answers"
answerRoute.post("/:question_id", middleware, postAnswer);
answerRoute.get("/", middleware, allAnswers);
answerRoute.get("/:answer_id", middleware, getAnswerById);
answerRoute.delete("/:answer_id", middleware, deleteAnswer);
answerRoute.put("/:answer_id", middleware, editAnswer);

module.exports = answerRoute;
