const { pool } = require('../config/db');
const { cloudinary } = require('../config/cloudinary');

// Upload resource
exports.uploadResource = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const { title, description } = req.body;

    if (!title) {
      // Delete uploaded file from cloudinary if validation fails
      await cloudinary.uploader.destroy(req.file.filename);
      return res.status(400).json({ message: 'Title is required' });
    }

    const [result] = await pool.query(
      `INSERT INTO resources (title, description, fileUrl, publicId, fileType, fileSize, uploadedBy) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description || '',
        req.file.path,
        req.file.filename,
        req.file.mimetype,
        req.file.size,
        req.user.id
      ]
    );

    res.status(201).json({
      message: 'Resource uploaded successfully',
      resource: {
        id: result.insertId,
        title,
        description,
        fileUrl: req.file.path,
        status: 'pending'
      }
    });
  } catch (error) {
    console.error('Upload resource error:', error);
    
    // Try to clean up cloudinary file if database insert fails
    if (req.file) {
      await cloudinary.uploader.destroy(req.file.filename).catch(err => console.error(err));
    }
    
    res.status(500).json({ message: 'Server error during upload' });
  }
};

// Get student's own resources
exports.getMyResources = async (req, res) => {
  try {
    const [resources] = await pool.query(
      `SELECT r.*, u.name as uploaderName 
       FROM resources r 
       JOIN users u ON r.uploadedBy = u.id 
       WHERE r.uploadedBy = ? 
       ORDER BY r.uploadedAt DESC`,
      [req.user.id]
    );

    res.json({ resources });
  } catch (error) {
    console.error('Get my resources error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all approved resources (public)
exports.getApprovedResources = async (req, res) => {
  try {
    const [resources] = await pool.query(
      `SELECT r.*, u.name as uploaderName 
       FROM resources r 
       JOIN users u ON r.uploadedBy = u.id 
       WHERE r.status = 'approved' 
       ORDER BY r.uploadedAt DESC`
    );

    res.json({ resources });
  } catch (error) {
    console.error('Get approved resources error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get resource by ID
exports.getResourceById = async (req, res) => {
  try {
    const [resources] = await pool.query(
      `SELECT r.*, u.name as uploaderName, u.email as uploaderEmail 
       FROM resources r 
       JOIN users u ON r.uploadedBy = u.id 
       WHERE r.id = ?`,
      [req.params.id]
    );

    if (resources.length === 0) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    res.json({ resource: resources[0] });
  } catch (error) {
    console.error('Get resource error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
