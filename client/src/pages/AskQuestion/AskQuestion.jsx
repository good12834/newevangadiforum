import React, { useState } from "react";
import "./AskQuestion.css";

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
        "http://localhost:5500/api/questions",
        { title, description },
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
    <div className="ask-question-page">
      <section className="steps">
        <h2>Steps to write a good question</h2>
        <ul>
          <li>Summarize your problem in a one-line title.</li>
          <li>Describe your problem in more detail.</li>
          <li>Explain what you tried and what you expected.</li>
          <li>Review your question and post it to the site.</li>
        </ul>
      </section>

      <section className="question-form">
        <h3 className="Ask">Ask a Public Question </h3>
        <div className="Go">
          <p>Go to Question page</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
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

          <div className="form-group">
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

          <button type="submit" className="submit-button">
            Post Your Question
          </button>
        </form>

        {success && (
          <div className="success-message">
            ✅ Your question has been posted successfully!
          </div>
        )}

        {error && <div className="error-message">{error}</div>}
      </section>
    </div>
  );
}

export default AskQuestion;
