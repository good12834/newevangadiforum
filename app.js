  const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const dbConnection = require("./db/dbConfig");
const createTables = require("./db/dbSchema");
const userRoutes = require("./routes/userRoutes");
const questionRoutes = require("./routes/questionRoutes");
const answerRoutes = require("./routes/answerRoute");
const aiRoutes = require("./routes/aiRoutes");
const app = express();
const port = process.env.PORT || 5500;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:3000', 'https://evangadiforum.goodtess.com', 'https://newevangadiforum.vercel.app'],
  credentials: true
}));
app.use(express.json());

// Serve static files from the React app build directory (only if it exists)
const clientDistPath = path.join(__dirname, 'client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  console.log("Serving static files from client/dist");
}

// Routes
app.use("/api/users", userRoutes);
app.use("/api/question", questionRoutes);
app.use("/api/answers", answerRoutes);
app.use("/api/ai", aiRoutes);

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
    const indexPath = path.join(__dirname, 'client/dist/index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(200).json({ message: "Evangadi Forum API - Frontend is served separately on Vercel" });
    }
  } else {
    res.status(404).json({ message: "API Route not found" });
  }
});

// Start server immediately - db connection happens asynchronously in dbConfig.js
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
