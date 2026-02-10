const mysql = require("mysql2");
const config = require("./config");

const connection = mysql.createConnection({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database
});

connection.connect((err) => {
  if (err) {
    console.error("DB connection failed:", err);
    return;
  }

  console.log("Connected to RDS successfully");

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS uploads (
      id INT AUTO_INCREMENT PRIMARY KEY,
      filename VARCHAR(255),
      s3key VARCHAR(255),
      uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  connection.query(createTableQuery, (err) => {
    if (err) {
      console.error("Error creating table:", err);
    } else {
      console.log("uploads table ready");
    }
  });
});

module.exports = connection;
