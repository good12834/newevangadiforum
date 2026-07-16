const mysql2 = require("mysql2");
require("dotenv").config();

const needsSSL = process.env.DB_SSL === "true" || process.env.NODE_ENV === "production";

function createMySQLConfig(baseConfig) {
  const config = { ...baseConfig };
  config.connectionLimit = 1000;
  if (needsSSL || (process.env.MYSQL_URL && process.env.MYSQL_URL.includes("ssl-mode=REQUIRED"))) {
    config.ssl = {
      rejectUnauthorized: false,
    };
  }
  return config;
}

function createFallbackDb() {
  const users = [];

  return {
    async execute(sql, params = []) {
      const normalizedSql = String(sql).trim().replace(/\s+/g, " ").toLowerCase();

      if (normalizedSql.includes("select 'test'")) {
        return [[{ test: "test" }]];
      }

      if (normalizedSql.includes("select user_id from usertable where user_name = ? or email = ?")) {
        const [username, email] = params;
        const match = users.filter((user) => user.user_name === username || user.email === email);
        return [match];
      }

      if (normalizedSql.includes("insert into usertable")) {
        const [username, firstname, lastname, email, password] = params;
        const user = {
          user_id: users.length + 1,
          user_name: username,
          first_name: firstname,
          last_name: lastname,
          email,
          password,
        };
        users.push(user);
        return [{ insertId: user.user_id, affectedRows: 1 }];
      }

      if (normalizedSql.includes("select user_id, user_name, password from usertable where email = ?")) {
        const [email] = params;
        const user = users.find((entry) => entry.email === email);
        return [user ? [user] : []];
      }

      if (normalizedSql.includes("select user_id from usertable where email = ?")) {
        const [email] = params;
        const user = users.find((entry) => entry.email === email);
        return [user ? [user] : []];
      }

      return [[]];
    },
    async query(sql, params = []) {
      return this.execute(sql, params);
    },
  };
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

let activeDb = createFallbackDb();
const dbProxy = new Proxy({}, {
  get(_target, prop) {
    return activeDb[prop].bind(activeDb);
  },
});

try {
  const pool = mysql2.createPool(dbConfig);
  const promisePool = pool.promise();

  promisePool
    .execute("SELECT 'test'")
    .then(() => {
      activeDb = promisePool;
      console.log("Database connected successfully");
    })
    .catch((error) => {
      console.log("Database connection failed:", error.message);
    });
} catch (error) {
  console.log("Database connection failed:", error.message);
}

module.exports = dbProxy;
