const mysql2 = require("mysql2");
require("dotenv").config();

// Use Railway's MYSQL_URL if available, otherwise fall back to individual variables
let dbConfig;

if (process.env.MYSQL_URL) {
  // Parse Railway's MYSQL_URL format: mysql://user:password@host:port/database
  const url = new URL(process.env.MYSQL_URL);
  dbConfig = {
    host: url.hostname,
    port: url.port,
    user: url.username,
    password: url.password,
    database: url.pathname.substring(1), // Remove leading slash
    connectionLimit: 1000,
  };
} else {
  // Fallback to individual environment variables
  dbConfig = {
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 3306,
    connectionLimit: 1000,
  };
}


const dbConnection = mysql2.createPool(dbConfig);

// Test connection
dbConnection.execute("SELECT 'test'", (err, result) => {
  if (err) {
    console.log("Database connection failed:", err.message);
  } else {
    console.log("Database connected successfully");
  }
});

module.exports = dbConnection.promise();
// module.exports = dbConnection;
