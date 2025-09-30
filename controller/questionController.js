function createQuestion(req, res) {
  res.send("Greetings, team, The question is created");
}

function getQuestion(req, res) {
  res.send("Greetings, team, The question is Loaded");
}

function getSingleQuestion(req, res) {
  res.send("Greetings, team, Single question is Loaded");
}
function updateQuestion(req, res) {
  res.send("Greetings, team, The question is updated");
}
function deleteQuestion(req, res) {
  res.send("Greetings, team, The question is deleted");
}

module.exports = {
  createQuestion,
  getQuestion,
  getSingleQuestion,
  updateQuestion,
  deleteQuestion,
};
