const { Pool } = require("pg");
require("dotenv").config();

// Use Render's DATABASE_URL if available, otherwise fall back to individual variables
let dbConfig;

if (process.env.DATABASE_URL) {
  // Render provides DATABASE_URL for PostgreSQL
  dbConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Required for Render PostgreSQL
    },
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
    max: 20,
  };
} else {
  // Fallback to individual environment variables
  dbConfig = {
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  };
}

const dbConnection = new Pool(dbConfig);

// Test connection
dbConnection.query("SELECT 1", (err, result) => {
  if (err) {
    console.log("Database connection failed:", err.message);
  } else {
    console.log("Database connected successfully");
  }
});

module.exports = dbConnection;