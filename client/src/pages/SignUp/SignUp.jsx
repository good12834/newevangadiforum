import { useState, useContext } from "react";
import axios from "../../API/axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserProvider";
import { jwtDecode } from "jwt-decode";
import styles from "./SignUp.module.css";
import { Eye, EyeOff } from "lucide-react";
const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [user, setUser] = useContext(UserContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Real-time password validation
    if (name === "password") {
      if (value.length > 0 && value.length < 8) {
        setPasswordError("Password must be at least 8 characters");
      } else {
        setPasswordError("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear any existing toasts first
    toast.dismiss();
    
    // Validation checks - do this BEFORE setLoading(true)
    if (
      !formData.username ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password
    ) {
      toast.error("All fields are required!");
      return;
    }

    // Password validation
    if (formData.password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      toast.error("Password must be at least 8 characters long");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Only set loading to true AFTER all validations pass
    setLoading(true);

    try {
      const res = await axios.post("/users/register", {
        username: formData.username,
        firstname: formData.firstName,
        lastname: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      if (res.status === 201) {
        try {
          const loginRes = await axios.post("/users/login", {
            email: formData.email,
            password: formData.password,
          });

          if (loginRes.status === 200) {
            const token = loginRes.data.token;
            localStorage.setItem("token", token);

            const decoded = jwtDecode(token);

            setUser({
              user_id: decoded.userid,
              user_name: decoded.username,
              token: token,
            });

            toast.success("Registration successful! Welcome!");
            navigate("/home");
          }
        } catch (loginError) {
          console.error("Auto-login failed:", loginError);
          toast.success("Registration successful! Please log in.");
          navigate("/users/login");
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      
      if (error.response) {
        toast.error(error.response.data?.msg || "Signup failed. Please try again.");
      } else if (error.request) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapperContainer}>
      <div className={styles.registerPage}>
        <div className={styles.registerBox}>
          <h2>Join the Network</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.nameFields}>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                className={styles.inputField}
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                className={styles.inputField}
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              className={styles.inputField}
              value={formData.username}
              onChange={handleInputChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className={styles.inputField}
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className={`${styles.inputField} ${passwordError ? styles.inputError : ''}`}
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
                onMouseDown={(e) => e.preventDefault()}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {/* Password error message */}
            {passwordError && (
              <div className={styles.passwordError}>
                {passwordError}
              </div>
            )}
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>
          <p className={styles.switchText}>
            Already have an account? <Link to="/users/login">Login</Link>
          </p>
        </div>
      </div>

      <div className={styles.container}>
        <h3>About</h3>
        <h1>Evangadi Network</h1>
        <div>
          <p>
            No matter what stage of life you are in, whether you're starting
            elementary school or being promoted to CEO of a Fortune 500 company,
            you have much to offer to those who are trying to follow in your
            footsteps.
          </p>
          <p>
            Whether you are willing to share your knowledge or you are just
            looking to meet mentors of your own, please start by joining the
            network here.
          </p>
          <Link to="/how-it-works">
            <button className={styles.button}>HOW IT WORKS</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;