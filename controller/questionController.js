const dbConnection = require("../db/dbConfig");

async function createQuestion(req, res) {
    // const { title, question_description, tag } = req.body;
    // if (!title || !question_description || !tag) {
    //   return res.status(400).json({ msg: "please provide all required fields" });
    // }
    // try {
    //     await dbConnection.query(
    //       "INSERT INTO questionTable (title, question_description, tag) VALUES (?, ?, ?)",
    //       [title, question_description, tag]);

    //       return res.status(201).json({msg: "Question Created"}); 
    // } catch (error) {
    //     console.log(error.message)
    //     return res.status(500).json({msg:"Something went wrong, try again later"})
    // }
//   res.send("Greetings, team, The question is created");

const { title, question_description, tag } = req.body;
const userId = req.user?.user_id; // comes from auth middleware

if (!title || !question_description) {
  return res.status(400).json({
    error: "Bad Request",
    message: "Please provide title and description",
  });
}

try {
  await db.query(
    "INSERT INTO questions (user_id, title, question_description, tag) VALUES (?, ?, ?, ?)",
    [userId, title, question_description, tag || null]
  );

  res.status(201).json({
    message: "Question created successfully",
  });
} catch (err) {
  console.error(err);
  res.status(500).json({
    error: "Internal Server Error",
    message: "An unexpected error occurred.",
  });
}
}

async function getAllQuestion(req, res) {
  res.send("Greetings, team, The question is Loaded");
}

async function getSingleQuestion(req, res) {
  res.send("Greetings, team, Single question is Loaded");
}
// async function updateQuestion(req, res) {
//   res.send("Greetings, team, The question is updated");
// }
// async function deleteQuestion(req, res) {
//   res.send("Greetings, team, The question is deleted");
// }

module.exports = {
  createQuestion,
  getAllQuestion,
  getSingleQuestion
};
