const mysql2 = require("mysql2");
require("dotenv").config();

function createMySQLConfig(baseConfig) {
  const config = { ...baseConfig };
  config.connectionLimit = 100;
  config.waitForConnections = true;
  config.queueLimit = 0;
  if (process.env.NODE_ENV === "production") {
    config.ssl = {
      rejectUnauthorized: false,
    };
  }
  return config;
}

let dbConfig;
if (process.env.MYSQL_URL) {
  try {
    const url = new URL(process.env.MYSQL_URL);
    dbConfig = createMySQLConfig({
      host: url.hostname,
      port: url.port,
      user: url.username,
      password: url.password,
      database: url.pathname.substring(1),
    });
  } catch (e) {
    console.error("Failed to parse MYSQL_URL:", e.message);
    dbConfig = createMySQLConfig({
      user: process.env.DB_USER || "avnadmin",
      database: process.env.DB_NAME || "defaultdb",
      host: process.env.DB_HOST,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT || 10171,
    });
  }
} else {
  dbConfig = createMySQLConfig({
    user: process.env.DB_USER || "avnadmin",
    database: process.env.DB_NAME || "defaultdb",
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 3306,
  });
}

// Create the pool
const pool = mysql2.createPool(dbConfig);
const promisePool = pool.promise();

// Export the pool immediately so the server can start
module.exports = promisePool;

// Async connection attempt - log result but don't block startup
(async () => {
  try {
    await promisePool.execute("SELECT 1");
    console.log("Database connected successfully");
  } catch (error) {
    console.error("FATAL: Database connection failed:", error.message);
    console.error("Database host:", dbConfig.host || process.env.DB_HOST);
    console.error("Database port:", dbConfig.port || process.env.DB_PORT);
    console.error("Database user:", dbConfig.user || process.env.DB_USER);
    console.error("Database name:", dbConfig.database || process.env.DB_NAME);
    console.error("NOTE: The server is running but database operations will fail!");
  }
})();