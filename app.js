const express = require("express");
const app = express();
const port = 5500;
const createTables = require("./db/dbSchema");

// app.get("/", (req, res) => {
//   res.send("Welcome");
// });

// User route middleware file
const userRoutes = require("./routes/userRoutes");

// users routes middleware
app.use("/api/users", userRoutes);

// Create tables with an endpoint
app.get("/create-table", createTables);

app.listen(port, (err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log(`listening on ${port}`);
  }
});
