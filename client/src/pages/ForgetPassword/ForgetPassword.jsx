import React, { useRef, useState } from "react";
import styles from "./ForgetPassword.module.css"; // ✅ Fixed import name
import { Link, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import axiosInstance from "../../API/axios";

function ForgetPassword() {
  const emailDom = useRef(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const emailValue = emailDom.current.value.trim();

    if (!emailValue) {
      setError("An email is required");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/users/forget-password", {
        email: emailValue,
      });

      setLoading(false);
      alert(response.data.msg);
    } catch (err) {
      setLoading(false);
      setError(
        err.response?.data?.msg || "Something went wrong, please try again."
      );
      console.error("Error:", err.response?.data?.msg || err.message);
    }
  }

  return (
    <section className={styles.container}>
      <div className={styles.card}>
        <h3>Reset your password</h3>
        <p className={styles.instruction}>
          Enter your email address below, and we will send you an email with
          instructions to reset your password.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            ref={emailDom}
            type="email"
            placeholder="Email address"
            className={error ? styles.inputError : styles.input}
          />
          {error && <p className={styles.error}>{error}</p>}

          <button className={styles.button} type="submit" disabled={loading}>
            {loading ? (
              <div className={styles.loading}>
                <ClipLoader color="#fff" size={12} />
                <span>Sending...</span>
              </div>
            ) : (
              "Reset your password"
            )}
          </button>
        </form>

        <div className={styles.linkContainer}>
          <Link to="/login" className={styles.link}>
            {" "}
            {/* ✅ Fixed route */}
            Already have an account?
          </Link>
          <Link to="/signup" className={styles.link}>
            {" "}
            {/* ✅ Fixed route */}
            Don't have an account?
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ForgetPassword;
