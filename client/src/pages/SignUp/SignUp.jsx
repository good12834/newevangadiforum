import { useState, useContext } from "react";
import axios from "../../API/axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserProvider";
import styles from "./SignUp.module.css";

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
  const [user, setUser] = useContext(UserContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (
      !formData.username ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password
    ) {
      toast.error("All fields are required!");
      setLoading(false);
      return;
    }

    // Password validation
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("/users/register", {
        username: formData.username,
        firstname: formData.firstName,
        lastname: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      if (res.status === 201) {
        // After successful registration, automatically log the user in
        try {
          const loginRes = await axios.post("/users/login", {
            email: formData.email,
            password: formData.password,
          });

          if (loginRes.status === 200) {
            // Save token to localStorage
            localStorage.setItem("token", loginRes.data.token);

            // Set user context
            setUser({
              user_name: loginRes.data.user?.username || formData.username,
              user_id: loginRes.data.user?.id,
            });

            toast.success("Registration successful! Welcome!");
            navigate("/home"); // Redirect to home page
          }
        } catch (loginError) {
          // If auto-login fails, redirect to login page
          toast.success("Registration successful! Please log in.");
          navigate("/users/login");
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapperContainer}>
      {/* Registration Section */}
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
                className={styles.inputField}
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
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

      {/* About container section */}
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
