import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import styles from "./EditQuestion.module.css";
import { QuestionContext } from "../../context/QuestionProvider";
import { UserContext } from "../../context/UserProvider";
import DOMPurify from "dompurify";
import "quill/dist/quill.snow.css";
import Quill from "quill";
import axiosInstance from "../../API/axios";
const EditQuestion = () => {
  const { question_id } = useParams(); // Get question ID from URL
  const navigate = useNavigate(); // Navigate after update or discard
  const [user] = useContext(UserContext); // Current logged-in user
  const { questions, setQuestions } = useContext(QuestionContext); // Questions state
  const token = localStorage.getItem("token"); // JWT token
  const [loading, setLoading] = useState(true); // Loading state while fetching question
  const [error, setError] = useState(""); // Error messages
  const [editorContent, setEditorContent] = useState(""); // Content in Quill editor
  const [originalContent, setOriginalContent] = useState(""); // Original content for comparison
  const quillRef = useRef(null); // DOM reference for Quill editor
  const quillInstance = useRef(null); // Quill instance reference

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm(); // React Hook Form for validation

  // Find question in context state
  const question = questions.find((q) => q.question_id == question_id);

  // Fetch question data on mount or when question_id changes
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        let questionData;

        if (!question) {
          // Fetch from backend if not in local context
          const response = await axiosInstance.get(`/question/${question_id}`);
          questionData = response.data;
          setQuestions((prev) => [...prev, questionData]); // Update context
        } else {
          questionData = question;
        }

        // Sanitize HTML content to prevent XSS
        const sanitizedContent = DOMPurify.sanitize(
          questionData.question_description || ""
        );

        setEditorContent(sanitizedContent);
        setOriginalContent(sanitizedContent);

        // Populate form fields with fetched data
        reset({
          title: questionData.title,
          tag: questionData.tag || "",
        });

        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load question data.");
        setLoading(false);
      }
    };

    if (token) {
      fetchQuestion();
    }
  }, [question, question_id, token, reset, setQuestions]);

  // Initialize Quill editor
  useEffect(() => {
    if (quillRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(quillRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["blockquote", "code-block"],
            ["link"],
            ["clean"],
          ],
        },
      });

      // Set initial content
      quillInstance.current.root.innerHTML = editorContent;

      // Update editorContent state on text change
      quillInstance.current.on("text-change", () => {
        setEditorContent(
          DOMPurify.sanitize(quillInstance.current.root.innerHTML)
        );
      });
    }
  }, [editorContent]);

  // Handle form submission
  const onSubmit = async (data) => {
    if (!editorContent.trim()) {
      setError("Question description cannot be empty");
      return;
    }

    try {
      const updatedQuestion = {
        title: data.title,
        question_description: editorContent,
        tag: data.tag || "",
      };

      // Send PUT request to update question
      await axiosInstance.put(`/question/${question_id}`, updatedQuestion);

      // Update question in local context
      setQuestions((prev) =>
        prev.map((q) =>
          q.question_id == question_id ? { ...q, ...updatedQuestion } : q
        )
      );

      // Navigate to question detail page
      navigate(`/questions/${question_id}`);
    } catch (err) {
      console.error("Update error:", err);
      setError("Failed to update question. Please try again.");
    }
  };

  // Handle discard action
  const handleDiscard = () => {
    navigate(-1); // Go back to previous page
  };

  // Show loading message while fetching
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <p>Loading question...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Edit Your Question</h2>
        <p>Make changes to your question below</p>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {/* Question Title */}
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>
            Question Title
          </label>
          <input
            id="title"
            type="text"
            {...register("title", {
              required: "Title is required",
              minLength: {
                value: 10,
                message: "Title should be at least 10 characters long",
              },
            })}
            className={styles.input}
            placeholder="Enter a clear and descriptive title..."
          />
          {errors.title && (
            <p className={styles.errorText}>{errors.title.message}</p>
          )}
        </div>

        {/* Question Preview */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Question Preview</label>
          <div
            className={styles.previewBox}
            dangerouslySetInnerHTML={{ __html: editorContent }}
          />
        </div>

        {/* Quill Editor for editing description */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Edit Question Description</label>
          <div ref={quillRef} className={styles.quillEditor}></div>
          <small className={styles.helpText}>
            Describe your problem in detail. Include what you tried and what you
            expected to happen.
          </small>
        </div>

        {/* Tags */}
        <div className={styles.formGroup}>
          <label htmlFor="tag" className={styles.label}>
            Tags (Optional)
          </label>
          <input
            id="tag"
            type="text"
            {...register("tag")}
            className={styles.input}
            placeholder="e.g., javascript, react, nodejs"
          />
          <small className={styles.helpText}>
            Add tags to help others find your question (comma-separated)
          </small>
        </div>

        {/* Action buttons */}
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
};

export default EditQuestion;
