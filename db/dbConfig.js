const mysql2 = require("mysql2");
require("dotenv").config();

// Determine if SSL is needed (Aiven, some cloud providers require it)
const needsSSL = process.env.DB_SSL === "true" || process.env.NODE_ENV === "production";

// Helper to create MySQL config with optional SSL
function createMySQLConfig(baseConfig) {
  const config = { ...baseConfig };
  config.connectionLimit = 1000;
  // Aiven and many cloud providers require SSL
  if (needsSSL || (process.env.MYSQL_URL && process.env.MYSQL_URL.includes("ssl-mode=REQUIRED"))) {
    config.ssl = {
      rejectUnauthorized: false, // Accept self-signed certs from Aiven
    };
  }
  return config;
}

let dbConfig;

if (process.env.MYSQL_URL) {
  // Parse MYSQL_URL format: mysql://user:password@host:port/database?ssl-mode=REQUIRED
  try {
    const url = new URL(process.env.MYSQL_URL);
    dbConfig = createMySQLConfig({
      host: url.hostname,
      port: url.port,
      user: url.username,
      password: url.password,
      database: url.pathname.substring(1), // Remove leading slash
    });
  } catch (e) {
    console.error("Failed to parse MYSQL_URL:", e.message);
    // Fallback to individual env vars
    dbConfig = createMySQLConfig({
      user: process.env.DB_USER || "avnadmin",
      database: process.env.DB_NAME || "defaultdb",
      host: process.env.DB_HOST,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT || 10171,
    });
  }
} else {
  // Fallback to individual environment variables
  dbConfig = createMySQLConfig({
    user: process.env.DB_USER || "avnadmin",
    database: process.env.DB_NAME || "defaultdb",
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 3306,
  });
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
