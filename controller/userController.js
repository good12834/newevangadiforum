const dbConnection = require("../db/dbConfig");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//
// // db connection
// const dbConnection = require("../db/dbConfig");
// const bcrypt = require("bcrypt");
// const { StatusCodes } = require("http-status-codes");
// require("dotenv").config();

// const jwt = require("jsonwebtoken");

// async function register(req, res) {
//   const { username, firstname, lastname, email, password } = req.body;

//   if (!email || !password || !firstname || !lastname || !username) {
//     return res
//       .status(StatusCodes.BAD_REQUEST)
//       .json({ msg: "please provide all required fields" });
//   }

//   // Add database logic here
//   try {
//     const [user] = await dbConnection.query(
//       "SELECT user_name, user_id FROM userTable WHERE user_name = ? OR email = ?",
//       [username, email]
//     );

//     if (user.length > 0) {
//       return res
//         .status(StatusCodes.BAD_REQUEST)
//         .json({ msg: "user already registered" });
//     }

//     if (password.length < 8) {
//       return res
//         .status(StatusCodes.BAD_REQUEST)
//         .json({ msg: "password must be at least 8 characters" });
//     }

//     // encrypt the password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     await dbConnection.query(
//       "INSERT INTO userTable (user_name, first_name, last_name, email, password) VALUES (?,?,?,?,?)",
//       [username, firstname, lastname, email, hashedPassword]
//     );
//     return res.status(StatusCodes.CREATED).json({ msg: "user table created" });
//   } catch (error) {
//     console.log(error.message);
//     return res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ msg: "something went wrong, try again later!" });
//   }
// }

// async function login(req, res) {
//   const { email, password } = req.body;
//   if (!email || !password) {
//     return res
//       .status(StatusCodes.BAD_REQUEST)
//       .json({ msg: "please provide all required fields" });
//   }
//   try {
//     const [user] = await dbConnection.query(
//       "SELECT user_name, user_id, password FROM userTable WHERE email = ?",
//       [email]
//     );
//     if (user.length === 0) {
//       return res
//         .status(StatusCodes.BAD_REQUEST)
//         .json({ msg: "user not found" });
//     }
//     const isMatch = await bcrypt.compare(password, user[0].password);

//     if (!isMatch) {
//       return res
//         .status(StatusCodes.BAD_REQUEST)
//         .json({ msg: "invalid credentials" });
//     }
//     const username = user[0].user_name;
//     const userid = user[0].user_id;
//     const token = jwt.sign({ userid, username }, process.env.JWT_SECRET, {
//       expiresIn: "1d",
//     });

//     return res.status(StatusCodes.OK).json({ msg: "login successful", token });
//   } catch (error) {
//     console.log(error.message);
//     return res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ msg: "something went wrong, try again later!" });
//   }
// }

// async function checkUser(req, res) {
//   const username = req.user.username;
//   const userid = req.user.userid;

//   res.status(StatusCodes.OK).json({ msg: "valid user", username, userid });
// }

// async function forgetPassword(req, res) {
//   const { email } = req.body;

//   if (!email) {
//     return res
//       .status(StatusCodes.BAD_REQUEST)
//       .json({ msg: "Email is required" });
//   }

//   try {
//     const [user] = await dbConnection.query(
//       "SELECT user_id FROM userTable WHERE email = ?",
//       [email]
//     );

//     if (user.length === 0) {
//       // Don't reveal if email exists or not for security
//       return res.status(StatusCodes.OK).json({
//         msg: "If the email exists, a reset link has been sent",
//       });
//     }

//     // TODO: Generate reset token and send email
//     // For now, just return success message
//     return res.status(StatusCodes.OK).json({
//       msg: "If the email exists, a reset link has been sent",
//     });
//   } catch (error) {
//     console.log(error.message);
//     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       msg: "Something went wrong, try again later!",
//     });
//   }
// }

// module.exports = { register, login, checkUser, forgetPassword };
const register = async (req, res) => {
  try {
    const { username, firstname, lastname, email, password } = req.body;

    console.log("Registration attempt:", { username, email });

    // Validation
    if (!username || !firstname || !lastname || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user exists
    const [existingUser] = await dbConnection.execute(
      "SELECT user_id FROM userTable WHERE user_name = ? OR email = ?",
      [username, email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user
    const [result] = await dbConnection.execute(
      "INSERT INTO userTable (user_name, first_name, last_name, email, password) VALUES (?, ?, ?, ?, ?)",
      [username, firstname, lastname, email, hashedPassword]
    );

    res.status(201).json({
      message: "User registered successfully",
      userId: result.insertId,
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
    const [user] = await dbConnection.execute(
      "SELECT user_id, user_name, password FROM userTable WHERE email = ?",
      [email]
    );
    if (user.length === 0) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user[0].password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ userid: user[0].user_id, username: user[0].user_name }, process.env.JWT_SECRET, {
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
    const [user] = await dbConnection.execute(
      "SELECT user_id FROM userTable WHERE email = ?",
      [email]
    );

    if (user.length === 0) {
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