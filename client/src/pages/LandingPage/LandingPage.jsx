import { Link } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  // Mock questions array
  const questions = [
    { id: 1, text: "What is React?" },
    { id: 2, text: "How does useEffect work?" },
    { id: 3, text: "What is JSX?" },
  ];

  return (
    <div className="landing-page">
      <h1>All Questions</h1>
      {questions.length === 0 ? (
        <p>No questions available yet.</p>
      ) : (
        <ul>
          {questions.map((q) => (
            <li key={q.id} className="question-item">
              <p>{q.text}</p>
              <Link to={`/questions/${q.id}`}>View Question</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LandingPage;
