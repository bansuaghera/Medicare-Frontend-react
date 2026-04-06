const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Activity = sequelize.define('Activity', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  activityType: {
    type: DataTypes.ENUM(
      'login',
      'logout',
      'appointment_booked',
      'appointment_cancelled',
      'appointment_completed',
      'prescription_created',
      'prescription_updated',
      'doctor_added',
      'doctor_removed',
      'staff_added',
      'staff_removed',
      'patient_registered'
    ),
    allowNull: false
  },
  relatedUserId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  relatedEntityType: {
    type: DataTypes.ENUM('appointment', 'prescription', 'user', 'none'),
    defaultValue: 'none'
  },
  relatedEntityId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: false,
  indexes: [
    { fields: ['userId'] },
    { fields: ['createdAt'] },
    { fields: ['activityType'] }
  ]
});

module.exports = Activity;
