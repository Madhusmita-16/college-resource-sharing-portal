const express = require('express');
const router = express.Router();
const {
  getPendingResources,
  getAllResources,
  approveResource,
  rejectResource,
  deleteResource,
  getDashboardStats
} = require('../controllers/adminController');
const { auth, isAdmin } = require('../middleware/auth');

// All admin routes are protected
router.get('/pending', auth, isAdmin, getPendingResources);
router.get('/resources', auth, isAdmin, getAllResources);
router.get('/stats', auth, isAdmin, getDashboardStats);
router.put('/approve/:id', auth, isAdmin, approveResource);
router.put('/reject/:id', auth, isAdmin, rejectResource);
router.delete('/delete/:id', auth, isAdmin, deleteResource);

module.exports = router;
