const express = require("express");
const answerRoute = express.Router();
const middleware = require("../middleware/authMiddleware");
const { deleteAnswer, editAnswer ,postAnswer, allAnswers} = require("../controller/answerController");

//this is post request to send message change the routes name and function name as you want
answerRoute.post("/answers/:question_id",middleware, postAnswer);

// this is get request to get all answers from database
answerRoute.get("/answers/allAnswers", middleware,allAnswers);

// delete route
answerRoute.delete("/delete/:answer_id", middleware, deleteAnswer);

// edit route
answerRoute.put("/edit/:answer_id", middleware, editAnswer);


module.exports = answerRoute;
