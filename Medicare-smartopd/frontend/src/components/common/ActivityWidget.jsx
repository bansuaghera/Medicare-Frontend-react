import React, { useState, useEffect } from 'react';
import { getRecentActivities } from '../../api/activityAPI';
import ActivityItem from './ActivityItem';
import './activityStyles.css';

const ActivityWidget = ({ userId, limit = 10 }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const data = await getRecentActivities(userId, limit);
        setActivities(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError('Failed to load activities');
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchActivities();
      // Refresh activities every 30 seconds
      const interval = setInterval(fetchActivities, 30000);
      return () => clearInterval(interval);
    }
  }, [userId, limit]);

  return (
    <div className="activity-widget">
      <div className="activity-widget-header">
        <div className="activity-widget-title">
          <span className="activity-widget-title-icon">📊</span>
          Recent Activity
        </div>
        <a href="/activities" className="activity-view-more">
          View All →
        </a>
      </div>

      {loading && (
        <div className="activity-loading">
          <span className="activity-loading-spinner"></span>
          Loading activities...
        </div>
      )}

      {error && (
        <div className="activity-empty">
          {error}
        </div>
      )}

      {!loading && activities.length === 0 && (
        <div className="activity-empty">
          No recent activities
        </div>
      )}

      {!loading && activities.length > 0 && (
        <div className="activity-list">
          {activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityWidget;
