const express = require("express");
const app = express();
const port = 5500;

// app.get("/", (req, res) => {
//   res.send("Welcome");
// });

// User route middleware file
const userRoutes = require("./routes/userRoutes");

// questions route middleware file

// answers route middleware file

// users routes middleware
app.use("/api/users", userRoutes);

// questions route middleware

// answers route middleware

app.listen(port, (err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log(`listening on ${port}`);
  }
});
