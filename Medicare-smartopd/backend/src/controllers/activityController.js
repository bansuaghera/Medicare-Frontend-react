const Activity = require('../models/Activity');
const User = require('../models/User');
const { Op } = require('sequelize');

// @desc Log an activity
// @route POST /api/activities/log
// @access Internal
exports.logActivity = async (req, res) => {
  try {
    const { userId, activityType, relatedUserId, relatedEntityType, relatedEntityId, description } = req.body;

    const activity = await Activity.create({
      userId,
      activityType,
      relatedUserId: relatedUserId || null,
      relatedEntityType: relatedEntityType || 'none',
      relatedEntityId: relatedEntityId || null,
      description: description || null
    });

    res.status(201).json(activity);
  } catch (error) {
    console.error('Error logging activity:', error);
    res.status(500).json({ message: 'Error logging activity', error: error.message });
  }
};

// @desc Get activities for a user (their own + showing relevant activities)
// @route GET /api/activities/user/:userId
// @access Private
exports.getUserActivities = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const activities = await Activity.findAndCountAll({
      where: {
        userId: userId
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'role']
        },
        {
          model: User,
          as: 'relatedUser',
          attributes: ['id', 'name', 'email', 'role']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      total: activities.count,
      activities: activities.rows
    });
  } catch (error) {
    console.error('Error fetching user activities:', error);
    res.status(500).json({ message: 'Error fetching activities', error: error.message });
  }
};

// @desc Get all activities in the system (Admin only)
// @route GET /api/activities/admin
// @access Private/Admin
exports.getAllActivities = async (req, res) => {
  try {
    const { limit = 100, offset = 0, activityType, userId } = req.query;

    const where = {};
    if (activityType) where.activityType = activityType;
    if (userId) where.userId = userId;

    const activities = await Activity.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'role']
        },
        {
          model: User,
          as: 'relatedUser',
          attributes: ['id', 'name', 'email', 'role']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      total: activities.count,
      activities: activities.rows
    });
  } catch (error) {
    console.error('Error fetching all activities:', error);
    res.status(500).json({ message: 'Error fetching activities', error: error.message });
  }
};

// @desc Get recent activities for dashboard
// @route GET /api/activities/recent/:userId
// @access Private
exports.getRecentActivities = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10 } = req.query;

    const activities = await Activity.findAll({
      where: {
        userId: userId
      },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit, 10)
    });

    res.json(activities);
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    res.status(500).json({ message: 'Error fetching activities', error: error.message });
  }
};

// @desc Get system-wide recent activities (Admin Dashboard)
// @route GET /api/activities/system/recent
// @access Private/Admin
exports.getSystemRecentActivities = async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const activities = await Activity.findAll({
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'role']
        }
      ]
    });

    res.json(activities);
  } catch (error) {
    console.error('Error fetching system activities:', error);
    res.status(500).json({ message: 'Error fetching system activities', error: error.message });
  }
};

// @desc Delete old activities (cleanup - run periodically)
// @route DELETE /api/activities/cleanup
// @access Private/Admin
exports.cleanupOldActivities = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const deleted = await Activity.destroy({
      where: {
        createdAt: {
          [Op.lt]: thirtyDaysAgo
        }
      }
    });

    res.json({ message: `Deleted ${deleted} activities older than 30 days` });
  } catch (error) {
    console.error('Error cleaning up activities:', error);
    res.status(500).json({ message: 'Error cleaning up activities', error: error.message });
  }
};

// @desc Delete a list of selected activities
// @route DELETE /api/activities
// @access Private/Admin
exports.deleteSelectedActivities = async (req, res) => {
  try {
    const { activityIds } = req.body;
    if (!Array.isArray(activityIds) || activityIds.length === 0) {
      return res.status(400).json({ message: 'No activity IDs provided' });
    }

    const deleted = await Activity.destroy({
      where: {
        id: activityIds
      }
    });

    res.json({ message: `Deleted ${deleted} activities successfully` });
  } catch (error) {
    console.error('Error deleting selected activities:', error);
    res.status(500).json({ message: 'Error deleting selected activities', error: error.message });
  }
};

// @desc Mark all user activities as read
// @route PUT /api/activities/read/:userId
// @access Private
exports.markUserActivitiesRead = async (req, res) => {
  try {
    const { userId } = req.params;

    await Activity.update(
      { isRead: true },
      { where: { userId, isRead: false } }
    );

    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking activity as read:', error);
    res.status(500).json({ message: 'Error marking activities as read', error: error.message });
  }
};

// @desc Get count of unread activities for a user
// @route GET /api/activities/unread-count/:userId
// @access Private
exports.getUnreadCount = async (req, res) => {
  try {
    const { userId } = req.params;

    const count = await Activity.count({
      where: { userId, isRead: false }
    });

    res.json({ success: true, unreadCount: count });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({ message: 'Error getting unread count', error: error.message });
  }
};
