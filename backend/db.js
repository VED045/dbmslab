// db.js
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // change if your MySQL user is different
  password: 'ved123', // enter your MySQL password
  database: 'musicapp' // replace with your DB name
});

db.connect(err => {
  if (err) {
    console.error('DB connection error:', err);
    return;
  }
  console.log('Connected to MySQL DB ✅');
});

module.exports = db;
