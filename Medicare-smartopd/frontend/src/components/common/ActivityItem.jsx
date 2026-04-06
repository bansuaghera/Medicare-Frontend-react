import React from 'react';
import './activityStyles.css';

// Format the activity type to readable text
const formatActivityType = (type) => {
  const typeMap = {
    'login': 'Logged In',
    'logout': 'Logged Out',
    'appointment_booked': 'Appointment Booked',
    'appointment_cancelled': 'Appointment Cancelled',
    'appointment_completed': 'Appointment Completed',
    'prescription_created': 'Prescription Created',
    'prescription_updated': 'Prescription Updated',
    'doctor_added': 'Doctor Added',
    'doctor_removed': 'Doctor Removed',
    'staff_added': 'Staff Added',
    'staff_removed': 'Staff Removed',
    'patient_registered': 'Patient Registered',
    'appointment_updated': 'Appointment Updated',
    'profile_updated': 'Profile Updated'
  };
  return typeMap[type] || type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// Get color for activity type
const getActivityColor = (type) => {
  const colorMap = {
    'login': 'success',
    'logout': 'info',
    'appointment_booked': 'primary',
    'appointment_cancelled': 'warning',
    'appointment_completed': 'success',
    'prescription_created': 'info',
    'prescription_updated': 'info',
    'doctor_added': 'success',
    'doctor_removed': 'danger',
    'staff_added': 'success',
    'staff_removed': 'danger',
    'patient_registered': 'success',
    'profile_updated': 'primary',
    'appointment_updated': 'warning'
  };
  return colorMap[type] || 'secondary';
};

// Get icon for activity type
const getActivityIcon = (type) => {
  const iconMap = {
    'login': '🔓',
    'logout': '🔐',
    'appointment_booked': '📅',
    'appointment_cancelled': '❌',
    'appointment_completed': '✅',
    'prescription_created': '💊',
    'prescription_updated': '📝',
    'doctor_added': '👨‍⚕️',
    'doctor_removed': '🚫',
    'staff_added': '👤',
    'staff_removed': '🚫',
    'patient_registered': '📋',
    'profile_updated': '👤',
    'appointment_updated': '🔄'
  };
  return iconMap[type] || '📌';
};

// Single Activity Item Component
const ActivityItem = ({ activity }) => {
  const formatTime = (date) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffMs = now - activityDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return activityDate.toLocaleDateString();
  };

  const color = getActivityColor(activity.activityType);
  const icon = getActivityIcon(activity.activityType);

  return (
    <div className={`activity-item activity-${color}`}>
      <div className="activity-icon">{icon}</div>
      <div className="activity-content">
        <div className="activity-type">
          {formatActivityType(activity.activityType)}
        </div>
        {activity.description && (
          <div className="activity-description">{activity.description}</div>
        )}
        <div className="activity-time">{formatTime(activity.createdAt)}</div>
      </div>
    </div>
  );
};

export default ActivityItem;
