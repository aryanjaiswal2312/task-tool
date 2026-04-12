const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/db.json');

// Initialize DB if not exists
const initDB = () => {
  if (!fs.existsSync(path.join(__dirname, '../data'))) {
    fs.mkdirSync(path.join(__dirname, '../data'), { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ users: [], todos: [] }, null, 2));
  }
};

const readDB = () => {
  initDB();
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(data);
};

const writeDB = (data) => {
  initDB();
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

module.exports = { readDB, writeDB };
