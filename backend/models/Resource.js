const { pool } = require('../config/db');

// Create resource
exports.create = async ({ title, description, fileUrl, publicId, fileType, fileSize, uploadedBy }) => {
  const [result] = await pool.query(
    `INSERT INTO resources (title, description, fileUrl, publicId, fileType, fileSize, uploadedBy)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [title, description, fileUrl, publicId, fileType, fileSize, uploadedBy]
  );
  return result.insertId;
};

// Get all approved resources (with pagination and optional search)
exports.getApproved = async (search, limit = 25, offset = 0) => {
  let query = `SELECT r.*, u.name as uploaderName FROM resources r JOIN users u ON r.uploadedBy = u.id WHERE r.status = 'approved'`;
  let params = [];
  if (search) {
    query += ' AND r.title LIKE ?';
    params.push(`%${search}%`);
  }
  query += ' ORDER BY r.uploadedAt DESC LIMIT ? OFFSET ?';
  params.push(Number(limit), Number(offset));
  const [resources] = await pool.query(query, params);
  return resources;
};

// Find by ID
exports.findById = async (id) => {
  const [resources] = await pool.query(
    `SELECT r.*, u.name as uploaderName, u.email as uploaderEmail
     FROM resources r JOIN users u ON r.uploadedBy = u.id WHERE r.id = ?`, [id]);
  return resources[0];
};

// Get a student's own resources
exports.findByUploader = async (userId) => {
  const [resources] = await pool.query(
    `SELECT r.*, u.name as uploaderName
     FROM resources r JOIN users u ON r.uploadedBy = u.id
     WHERE r.uploadedBy = ?
     ORDER BY r.uploadedAt DESC`, [userId]);
  return resources;
};

// Update resource status
exports.updateStatus = async (id, status) => {
  const [result] = await pool.query('UPDATE resources SET status = ? WHERE id = ?', [status, id]);
  return result.affectedRows;
};

// Delete resource by ID
exports.deleteById = async (id) => {
  const [result] = await pool.query('DELETE FROM resources WHERE id = ?', [id]);
  return result.affectedRows;
};

// Count by status
exports.countByStatus = async (status) => {
  const [rows] = await pool.query('SELECT COUNT(*) as count FROM resources WHERE status=?', [status]);
  return rows[0]?.count || 0;
};
