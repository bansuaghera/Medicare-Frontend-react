import React, { useState, useEffect, useRef } from 'react';
import { getRecentActivities } from '../../api/activityAPI';
import ActivityItem from './ActivityItem';
import './activityStyles.css';

const ActivityNotificationBell = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activities, setActivities] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState(new Set());
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const data = await getRecentActivities(userId, 10);
        const recentActivities = Array.isArray(data) ? data : [];
        setActivities(recentActivities);
        setUnreadCount(Math.min(recentActivities.length, 3));
      } catch (err) {
        console.error('Error fetching activities:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchActivities();
      const interval = setInterval(fetchActivities, 60000);
      return () => clearInterval(interval);
    }
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleBellClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
    }
  };

  const toggleSelectActivity = (activityId) => {
    const newSelected = new Set(selectedActivities);
    if (newSelected.has(activityId)) {
      newSelected.delete(activityId);
    } else {
      newSelected.add(activityId);
    }
    setSelectedActivities(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedActivities.size === activities.length) {
      setSelectedActivities(new Set());
    } else {
      const allIds = new Set(activities.map(a => a.id));
      setSelectedActivities(allIds);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedActivities.size === 0) {
      alert('Please select activities to delete');
      return;
    }

    if (!window.confirm(`Delete ${selectedActivities.size} selected activity/activities?`)) {
      return;
    }

    try {
      // Filter out deleted activities
      const remainingActivities = activities.filter(a => !selectedActivities.has(a.id));
      setActivities(remainingActivities);
      setSelectedActivities(new Set());
      alert('Selected activities deleted successfully');
    } catch (err) {
      console.error('Error deleting activities:', err);
      alert('Failed to delete activities');
    }
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={handleBellClick}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          padding: '8px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.2s'
        }}
        title="Notifications"
      >
        🔔
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '0px',
            right: '0px',
            background: '#dc3545',
            color: 'white',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
            minWidth: '24px'
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          right: '0px',
          top: 'calc(100% + 8px)',
          width: '420px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.25)',
          border: '1px solid #e0e0e0',
          zIndex: 10000,
          maxHeight: '500px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInDown 0.3s ease-out'
        }}>
          {/* Header with Select All and Delete */}
          <div style={{
            padding: '14px 16px',
            borderBottom: '2px solid #f0f0f0',
            background: '#f9f9f9',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                checked={selectedActivities.size === activities.length && activities.length > 0}
                onChange={toggleSelectAll}
                disabled={activities.length === 0}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                title="Select all"
              />
              <span style={{ fontWeight: '700', fontSize: '15px', color: '#333' }}>
                🔔 Notifications
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {selectedActivities.size > 0 && (
                <>
                  <span style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>
                    {selectedActivities.size} selected
                  </span>
                  <button
                    onClick={handleDeleteSelected}
                    style={{
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '600',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#c82333'}
                    onMouseLeave={(e) => e.target.style.background = '#dc3545'}
                    title="Delete selected activities"
                  >
                    🗑️ Delete
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div style={{
            overflowY: 'auto',
            padding: '8px',
            flex: 1,
            background: '#ffffff',
            maxHeight: '350px'
          }}>
            {loading && (
              <div style={{
                padding: '40px 20px',
                textAlign: 'center',
                color: '#999',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                flexDirection: 'column'
              }}>
                <span className="activity-loading-spinner"></span>
                <span>Loading notifications...</span>
              </div>
            )}
            {!loading && activities.length === 0 && (
              <div style={{
                padding: '50px 20px',
                textAlign: 'center',
                color: '#999',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                📭 No activities yet
              </div>
            )}
            {!loading && activities.length > 0 && activities.map((activity) => (
              <div
                key={activity.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '8px',
                  borderRadius: '8px',
                  backgroundColor: selectedActivities.has(activity.id) ? '#e7f3ff' : 'transparent',
                  transition: 'all 0.2s',
                  border: selectedActivities.has(activity.id) ? '1px solid #b3d9ff' : '1px solid transparent'
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedActivities.has(activity.id)}
                  onChange={() => toggleSelectActivity(activity.id)}
                  style={{
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer',
                    marginTop: '8px',
                    flexShrink: 0
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <ActivityItem activity={activity} />
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          {activities.length > 0 && (
            <div style={{
              padding: '12px 16px',
              borderTop: '1px solid #f0f0f0',
              textAlign: 'center',
              background: '#f9f9f9'
            }}>
              <a href="/activities" style={{
                fontSize: '13px',
                color: '#007bff',
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = '#0056b3'}
              onMouseLeave={(e) => e.target.style.color = '#007bff'}
              >
                → View All Notifications
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ActivityNotificationBell;
