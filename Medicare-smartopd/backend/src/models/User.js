const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'doctor', 'staff', 'user'),
    defaultValue: 'user'
  },
  settings: {
    type: DataTypes.JSONB,
    defaultValue: {
      theme: 'original',
      primaryColor: '#0fb48c',
      fontFamily: "'Inter', sans-serif",
      twoFactorEnabled: false,
      loginAlerts: true,
      dataPrivacy: 'standard'
    }
  },
  profilePhoto: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  resetOtp: {
    type: DataTypes.STRING,
    allowNull: true
  },
  resetOtpExpiry: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = User;
