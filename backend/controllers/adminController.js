const { pool } = require('../config/db');
const { cloudinary } = require('../config/cloudinary');

// Get all pending resources
exports.getPendingResources = async (req, res) => {
  try {
    const [resources] = await pool.query(
      `SELECT r.*, u.name as uploaderName, u.email as uploaderEmail 
       FROM resources r 
       JOIN users u ON r.uploadedBy = u.id 
       WHERE r.status = 'pending' 
       ORDER BY r.uploadedAt DESC`
    );

    res.json({ resources });
  } catch (error) {
    console.error('Get pending resources error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all resources (for admin dashboard)
exports.getAllResources = async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = `SELECT r.*, u.name as uploaderName, u.email as uploaderEmail 
                 FROM resources r 
                 JOIN users u ON r.uploadedBy = u.id`;
    
    const params = [];
    
    if (status) {
      query += ' WHERE r.status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY r.uploadedAt DESC';
    
    const [resources] = await pool.query(query, params);

    res.json({ resources });
  } catch (error) {
    console.error('Get all resources error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Approve resource
exports.approveResource = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      'UPDATE resources SET status = ? WHERE id = ?',
      ['approved', id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    res.json({ message: 'Resource approved successfully' });
  } catch (error) {
    console.error('Approve resource error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reject resource
exports.rejectResource = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      'UPDATE resources SET status = ? WHERE id = ?',
      ['rejected', id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    res.json({ message: 'Resource rejected successfully' });
  } catch (error) {
    console.error('Reject resource error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete resource
exports.deleteResource = async (req, res) => {
  try {
    const { id } = req.params;

    // Get resource details first
    const [resources] = await pool.query('SELECT * FROM resources WHERE id = ?', [id]);

    if (resources.length === 0) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    const resource = resources[0];

    // Delete from Cloudinary
    try {
      await cloudinary.uploader.destroy(resource.publicId);
    } catch (cloudinaryError) {
      console.error('Cloudinary deletion error:', cloudinaryError);
      // Continue with database deletion even if Cloudinary fails
    }

    // Delete from database
    await pool.query('DELETE FROM resources WHERE id = ?', [id]);

    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Delete resource error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const [pendingCount] = await pool.query(
      'SELECT COUNT(*) as count FROM resources WHERE status = ?',
      ['pending']
    );
    
    const [approvedCount] = await pool.query(
      'SELECT COUNT(*) as count FROM resources WHERE status = ?',
      ['approved']
    );
    
    const [rejectedCount] = await pool.query(
      'SELECT COUNT(*) as count FROM resources WHERE status = ?',
      ['rejected']
    );
    
    const [totalUsers] = await pool.query(
      'SELECT COUNT(*) as count FROM users WHERE role = ?',
      ['student']
    );

    res.json({
      stats: {
        pendingResources: pendingCount[0].count,
        approvedResources: approvedCount[0].count,
        rejectedResources: rejectedCount[0].count,
        totalStudents: totalUsers[0].count
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
