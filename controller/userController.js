// db connection
const dbConnection = require("../db/dbConfig");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");

const jwt = require("jsonwebtoken");

async function register(req, res) {
  const { username, firstname, lastname, email, password } = req.body;

  if (!email || !password || !firstname || !lastname || !username) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "please provide all required fields" });
  }

  // Add database logic here
  try {
    const [user] = await dbConnection.query(
      "SELECT user_name, user_id FROM userTable WHERE user_name = ? OR email = ?",
      [username, email]
    );

    if (user.length > 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "user already registered" });
    }

    if (password.length < 8) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "password must be at least 8 characters" });
    }

    // encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await dbConnection.query(
      "INSERT INTO userTable (user_name, first_name, last_name, email, password) VALUES (?,?,?,?,?)",
      [username, firstname, lastname, email, hashedPassword]
    );
    return res.status(StatusCodes.CREATED).json({ msg: "user table created" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "something went wrong, try again later!" });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "please provide all required fields" });
  }
  try {
    const [user] = await dbConnection.query(
      "SELECT user_name, user_id, password FROM userTable WHERE email = ?",
      [email]
    );
    if (user.length === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "user not found" });
    }
    const isMatch = await bcrypt.compare(password, user[0].password);

    if (!isMatch) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "invalid credentials" });
    }
    const username = user[0].user_name;
    const userid = user[0].user_id;
    const token = jwt.sign({ userid, username }, "secret", { expiresIn: "1d" });

    return res.status(StatusCodes.OK).json({ msg: "login successful", token });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "something went wrong, try again later!" });
  }
}

async function checkUser(req, res) {
  const username = req.user.username;
  const userid = req.user.userid;

  res.status(StatusCodes.OK).json({ msg: "valid user", username, userid });
}

module.exports = { register, login, checkUser };
