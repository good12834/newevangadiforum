const dbConnection = require("../db/dbConfig");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const register = async (req, res) => {
  try {
    const { username, firstname, lastname, email, password } = req.body;

    console.log("Registration attempt:", { username, email });

    // Validation
    if (!username || !firstname || !lastname || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user exists
    const existingUser = await dbConnection.query(
      "SELECT user_id FROM userTable WHERE user_name = $1 OR email = $2",
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user
    const result = await dbConnection.query(
      "INSERT INTO userTable (user_name, first_name, last_name, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING user_id",
      [username, firstname, lastname, email, hashedPassword]
    );

    res.status(201).json({
      message: "User registered successfully",
      userId: result.rows[0].user_id,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed: " + error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const user = await dbConnection.query(
      "SELECT user_id, user_name, password FROM userTable WHERE email = $1",
      [email]
    );
    if (user.rows.length === 0) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.rows[0].password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ userid: user.rows[0].user_id, username: user.rows[0].user_name }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed: " + error.message });
  }
};

const checkUser = async (req, res) => {
  const username = req.user.username;
  const userid = req.user.userid;

  res.status(200).json({ message: "Valid user", username, userid });
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await dbConnection.query(
      "SELECT user_id FROM userTable WHERE email = $1",
      [email]
    );

    if (user.rows.length === 0) {
      // Don't reveal if email exists or not for security
      return res.status(200).json({
        message: "If the email exists, a reset link has been sent",
      });
    }

    // TODO: Generate reset token and send email
    // For now, just return success message
    return res.status(200).json({
      message: "If the email exists, a reset link has been sent",
    });
  } catch (error) {
    console.error("Forget password error:", error);
    res.status(500).json({ error: "Something went wrong: " + error.message });
  }
};

module.exports = { register, login, checkUser, forgetPassword };