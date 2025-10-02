const express = require("express");
const app = express();
const port = 5500;

// Middlewares
app.use(express.json());


//db connection
const dbConnection = require("./db/dbConfig");

const createTables = require("./db/dbSchema");


// JSON middleware to extract json data
app.use(express.json())

// Question router middleware file
const questionRoutes= require("./routes/questionRoutes")

app.use("/api/question", questionRoutes)

// User route middleware file
const userRoutes = require("./routes/userRoutes");
// users routes middleware
app.use("/api/users", userRoutes);


// Create tables with an endpoint
app.get("/create-table", createTables);

async function start() {
  try {
    const result = await dbConnection.execute("select 'test'");
    console.log("database connection established");
    app.listen(port);
    console.log(`listening on ${port}`);
  } catch (error) {
    console.log(error.message);
  }
}

start();
