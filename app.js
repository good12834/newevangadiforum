const express = require("express");
const app = express();
const port = 5500;

// db connection
const dbConnection = require("./db/dbConfig");

const createTables = require("./db/dbSchema");

// JSON middleware to extract json data
app.use(express.json());

// User route middleware file
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

// Question router middleware file
const questionRoutes = require("./routes/questionRoutes");
app.use("/api/question", questionRoutes);

// Answer route middleware file
const answerRoutes = require("./routes/answerRoute");
app.use("/api/answers", answerRoutes);

// Create tables with an endpoint
app.get("/create-table", createTables);

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Q&A Platform API" });
});

// 404 handler
app.use("/", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

async function start() {
  try {
    const result = await dbConnection.execute("select 'test'");
    console.log("Database connection established");
    app.listen(port);
    console.log(`Server listening on port ${port}`);
  } catch (error) {
    console.log(error.message);
  }
}

start();
