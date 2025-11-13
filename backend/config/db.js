const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const promisePool = pool.promise();

// Database initialization
const initDB = async () => {
  try {
    // Create users table
    await promisePool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('student', 'admin') DEFAULT 'student',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create resources table
    await promisePool.query(`
      CREATE TABLE IF NOT EXISTS resources (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        fileUrl VARCHAR(500) NOT NULL,
        publicId VARCHAR(255) NOT NULL,
        fileType VARCHAR(50),
        fileSize INT,
        uploadedBy INT NOT NULL,
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        uploadedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (uploadedBy) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
};

module.exports = { pool: promisePool, initDB };
