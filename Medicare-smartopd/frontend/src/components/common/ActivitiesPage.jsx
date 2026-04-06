import React, { useState, useEffect } from 'react';
import { getUserActivities } from '../../api/activityAPI';
import ActivityItem from './ActivityItem';
import './activityStyles.css';

const ActivitiesPage = ({ userId }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalActivities, setTotalActivities] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const itemsPerPage = 20;

  const activityTypes = [
    { value: 'all', label: 'All Activities' },
    { value: 'login', label: 'Login' },
    { value: 'logout', label: 'Logout' },
    { value: 'appointment_booked', label: 'Appointment Booked' },
    { value: 'appointment_cancelled', label: 'Appointment Cancelled' },
    { value: 'prescription_created', label: 'Prescription Created' }
  ];

  useEffect(() => {
    fetchActivities();
  }, [currentPage, selectedFilter, userId]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const offset = (currentPage - 1) * itemsPerPage;
      const data = await getUserActivities(userId, itemsPerPage, offset);
      setActivities(data.activities || []);
      setTotalActivities(data.total || 0);
      setError(null);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError('Failed to load activities');
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalActivities / itemsPerPage);

  return (
    <div className="activity-page">
      <div className="activity-page-header">
        <div className="activity-page-title">📊 Activity Log</div>
      </div>

      <div className="activity-page-content">
        <div className="activity-filters">
          {activityTypes.map((type) => (
            <button
              key={type.value}
              className={`activity-filter-btn ${selectedFilter === type.value ? 'active' : ''}`}
              onClick={() => {
                setSelectedFilter(type.value);
                setCurrentPage(1);
              }}
            >
              {type.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="activity-loading">
            <span className="activity-loading-spinner"></span>
            Loading activities...
          </div>
        )}

        {error && (
          <div className="activity-empty">{error}</div>
        )}

        {!loading && activities.length === 0 && (
          <div className="activity-empty">
            No activities found
          </div>
        )}

        {!loading && activities.length > 0 && (
          <>
            <div className="activity-list">
              {activities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="activity-pagination">
                <button
                  className="activity-pagination-btn"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  First
                </button>
                <button
                  className="activity-pagination-btn"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  ← Previous
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, currentPage - 2) + i;
                  if (pageNum > totalPages) return null;
                  return (
                    <button
                      key={pageNum}
                      className={`activity-pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  className="activity-pagination-btn"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next →
                </button>
                <button
                  className="activity-pagination-btn"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  Last
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ActivitiesPage;
