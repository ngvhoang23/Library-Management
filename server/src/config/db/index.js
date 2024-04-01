const mysql = require("mysql");
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "lib_db",
  charset: "utf8mb4",
  multipleStatements: true,
  dateStrings: true,
});

module.exports = db;
