import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserProvider";
import { QuestionContext } from "../../context/QuestionProvider";
import axios from "axios"; // ✅ Use axios directly
import styles from "./QuestionDetail.module.css";
import { FaUserCircle } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import DOMPurify from "dompurify";

const QuestionDetail = () => {
  const { question_id } = useParams();
  const [user] = useContext(UserContext);
  const { questions, setQuestions } = useContext(QuestionContext);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [answerLoading, setAnswerLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch question and answers
  useEffect(() => {
    const fetchQuestionAndAnswers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        console.log("Fetching question:", question_id);

        // Fetch question details
        const questionResponse = await axios.get(
          `http://localhost:5500/api/question/${question_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Question response:", questionResponse.data);

        // Add question to context if not already there
        if (!questions.find((q) => q.question_id == question_id)) {
          setQuestions((prev) => [...prev, questionResponse.data]);
        }

        // Fetch all answers
        const answersResponse = await axios.get(
          "http://localhost:5500/api/answers/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("All answers:", answersResponse.data);

        // Filter answers for this specific question
        const questionAnswers =
          answersResponse.data.answers?.filter(
            (answer) => answer.question_id == question_id
          ) || [];

        console.log("Filtered answers:", questionAnswers);
        setAnswers(questionAnswers);
      } catch (error) {
        console.error("Error fetching data:", error);
        console.error("Error response:", error.response);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionAndAnswers();
  }, [question_id, setQuestions, questions]);

  // Get current question
  const question = questions.find((q) => q.question_id == question_id);

  // Post new answer
  const handleSubmitAnswer = async (e) => {
    e.preventDefault();

    if (!newAnswer.trim()) {
      alert("Please write an answer before submitting.");
      return;
    }

    const token = localStorage.getItem("token");
    setAnswerLoading(true);

    try {
      const response = await axios.post(
        `http://localhost:5500/api/answers/${question_id}`,
        {
          answer: newAnswer,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Answer post response:", response.data);

      if (response.status === 201) {
        // Refresh answers after posting
        const answersResponse = await axios.get(
          "http://localhost:5500/api/answers/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const questionAnswers =
          answersResponse.data.answers?.filter(
            (answer) => answer.question_id == question_id
          ) || [];

        setAnswers(questionAnswers);
        setNewAnswer("");
        alert("Answer posted successfully!");
      }
    } catch (error) {
      console.error("Error posting answer:", error);
      console.error("Error response:", error.response);
      alert("Failed to post answer. Please try again.");
    } finally {
      setAnswerLoading(false);
    }
  };

  // Delete answer
  const handleDeleteAnswer = async (answer_id, e) => {
    e.stopPropagation();

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this answer?"
    );
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    try {
      await axios.delete(`http://localhost:5500/api/answers/${answer_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAnswers((prev) =>
        prev.filter((answer) => answer.answer_id !== answer_id)
      );
      alert("Answer deleted successfully!");
    } catch (error) {
      console.error("Error deleting answer:", error);
      alert("Failed to delete answer. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <ClipLoader size={50} color="#FF8500" />
        <p>Loading question...</p>
      </div>
    );
  }

  if (!question) {
    return (
      <div className={styles.errorContainer}>
        <h2>Question not found</h2>
        <p>The question you're looking for doesn't exist.</p>
        <Link to="/home" className={styles.backLink}>
          ← Back to Questions
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.outerDiv}>
      {/* Header */}
      <div className={styles.header}>
        <Link to="/home" className={styles.backLink}>
          ← Back to Questions
        </Link>
      </div>

      {/* Question Card */}
      <div className={styles.questionCard}>
        <div className={styles.cardBody}>
          <h4 className={styles.cardTitle}>Question</h4>
          <h5 className={styles.cardSubtitle}>{question.title}</h5>
          <div
            className={styles.questDiv}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(question.question_description || ""),
            }}
          />
          <div className={styles.questionMeta}>
            <span className={styles.author}>
              Asked by: {question.user_name}
            </span>
            <span className={styles.date}>
              {new Date(question.createdAt).toLocaleDateString()}
            </span>
          </div>
          {question.tag && (
            <div className={styles.tags}>
              <span className={styles.tag}>{question.tag}</span>
            </div>
          )}
        </div>
      </div>

      {/* Answers Section */}
      <div className={styles.answersCard}>
        <div className={styles.cardBody}>
          <h4 className={styles.cardTitle}>
            {answers.length} Answer{answers.length !== 1 ? "s" : ""} From The
            Community
          </h4>
        </div>
      </div>

      {answers.length === 0 ? (
        <div className={styles.answerFormCard}>
          <h4 className={styles.cardTitle}>No answers yet</h4>
          <p className={styles.cardSubtitle}>
            Be the first to answer this question!
          </p>
        </div>
      ) : (
        answers.map((answer, index) => (
          <div className={styles.answerCard} key={answer.answer_id || index}>
            <div className={styles.answerBody}>
              <div className={styles.userInfo}>
                <div className={styles.userIconDiv}>
                  <FaUserCircle size={35} className={styles.profileIcon} />
                  <p className={styles.username}>{answer.user_name}</p>
                </div>
                <div className={styles.answerContent}>
                  <p>{answer.answer}</p>
                </div>
              </div>
            </div>
            <div className={styles.btnContainer}>
              {user?.user_id === answer.user_id && (
                <div className={styles.actionButtons}>
                  <button
                    className={styles.deleteBtn}
                    onClick={(e) => handleDeleteAnswer(answer.answer_id, e)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
            <div className={styles.answerMeta}>
              <span className={styles.answerDate}>
                Answered on {new Date(answer.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))
      )}

      {/* Answer Form */}
      <div className={styles.answerFormCard}>
        <h4 className={styles.cardTitle}>Your Answer</h4>
        <form onSubmit={handleSubmitAnswer}>
          <div className={styles.formGroup}>
            <textarea
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              placeholder="Write your answer here..."
              className={styles.answerTextarea}
              rows="6"
              required
            />
          </div>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={answerLoading}
          >
            {answerLoading ? (
              <>
                <ClipLoader size={20} color="#fff" />
                Posting Answer...
              </>
            ) : (
              "Post Your Answer"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuestionDetail;
