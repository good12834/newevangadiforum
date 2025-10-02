const dbConnection = require("../db/dbConfig");

// Create Question
async function createQuestion(req, res) {
  const { title, question_description, tag } = req.body; // ✅ include tag
  const userid = req.user?.userid; // ✅ comes from auth middleware

  if (!title || !question_description) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Please provide title and description",
    });
  }

  if (!userid) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "User ID is missing from token",
    });
  }

  try {
    await dbConnection.query(
      "INSERT INTO questionTable (user_id, title, question_description, tag) VALUES (?, ?, ?, ?)",
      [userid, title, question_description, tag || null]
    );

    res.status(201).json({
      message: "Question created successfully",
    });
  } catch (err) {
    console.error("DB Error:", err.message);
    res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}
// Get all questions (with username)
async function getAllQuestion(req, res) {
  try {
    const userid = req.user?.userId; // decoded from JWT by authMiddleware
    const [rows] = await dbConnection.query(
      `SELECT 
        q.question_id,
        q.title,
        q.question_description,
        q.tag,
        q.createdAt,
        q.user_id,
        u.user_name
      FROM questionTable q
      INNER JOIN userTable u ON q.user_id = u.user_id
      ORDER BY q.createdAt DESC`,
      [userid]
    );

    res.status(200).json(rows);
  } catch (err) {
    console.error("Error in getAllQuestion:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}


// Get single question
async function getSingleQuestion(req, res) {
  const { question_id } = req.params;
  const userid = req.user?.userId; // decoded from JWT by authMiddleware

  try {
    const [rows] = await dbConnection.query(
      `SELECT 
        q.question_id,
        q.title,
        q.question_description,
        q.tag,
        q.createdAt,
        q.user_id,
        u.user_name
      FROM questionTable q
      INNER JOIN userTable u ON q.user_id = u.user_id
      WHERE q.question_id = ?`,
      [question_id, userid]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("Error in getSingleQuestion:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Update a question by ID (only owner can update)
async function updateQuestion(req, res) {
  const { question_id } = req.params;
  const { title, question_description, tag } = req.body;
  const userId = req.user?.userId; 

  console.log("Updating question:", question_id, "by user:", userId);

  try {
    const [existing] = await dbConnection.query(
      `SELECT * FROM questionTable WHERE question_id = ?`,
      [question_id]
    );

    console.log("Found question:", existing);

    if (existing.length === 0) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Check ownership clearly
    if (parseInt(existing[0].user_id, 10) !== parseInt(userId, 10)) {
      return res.status(403).json({
        message: `You are not authorized to update this question. (Owner: ${existing[0].user_id}, Your ID: ${userId})`,
      });
    }

    await dbConnection.query(
      `UPDATE questionTable 
       SET title = ?, question_description = ?, tag = ?
       WHERE question_id = ?`,
      [title, question_description, tag, question_id]
    );

    res.status(200).json({ message: "Question updated successfully" });
  } catch (err) {
    console.error("Error in updateQuestion:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Delete a question by ID (only owner can delete)
async function deleteQuestion(req, res) {
  const { question_id } = req.params;
  const userId = req.user.userId; // ✅ comes from token

  try {
    // Check if question exists
    const [existing] = await dbConnection.query(
      `SELECT * FROM questionTable WHERE question_id = ?`,
      [question_id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Check ownership
    if (parseInt(existing[0].user_id, 10) !== parseInt(userId, 10)) {
      return res.status(403).json({
        message: `You are not authorized to delete this question. (Owner: ${existing[0].user_id}, Your ID: ${userId})`,
      });
    }

    // Delete the question
    await dbConnection.query(
      `DELETE FROM questionTable WHERE question_id = ?`,
      [question_id]
    );

    res.status(200).json({ message: "Question deleted successfully" });
  } catch (err) {
    console.error("Error in deleteQuestion:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}



module.exports = {
  createQuestion,
  getAllQuestion,
  getSingleQuestion,
  updateQuestion,
  deleteQuestion,
};