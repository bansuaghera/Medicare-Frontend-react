const express = require('express');
const router = express.Router();
const {
  logActivity,
  getUserActivities,
  getAllActivities,
  getRecentActivities,
  getSystemRecentActivities,
  cleanupOldActivities,
  deleteSelectedActivities,
  markUserActivitiesRead,
  getUnreadCount
} = require('../controllers/activityController');

// Log an activity
router.post('/log', logActivity);

// Get user's own activities
router.get('/user/:userId', getUserActivities);

// Get recent activities for user (limited to 10)
router.get('/recent/:userId', getRecentActivities);

// Mark all user activities as read
router.put('/read/:userId', markUserActivitiesRead);

// Get count of unread notifications
router.get('/unread-count/:userId', getUnreadCount);

// Get all activities (Admin only)
router.get('/admin', getAllActivities);

// Get system-wide recent activities (Admin Dashboard)
router.get('/system/recent', getSystemRecentActivities);

// Cleanup old activities
router.delete('/cleanup', cleanupOldActivities);

// Delete selected activities
router.delete('/', deleteSelectedActivities);

module.exports = router;
