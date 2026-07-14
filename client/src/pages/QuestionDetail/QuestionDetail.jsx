import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserProvider";
import { QuestionContext } from "../../context/QuestionProvider";
import axios from "axios";
import styles from "./QuestionDetail.module.css";
import { FaUserCircle, FaRobot, FaLightbulb } from "react-icons/fa";
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

  // AI-specific state
  const [aiAnswer, setAiAnswer] = useState(null); // AI generated answer
  const [aiLoading, setAiLoading] = useState(false); // AI loading state
  const [aiError, setAiError] = useState(""); // AI error message
  const [aiSuggestion, setAiSuggestion] = useState(""); // AI suggestion for answer
  const [suggestionLoading, setSuggestionLoading] = useState(false); // Suggestion loading

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

  // Generate AI answer for the current question
  const handleGetAiAnswer = async () => {
    setAiLoading(true);
    setAiError("");
    setAiAnswer(null);

    try {
      const response = await axiosInstance.get(`/ai/answer/${question_id}`);
      const data = response.data;
      setAiAnswer(data);
      // If the backend returned an error field, surface it in the frontend error state
      if (data.error) {
        setAiError(data.error);
      }
    } catch (error) {
      console.error("AI Answer Error:", error);
      setAiError(
        error.response?.data?.message || "Failed to generate AI answer"
      );
    } finally {
      setAiLoading(false);
    }
  };

  // Get AI suggestion while typing answer
  const handleGetAiSuggestion = async () => {
    if (!newAnswer.trim()) {
      alert("Start writing your answer first, then ask for AI help!");
      return;
    }

    setSuggestionLoading(true);
    setAiSuggestion("");

    try {
      const response = await axiosInstance.post(
        `/ai/suggestions/${question_id}`,
        { partial_answer: newAnswer }
      );
      if (response.data.suggestion) {
        setAiSuggestion(response.data.suggestion);
      }
    } catch (error) {
      console.error("AI Suggestion Error:", error);
    } finally {
      setSuggestionLoading(false);
    }
  };

  // Apply AI suggestion to the answer textarea
  const handleApplyAiSuggestion = () => {
    if (aiSuggestion) {
      setNewAnswer((prev) => prev + "\n\n" + aiSuggestion);
      setAiSuggestion("");
    }
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
        setAiSuggestion(""); // Clear AI suggestion
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
            <div className={styles.headerActions}>
              {/* AI Answer Button */}
              <button
                className={styles.aiButton}
                onClick={handleGetAiAnswer}
                disabled={aiLoading}
              >
                <FaRobot className={styles.aiIcon} />
                {aiLoading ? "Generating..." : "🤖 Get AI Answer"}
              </button>
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

      {/* AI Answer Section */}
      {aiLoading && (
        <div className={styles.aiAnswerCard}>
          <div className={styles.aiLoadingContainer}>
            <ClipLoader size={30} color="#7C3AED" />
            <p>🤖 AI is analyzing the question and generating an answer...</p>
          </div>
        </div>
      )}

{aiAnswer?.error && (
        <div className={styles.aiErrorCard}>
          <div className={styles.aiErrorHeader}>
            <FaRobot className={styles.aiIcon} />
            <h4>🤖 AI Answer Unavailable</h4>
          </div>
          <p className={styles.aiErrorMessage}>
            ⚠️ {aiAnswer.error}
          </p>
          {aiAnswer.error_type === "quota_exhausted" && (
            <div className={styles.aiErrorHint}>
              <p>💡 <strong>Tip:</strong> The AI service quota has been exceeded. 
              You can either wait until tomorrow, or <a 
                href="https://aistudio.google.com/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.apiKeyLink}
                >get a new free API key</a> and update <code>GEMINI_API_KEY</code> in your <code>.env</code> file.</p>
            </div>
          )}
          {aiAnswer.cached && (
            <span className={styles.cachedBadge}>Cached Response</span>
          )}
        </div>
      )}

      {aiAnswer && !aiLoading && !aiAnswer.error && (
        <div className={styles.aiAnswerCard}>
          <div className={styles.aiAnswerHeader}>
            <FaRobot className={styles.aiIcon} />
            <h4>🤖 AI Generated Answer</h4>
            {aiAnswer.cached && (
              <span className={styles.cachedBadge}>Cached</span>
            )}
          </div>
          <div
            className={`${styles.aiAnswerContent} ${aiAnswer.error ? styles.aiAnswerError : ""}`}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                aiAnswer.ai_answer
                  .replace(/###\s/g, "<h3>")
                  .replace(/##\s/g, "<h2>")
                  .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                  .replace(/\n/g, "<br/>")
              ),
            }}
          />
        </div>
      )}

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

          {/* AI Suggestion Section */}
          <div className={styles.aiSuggestionSection}>
            <button
              type="button"
              className={styles.aiSuggestionBtn}
              onClick={handleGetAiSuggestion}
              disabled={suggestionLoading}
            >
              <FaLightbulb className={styles.aiSuggestionIcon} />
              {suggestionLoading
                ? "Getting suggestion..."
                : "💡 Get AI Suggestion"}
            </button>

            {suggestionLoading && (
              <div className={styles.suggestionLoading}>
                <ClipLoader size={16} color="#7C3AED" />
                <span>AI is analyzing your answer...</span>
              </div>
            )}

            {aiSuggestion && (
              <div className={styles.aiSuggestionBox}>
                <div className={styles.suggestionHeader}>
                  <FaLightbulb className={styles.aiSuggestionIcon} />
                  <strong>AI Suggestion</strong>
                  <button
                    type="button"
                    className={styles.applySuggestionBtn}
                    onClick={handleApplyAiSuggestion}
                  >
                    Apply Suggestion
                  </button>
                  <button
                    type="button"
                    className={styles.dismissSuggestionBtn}
                    onClick={() => setAiSuggestion("")}
                  >
                    ✕
                  </button>
                </div>
                <p className={styles.suggestionText}>{aiSuggestion}</p>
              </div>
            )}
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