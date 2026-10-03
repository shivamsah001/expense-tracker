const Database = require('better-sqlite3');
const path = require('path');

// Create (or open) the SQLite database file in the project root.
const dbPath = path.join(__dirname, '..', 'expenses.db');
const db = new Database(dbPath);

// Create the expenses table if it does not exist yet.
db.exec(`
  CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL,
    amount REAL NOT NULL,
    category TEXT NOT NULL,
    date TEXT NOT NULL
  )
`);

module.exports = db;
