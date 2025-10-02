const mysql2 = require("mysql2");
require("dotenv").config();

const dbConnection = mysql2.createPool({
  user: process.env.DB_USER,
  database: "evangadi_forum_project_db",
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  connectionLimit: 10,
});

dbConnection.execute("SELECT 'test'", (err, result) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log(result);
  }
});

module.exports = dbConnection.promise();
// module.exports = dbConnection;
