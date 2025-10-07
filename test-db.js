// test-db.js
require("dotenv").config(); 
const mysql = require("mysql2");

console.log("Testing database connection with:");
console.log("Host:", process.env.DB_HOST);
console.log("User:", process.env.DB_USER);
console.log("Database:", process.env.DB_NAME);

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((error) => {
  if (error) {
    console.log("❌ Connection failed:", error.message);
    console.log("Error code:", error.code);
  } else {
    console.log("✅ Database connected successfully!");

    // Test query
    connection.query("SHOW TABLES", (err, results) => {
      if (err) {
        console.log("Query error:", err.message);
      } else {
        console.log("Tables found:", results);
      }
      connection.end();
    });
  }
});
