const jwt = require("jsonwebtoken");
require("dotenv").config()
const { StatusCodes } = require("http-status-codes");

// checks if the token is sent 
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: "Unauthorized",
      message: "Authentication invalid",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    
    const { username, id } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { username, id};
    next();
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: "Unauthorized",
      message: "Authentication invalid",
    });
  }
};

module.exports = authMiddleware;
