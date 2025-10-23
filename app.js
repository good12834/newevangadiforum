const express = require("express");
const cors = require("cors");
const path = require("path");
const dbConnection = require("./db/dbConfig");
const createTables = require("./db/dbSchema");
const userRoutes = require("./routes/userRoutes");
const questionRoutes = require("./routes/questionRoutes");
const answerRoutes = require("./routes/answerRoute");
const app = express();
const port = process.env.PORT || 5500;
// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:3000', 'https://evangadiforum.goodtess.com'],
  credentials: true
}));
app.use(express.json());
// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'client/dist')));
// Routes
app.use("/api/users", userRoutes);
app.use("/api/question", questionRoutes);
app.use("/api/answers", answerRoutes);
// Endpoint to create tables
app.get("/create-table", createTables);
// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Evangadi Forum backend" });
});
// Catch all handler: send back React's index.html file for client-side routing
app.use((req, res) => {
  // Only serve index.html for non-API routes
  if (!req.originalUrl.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'client/dist/index.html'));
  } else {
    res.status(404).json({ message: "API Route not found" });
  }
});
// Start server
async function startServer() {
  try {
    // Test database connection
    await dbConnection.execute("select 'test'");
    console.log("Database connection established");
  } catch (error) {
    console.log("Database connection failed:", error.message);
  } finally {
    // Always start the server to avoid Render killing the process
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  }
}
startServer();



