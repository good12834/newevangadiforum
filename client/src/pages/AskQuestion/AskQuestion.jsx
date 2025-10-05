import React, { useState } from "react";
import axios from "axios";
import styles from "./AskQuestion.module.css";

function AskQuestion() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5500/api/question",
        {
          title,
          question_description: description,
          tag: "",
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
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setError("❌ Failed to post your question. Please try again.");
    }
  };

  return (
    <div className={styles.askQuestionPage}>
      <section className={styles.steps}>
        <h2>Steps to write a good question</h2>
        <ul>
          <li>Summarize your problem in a one-line title.</li>
          <li>Describe your problem in more detail.</li>
          <li>Explain what you tried and what you expected.</li>
          <li>Review your question and post it to the site.</li>
        </ul>
      </section>

      <section className={styles.questionForm}>
        <h3 className={styles.ask}>Ask a Public Question</h3>
        <div className={styles.go}>
          <p>Go to Question page</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="title"></label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description"></label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Question Description"
              required
              rows="15"
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            Post Your Question
          </button>
        </form>

        {success && (
          <div className={styles.successMessage}>
            ✅ Your question has been posted successfully!
          </div>
        )}

        {error && <div className={styles.errorMessage}>{error}</div>}
      </section>
    </div>
  );
}

export default AskQuestion;
