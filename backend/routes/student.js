const express = require('express');
const router = express.Router();
const {
  uploadResource,
  getMyResources,
  getApprovedResources,
  getResourceById
} = require('../controllers/studentController');
const { auth, isStudent } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Protected student routes
router.post('/upload', auth, isStudent, upload.single('file'), uploadResource);
router.get('/my-resources', auth, isStudent, getMyResources);

// Public routes
router.get('/resources', getApprovedResources);
router.get('/resources/:id', getResourceById);

module.exports = router;
