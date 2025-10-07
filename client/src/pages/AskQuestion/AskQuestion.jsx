import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./AskQuestion.module.css";
import axiosInstance from "../../API/axios";

function AskQuestion() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await axiosInstance.post(
        "/question",
        {
          title,
          question_description: description,
          tag: tag || "general",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Server response:", res.data);

      setSuccess(true);
      setTitle("");
      setDescription("");
      setTag("");
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "❌ Failed to post your question. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <h1>Ask a Public Question</h1>
        <Link to="/home" className={styles.backLink}>
          ← Back to Questions
        </Link>
      </div>

      <div className={styles.content}>
        {/* Steps Section */}
        <section className={styles.guideSection}>
          <div className={styles.guideCard}>
            <h2>📝 Writing a Good Question</h2>
            <div className={styles.steps}>
              <div className={styles.step}>
                <span className={styles.stepNumber}>1</span>
                <div className={styles.stepContent}>
                  <h3>Summarize your problem</h3>
                  <p>
                    Create a clear, one-line title that summarizes your specific
                    problem
                  </p>
                </div>
              </div>
              <div className={styles.step}>
                <span className={styles.stepNumber}>2</span>
                <div className={styles.stepContent}>
                  <h3>Describe in detail</h3>
                  <p>
                    Include all relevant information and context about your
                    problem
                  </p>
                </div>
              </div>
              <div className={styles.step}>
                <span className={styles.stepNumber}>3</span>
                <div className={styles.stepContent}>
                  <h3>Show what you tried</h3>
                  <p>
                    Describe what you've already attempted and what you expected
                    to happen
                  </p>
                </div>
              </div>
              <div className={styles.step}>
                <span className={styles.stepNumber}>4</span>
                <div className={styles.stepContent}>
                  <h3>Review and post</h3>
                  <p>
                    Proofread your question before posting to ensure clarity
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Question Form Section */}
        <section className={styles.formSection}>
          <div className={styles.formCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="tag" className={styles.label}>
                  Category/Tag
                </label>
                <input
                  type="text"
                  id="tag"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="e.g., javascript, react, nodejs"
                  className={styles.input}
                />
                <small className={styles.helpText}>
                  Add tags to help others find your question
                </small>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="title" className={styles.label}>
                  Question Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., How to handle async operations in React?"
                  className={styles.input}
                  required
                />
                <small className={styles.helpText}>
                  Be specific and imagine you're asking another person
                </small>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description" className={styles.label}>
                  Detailed Question
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your problem in detail. Include what you tried and what you expected to happen..."
                  className={styles.textarea}
                  required
                  rows="12"
                />
                <small className={styles.helpText}>
                  Include all relevant information. The better you describe your
                  problem, the better answers you'll get.
                </small>
              </div>

              <button
                type="submit"
                className={`${styles.submitButton} ${
                  loading ? styles.loading : ""
                }`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className={styles.spinner}></span>
                    Posting Question...
                  </>
                ) : (
                  "Post Your Question"
                )}
              </button>
            </form>

            {/* Messages */}
            {success && (
              <div className={styles.successMessage}>
                <span className={styles.successIcon}>✅</span>
                <div>
                  <h4>Question Posted Successfully!</h4>
                  <p>Your question is now live and visible to the community.</p>
                  <Link to="/home" className={styles.viewQuestions}>
                    View All Questions
                  </Link>
                </div>
              </div>
            )}

            {error && (
              <div className={styles.errorMessage}>
                <span className={styles.errorIcon}>⚠️</span>
                <div>
                  <h4>Unable to Post Question</h4>
                  <p>{error}</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AskQuestion;
