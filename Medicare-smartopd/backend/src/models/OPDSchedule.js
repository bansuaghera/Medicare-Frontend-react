const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User'); // To associate with a specific doctor (who is technically a user)

const OPDSchedule = sequelize.define('OPDSchedule', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  doctorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  duration: {
    type: DataTypes.INTEGER, // in minutes
    allowNull: false,
    defaultValue: 15
  },
  totalSlots: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  days: {
    type: DataTypes.JSONB, // Array of days ['Mon', 'Tue', ...]
    allowNull: false
  },
  room: {
    type: DataTypes.STRING,
    allowNull: false
  },
  floor: {
    type: DataTypes.STRING,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true
});

// Associations
OPDSchedule.belongsTo(User, { as: 'doctor', foreignKey: 'doctorId' });
User.hasMany(OPDSchedule, { foreignKey: 'doctorId' });

module.exports = OPDSchedule;
