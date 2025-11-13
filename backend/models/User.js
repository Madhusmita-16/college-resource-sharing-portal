const { pool } = require('../config/db');

// Find user by email
exports.findByEmail = async (email) => {
  const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return users[0];
};

// Create new user
exports.create = async (name, email, password, role) => {
  const [result] = await pool.query(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, password, role]
  );
  return result.insertId;
};

// Find user by ID
exports.findById = async (id) => {
  const [users] = await pool.query('SELECT id, name, email, role, createdAt FROM users WHERE id = ?', [id]);
  return users[0];
};

// Count users by role
exports.countByRole = async (role) => {
  const [rows] = await pool.query('SELECT COUNT(*) as count FROM users WHERE role=?', [role]);
  return rows[0]?.count || 0;
};
