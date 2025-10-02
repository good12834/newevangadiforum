const express = require("express");
const app = express();
const port = 5500;
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

// DB Connection
const dbConnection = require("./db/dbConfig");
async function start() {
  try {
    const result= await dbConnection.execute("select 'test' ")
    app.listen(port)
    console.log(`listening on: http://localhost:${port}`);
    console.log(result)
  } catch (error) {
    console.log(error.message)
  }
  
}
start();




