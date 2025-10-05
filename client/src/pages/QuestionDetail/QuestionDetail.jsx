import { useParams, Link } from "react-router-dom";
import "./QuestionDetail.css";

const QuestionDetail = () => {
  const { questionId } = useParams();

  // Mock question data
  const question = {
    id: questionId,
    text: "This is a sample question",
    subText: "Additional info here",
    answers: [
      { username: "Alice", text: "This is an answer." },
      { username: "Bob", text: "Another answer." },
    ],
  };

  return (
    <div className="question-container">
      <header className="nav-bar">
        <h2 className="logo">EVANGADI</h2>
        <nav>
          <Link to="/">Home</Link>
          <button className="logout-btn">LogOut</button>
        </nav>
      </header>

      <div className="content">
        <div className="question-section">
          <h3>Question</h3>
          <p className="question-text">{question.text}</p>
          <small className="sub-text">{question.subText}</small>
        </div>

        <div className="answer-section">
          <h3>Answer From The Community</h3>
          {question.answers.length > 0 ? (
            question.answers.map((ans, index) => (
              <div className="answer-card" key={index}>
                <div className="user-avatar">
                  <img
                    src="https://www.w3schools.com/howto/img_avatar.png"
                    alt="user avatar"
                  />
                </div>
                <div>
                  <p className="username">{ans.username}</p>
                  <p className="answer-text">{ans.text}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No answers yet.</p>
          )}
        </div>

        <div className="answer-form">
          <h3>Answer The Top Question</h3>
          <textarea
            placeholder="Your Answer..."
            className="answer-input"
          ></textarea>
          <button className="post-btn">Post Your Answer</button>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetail;
