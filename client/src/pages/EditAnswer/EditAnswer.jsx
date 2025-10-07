import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios"; // ✅ Use axios directly
import styles from "./EditAnswer.module.css";
import { UserContext } from "../../context/UserProvider";
import DOMPurify from "dompurify";
import axiosInstance from "../../API/axios";

function EditAnswer() {
  const { answer_id } = useParams();
  const navigate = useNavigate();
  const [user] = useContext(UserContext);
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [answer, setAnswer] = useState("");
  const [originalAnswer, setOriginalAnswer] = useState("");

  useEffect(() => {
    const fetchAnswer = async () => {
      try {
        const response = await axiosInstance.get(`/answers/${answer_id}`);
        console.log("Answer data:", response.data);
        setAnswer(response.data.answer || "");
        setOriginalAnswer(response.data.answer || "");
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load answer data.");
        setLoading(false);
      }
    };

    if (token) {
      fetchAnswer();
    }
  }, [answer_id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answer.trim()) {
      setError("Answer cannot be empty");
      return;
    }

    try {
      await axiosInstance.put(`/answers/${answer_id}`, {
        answer: answer.trim(),
      });
      
      navigate(-1); // Go back to previous page
    } catch (err) {
      console.error("Update error:", err);
      setError("Failed to update answer. Please try again.");
    }
  };

  const handleDiscard = () => {
    setAnswer(originalAnswer);
    navigate(-1);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <p>Loading answer...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2>Edit Your Answer</h2>
      {error && <div className={styles.errorMessage}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="answer" className={styles.label}>
            Your Answer
          </label>
          <textarea
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className={styles.textarea}
            placeholder="Edit your answer here..."
            rows="12"
            required
          />
        </div>

        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.submitButton}>
            Save Changes
          </button>
          <button
            type="button"
            className={styles.discardButton}
            onClick={handleDiscard}
          >
            Discard Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditAnswer;
