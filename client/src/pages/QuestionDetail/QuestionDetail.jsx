import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserProvider";
import { QuestionContext } from "../../context/QuestionProvider";
import axios from "axios";
import styles from "./QuestionDetail.module.css";
import { FaUserCircle } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import DOMPurify from "dompurify";
import axiosInstance from "../../API/axios";

const QuestionDetail = () => {
  // Get question ID from the URL (dynamic route)
  const { question_id } = useParams();

  // Access logged-in user info
  const [user] = useContext(UserContext);

  // Access global questions state
  const { questions, setQuestions } = useContext(QuestionContext);

  // Local state
  const [answers, setAnswers] = useState([]); // All answers for this question
  const [newAnswer, setNewAnswer] = useState(""); // Input for new answer
  const [loading, setLoading] = useState(true); // Loading state for question/answers
  const [answerLoading, setAnswerLoading] = useState(false); // Loading state for posting an answer
  const [isUserStable, setIsUserStable] = useState(false); // Ensures user data is loaded before fetching
  const navigate = useNavigate(); // For programmatic navigation

  // Wait until user context is stable
  useEffect(() => {
    if (user) {
      console.log("✅ QuestionDetail - User is stable:", user);
      setIsUserStable(true);
    }
  }, [user]);

  // DEBUG: Log important data for development
  console.log("🔍 DEBUG - Current User:", user);
  console.log("🔍 DEBUG - Question ID:", question_id);
  console.log("🔍 DEBUG - All Questions:", questions);

  // Fetch question and answers from API
  useEffect(() => {
    const fetchQuestionAndAnswers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token"); // Auth token if needed

        // Fetch question details from backend
        const questionResponse = await axiosInstance.get(
          `/question/${question_id}`
        );
        console.log("🔍 DEBUG - Question Data:", questionResponse.data);

        // Add question to global context if not already there
        if (!questions.find((q) => q.question_id == question_id)) {
          setQuestions((prev) => [...prev, questionResponse.data]);
        }

        // Fetch all answers
        const answersResponse = await axiosInstance.get("/answers/");

        // Filter answers for this specific question
        const questionAnswers =
          answersResponse.data.answers?.filter(
            (answer) => answer.question_id == question_id
          ) || [];
        console.log("🔍 DEBUG - Filtered Answers:", questionAnswers);

        setAnswers(questionAnswers); // Update local answers state
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    if (isUserStable) {
      fetchQuestionAndAnswers();
    }
  }, [question_id, setQuestions, questions, isUserStable]);

  // Get the current question from context
  const question = questions.find((q) => q.question_id == question_id);

  // Check if current user can edit the question
  const canEditQuestion = () => {
    if (!user || !question) return false;
    const userId = user.user_id || user.userid;
    const questionUserId = question.user_id;

    console.log(
      "🔍 Ownership Check - User ID:",
      userId,
      "Question User ID:",
      questionUserId
    );

    return userId == questionUserId;
  };

  // Check if current user can edit a specific answer
  const canEditAnswer = (answerUserId) => {
    if (!user) return false;
    const userId = user.user_id || user.userid;

    console.log(
      "🔍 Answer Ownership - User ID:",
      userId,
      "Answer User ID:",
      answerUserId
    );

    return userId == answerUserId;
  };

  // Submit a new answer
  const handleSubmitAnswer = async (e) => {
    e.preventDefault();

    if (!newAnswer.trim()) {
      alert("Please write an answer before submitting.");
      return;
    }

    setAnswerLoading(true);

    try {
      const response = await axiosInstance.post(`/answers/${question_id}`, {
        answer: newAnswer,
      });

      if (response.status === 201) {
        // Refresh answers after posting
        const answersResponse = await axiosInstance.get("/answers/");
        const questionAnswers =
          answersResponse.data.answers?.filter(
            (answer) => answer.question_id == question_id
          ) || [];
        setAnswers(questionAnswers);
        setNewAnswer(""); // Clear input
        alert("Answer posted successfully!");
      }
    } catch (error) {
      console.error("Error posting answer:", error);
      alert("Failed to post answer. Please try again.");
    } finally {
      setAnswerLoading(false);
    }
  };

  // Delete an existing answer
  const handleDeleteAnswer = async (answer_id, e) => {
    e.stopPropagation(); // Prevent parent click events

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this answer?"
    );
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/answers/${answer_id}`);
      setAnswers((prev) =>
        prev.filter((answer) => answer.answer_id !== answer_id)
      );
      alert("Answer deleted successfully!");
    } catch (error) {
      console.error("Error deleting answer:", error);
      alert("Failed to delete answer. Please try again.");
    }
  };

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <ClipLoader size={50} color="#FF8500" />
        <p>Loading question...</p>
      </div>
    );
  }

  // Show error if question not found
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

  // Render question detail and answers
  return (
    <div className={styles.outerDiv}>
      {/* Header with back link */}
      <div className={styles.header}>
        <Link to="/home" className={styles.backLink}>
          ← Back to Questions
        </Link>
      </div>

      {/* Question Card */}
      <div className={styles.questionCard}>
        <div className={styles.cardBody}>
          <div className={styles.questionHeader}>
            <h4 className={styles.cardTitle}>Question</h4>
            {/* Edit button visible only if user owns the question */}
            {canEditQuestion() && (
              <button
                className={styles.editBtn}
                onClick={() => navigate(`/edit-question/${question_id}`)}
              >
                ✏️ Edit Question
              </button>
            )}
          </div>
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

      {/* If no answers */}
      {answers.length === 0 ? (
        <div className={styles.answerFormCard}>
          <h4 className={styles.cardTitle}>No answers yet</h4>
          <p className={styles.cardSubtitle}>
            Be the first to answer this question!
          </p>
        </div>
      ) : (
        // Render each answer
        answers.map((answer, index) => (
          <div className={styles.answerCard} key={answer.answer_id || index}>
            <div className={styles.answerBody}>
              <div className={styles.userInfo}>
                <div className={styles.userIconDiv}>
                  <FaUserCircle size={35} className={styles.profileIcon} />
                  <p className={styles.user_name}>{answer.user_name}</p>
                </div>
                <div className={styles.answerContent}>
                  <p>{answer.answer}</p>
                </div>
              </div>
            </div>

            {/* Edit/Delete buttons visible only to the answer owner */}
            <div className={styles.btnContainer}>
              {canEditAnswer(answer.user_id) && (
                <div className={styles.actionButtons}>
                  <button
                    className={styles.editBtn}
                    onClick={() => navigate(`/edit-answer/${answer.answer_id}`)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={(e) => handleDeleteAnswer(answer.answer_id, e)}
                  >
                    🗑️ Delete
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

      {/* Form to post a new answer */}
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
                <ClipLoader size={20} color="#fff" /> Posting Answer...
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
