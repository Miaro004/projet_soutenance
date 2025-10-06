const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sged_mahajanga',
  charset: 'utf8mb4',
  timezone: 'local'
});

connection.connect((err) => {
  if (err) {
    console.error('Database connection failed: ', err.stack);
    return;
  }
  console.log('Connected to database as id ' + connection.threadId);
});

// Promisifier les requêtes pour utiliser async/await
connection.query = require('util').promisify(connection.query).bind(connection);

module.exports = connection;