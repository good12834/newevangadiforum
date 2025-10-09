import React, { useState, useContext } from "react";
import styles from "./Login.module.css";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserProvider";
import axiosInstance from "../../API/axios";
import { ClipLoader } from "react-spinners";
import { jwtDecode } from "jwt-decode";


function Login() {
  const navigate = useNavigate(); // Navigation after successful login
  const [user, setUser] = useContext(UserContext); // Global user state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  }); // Form fields

  const [error, setError] = useState(""); // Error message state
  const [successMessage, setSuccessMessage] = useState(""); // Success message state
  const [loading, setLoading] = useState(false); // Loading state for button/spinner

  // Update form state on input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Both fields are required!");
      setLoading(false);
      return;
    }

    try {
      // API call to login endpoint
      const response = await axiosInstance.post("/users/login", formData);
      setSuccessMessage(response.data.msg);

      const token = response.data.token;
      localStorage.setItem("token", token); // Save token to localStorage

      // Decode JWT to get user info
      const decoded = jwtDecode(token);
      console.log("🔍 Login - Decoded token:", decoded);

      // Update global user context
      setUser({
        user_id: decoded.userid, // Map to user_id
        user_name: decoded.username, // Map to user_name
        token: token,
      });

      // Small delay to ensure context updates before navigation
      setTimeout(() => {
        navigate("/home");
      }, 100);
    } catch (error) {
      console.error("Login error:", error);

      // Show server-provided message or generic error
      setError(
        error.response?.data?.msg || "Something went wrong! Please try again."
      );
    }
    setLoading(false); // Always stop loading
  };

  return (
    <section className={styles.loginContainer}>
      <div className={styles.leftWrapper}>
        <div className={styles.formContainer}>
          <h1>Login</h1>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {/* Display errors or success messages */}
            {error && <div className={styles.error}>{error}</div>}
            {successMessage && (
              <div className={styles.success}>{successMessage}</div>
            )}

            <h3 className={styles.forgot__password}>
              <Link to="/forget-password">Forgot your password?</Link>
            </h3>

            {/* Submit button with loading spinner */}
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? (
                <>
                  <ClipLoader size={20} color="#36d7b7" />
                  Logging in...
                </>
              ) : (
                "Log in"
              )}
            </button>
          </form>

          {/* Link to registration page */}
          <h3 className={styles.registerLink}>
            Don't have an account?{" "}
            <Link
              className={styles["text-pr"]}
              style={{ color: "orange" }}
              to="/users/register"
            >
              Sign up
            </Link>
          </h3>
        </div>
      </div>

      {/* Right side: illustration and info */}
      <div className={styles.rightWrapperLogin}>
        <div className={styles.overridephoto}>
          <svg width="80" height="80" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0 40C25.4247 40 40 25.4247 40 0C40 25.4247 54.5753 40 80 40C54.5753 40 40 54.5753 40 80C40 54.5753 25.4247 40 0 40Z"
              fill="#F39228"
            ></path>
          </svg>
          <div className={styles.textContainer}>
            <h1>
              <span>5 Stage</span> Unique Learning Method
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
