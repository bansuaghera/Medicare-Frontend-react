import API from './axiosConfig';

// Get user's recent activities (limited to a configurable count)
export const getRecentActivities = async (userId, limit = 10) => {
  try {
    const response = await API.get(`/activities/recent/${userId}`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    throw error;
  }
};

// Get all user's activities with pagination
export const getUserActivities = async (userId, limit = 50, offset = 0) => {
  try {
    const response = await API.get(`/activities/user/${userId}`, {
      params: { limit, offset }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user activities:', error);
    throw error;
  }
};

// Get system-wide activities (Admin only)
export const getAllActivities = async (limit = 100, offset = 0, activityType = null, userId = null) => {
  try {
    const params = { limit, offset };
    if (activityType) params.activityType = activityType;
    if (userId) params.userId = userId;

    const response = await API.get('/activities/admin', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching all activities:', error);
    throw error;
  }
};

// Get system-wide recent activities (Admin Dashboard)
export const getSystemRecentActivities = async (limit = 20) => {
  try {
    const response = await API.get('/activities/system/recent', {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching system activities:', error);
    throw error;
  }
};

// Delete selected activities by IDs
export const deleteSelectedActivities = async (activityIds) => {
  try {
    const response = await API.delete('/activities', {
      data: { activityIds }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting activities:', error);
    throw error;
  }
};

// Log an activity (internal use)
export const logActivity = async (activityData) => {
  try {
    const response = await API.post('/activities/log', activityData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Mark all activities for a user as read
 * @param {string} userId - ID of the user
 * @returns {Promise}
 */
export const markActivitiesAsRead = async (userId) => {
  try {
    const response = await API.put(`/activities/read/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error marking activity as read:', error);
    throw error;
  }
};

/**
 * Get count of unread notifications for a user
 * @param {string} userId - ID of the user
 * @returns {Promise}
 */
export const getUnreadNotificationsCount = async (userId) => {
  try {
    const response = await API.get(`/activities/unread-count/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching unread count:', error);
    throw error;
  }
};
