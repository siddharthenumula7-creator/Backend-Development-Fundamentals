const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");

const dbPath = path.join(__dirname, "books.db");

const initializeDB = async () => {
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  console.log("Database connected successfully");
  return db;
};

module.exports = initializeDB;
