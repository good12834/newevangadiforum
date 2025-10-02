const { StatusCodes } = require("http-status-codes");
const dbConnection = require("../db/dbConfig");

// post request function to send answers 
const postAnswer = async (req, res)=>{
    const {id} = req.user
    const {question_id} = req.params
    const {answer} = req.body;

    if (!answer) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ 
                error: "Bad Request",
                message: "Please provide answer" });
    }
    
    try {
        await dbConnection.query(
            "insert into answerTable (user_id, answer, question_id) values ( ?,?,?)",
            [id,answer, question_id]
        );
        return res
            .status(StatusCodes.CREATED)
            .json({
                 msg:"Thank for your answers!!",
                 message: "answer posted successfully" });
    } catch (err) {
        console.log(err);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ 
                error:"Internal Server Error",
                message: "An unexpected error occurred"
             });
    }
}

const allAnswers = async (req, res) => {
  // const {username}=req.user
  try {
    const fetchAllAnswers = `SELECT questionTable.title,questionTable.question_description,answerTable.user_id,answerTable.createdAt,answerTable.answer_id,answerTable.question_id,userTable.user_name,answerTable.answer from answerTable JOIN userTable on userTable.user_id=answerTable.user_id JOIN questionTable on answerTable.question_id=questionTable.question_id `;
    const [allAnswers] = await dbConnection.query(fetchAllAnswers);

    res.status(StatusCodes.ACCEPTED).json({ allAnswers });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "internal server error" });
  }
};

//delete answers
const deleteAnswer = async (req, res) => {
  // const{id}=req.user
  const { answer_id } = req.params;

  try {
    const deleteAnswer = `DELETE FROM answerTable WHERE answer_id=?`;
    await dbConnection.query(deleteAnswer, [answer_id]);
    return res.status(StatusCodes.ACCEPTED).json({ msg: "answer deleted" });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "internal server error" });
  }
};


// edit answers
const editAnswer = async (req, res) => {
  const { answer_id } = req.params;
  const { answer } = req.body; // Retrieve updated answer from request body
  try {
    const editAnswerQuery = `UPDATE answerTable SET answer = ? WHERE answer_id = ?`;
    await dbConnection.query(editAnswerQuery, [answer, answer_id]);
    return res.status(StatusCodes.ACCEPTED).json({ msg: "Answer edited" });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal server error" });
  }
};


module.exports={deleteAnswer,editAnswer,postAnswer,allAnswers}